function sendUserError(message) {
  var cc = DataStudioApp.createCommunityConnector();
  cc.newUserError().setText(message);
}

function getAuthType() {
  return { type: "NONE" };
}

function isAdminUser() {
  return false;
}

function getConfig(request) {
  var cc = DataStudioApp.createCommunityConnector();
  var config = cc.getConfig();

  config.newTextInput().setId("backend_url").setName("Backend URL");
  config.newTextInput().setId("token").setName("API Token");
  config.newTextInput().setId("table").setName("Source Table");

  config.setDateRangeRequired(true);

  return config.build();
}

function getSchema(request) {
  var CACHE_EXPIRATION_SECONDS = 3600 * 24;
  var schema = [];
  if (request?.configParams?.backend_url && request?.configParams?.table) {
    var cache = CacheService.getScriptCache();
    var tableName = request?.configParams?.table;
    var cachedSchema = cache.get(`schema.${tableName}`);
    if (cachedSchema) {
      console.log("Schema retrieved from cache.");
      schema = JSON.parse(cachedSchema);
    } else {
      let url = `${request.configParams.backend_url}/data-provider/get-schema/googleDataStudio/${tableName}`;
      console.log({ url });
      try {
        var response = UrlFetchApp.fetch(url);
      } catch (e) {
        console.log('"' + url + '" returned an error:' + e);
      }

      try {
        var content = JSON.parse(response);
        console.log({ content });
      } catch (e) {
        console.log("Invalid JSON format. " + e);
      }

      var cc = DataStudioApp.createCommunityConnector();
      var fields = cc.getFields();

      var types = cc.FieldType;
      if (content.data && content.data.fields) {
        console.log(`${content.data.fields.length} field fetched`);

        var aggregations = cc.AggregationType;
        content.data.fields.forEach(function (field) {
          if (field.additionalData?.semantics?.conceptType === "DIMENSION") {
            var f = fields
              .newDimension()
              .setId(field.name)
              .setName(field.label);

            if (cc.FieldType[field.additionalData.semantics.semanticType]) {
              f.setType(
                cc.FieldType[field.additionalData.semantics.semanticType]
              );
            }
          } else {
            var f = fields
              .newMetric()
              .setId(field.name)
              .setName(field.label)
              .setType(cc.FieldType[field.dataType]);

            if (aggregations[field.additionalData?.defaultAggregationType]) {
              f.setAggregation(
                aggregations[field.additionalData?.defaultAggregationType]
              );
            }
          }
        });
        schema = fields.build();
        cache.put(
          `schema.${tableName}`,
          JSON.stringify(schema),
          CACHE_EXPIRATION_SECONDS
        );
      }
    }
  }
  return { schema: schema };
}

function getData(request) {
  console.log("req", request);
  if (request?.configParams?.backend_url && request?.configParams?.table) {
    var token = request?.configParams?.token ?? "";
    let url = `${request.configParams.backend_url}/data-provider/get-data/googleDataStudio/${request.configParams.table}?token=${token}`;
    var data = request?.dateRange ? request.dateRange : {};
    try {
      const options = {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(data),
      };
      var response = UrlFetchApp.fetch(url, options);
    } catch (e) {
      console.log('"' + url + '" returned an error:' + e);
    }

    try {
      var content = JSON.parse(response);
    } catch (e) {
      console.log("Invalid JSON format. " + e);
    }
  }
  if (!content?.result) {
    sendUserError("Token is expired");
  }
  var rows = [];
  var schema = [];
  var fieldIndexes = [];

  var tableSchema = getSchema(request).schema;

  request?.fields?.forEach((field) => {
    let schemaIdx = tableSchema.findIndex((s) => s.name === field.name);
    if (schemaIdx >= 0) {
      fieldIndexes.push(schemaIdx);
      schema.push(tableSchema[schemaIdx]);
    }
  });
  if (content?.data?.length) {
    rows = content.data.map(function (item) {
      return {
        values: fieldIndexes.map((idx) => {
          return item[idx];
        }),
      };
    });
  } else {
    rows = [];
  }
  console.log(`${rows.length} rows fetched`);
  return {
    schema: schema,
    rows: rows,
  };
}
