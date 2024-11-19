# Curbhub DataProvider Connector

The **Curbhub DataProvider Connector** allows seamless integration of data from Curbhub's platform into [Looker Studio](https://lookerstudio.google.com/) (formerly Google Data Studio). Using this connector, users can fetch structured data via REST API and create meaningful reports and dashboards.

---

## Features

- Effortlessly connect Looker Studio to Curbhub's DataProvider services.
- Fetch and visualize data for analytics and reporting.
- Internal token base authentication.
- Fully customizable to meet specific reporting needs.

---

## Prerequisites

- A [Google Cloud Platform](https://cloud.google.com/) project with Apps Script enabled.
- Access to Curbhub DataProvider REST API endpoints.

---

# Installation

Follow these steps to set up and use the connector:

## 1. Set Up Google Apps Script

1. Open [Google Apps Script](https://script.google.com/).
2. Create a new project by clicking on **+ New project**.
3. Copy the provided script into the project editor.

## 2. Copy files

Copy Code.gs and appsscript.json content in your project files

## 3. Deploy as a Community Connector

1. In the Apps Script editor, go to **Deploy > Test deployments**.
2. Copy **Deployment ID**

## 4. Authorize the Script

1. After deployment, you will be prompted to authorize the script.
2. Follow the on-screen instructions to grant the necessary permissions.

## 5. Add the Connector to Google Data Studio

1. Open [Google Data Studio](https://datastudio.google.com/).
2. Click on **Create > Data Source**.
3. In the Connectors section, search for **Build Your Own**.
4. Enter yout **Deployment ID** and click on **VALIDATE**.
5. Select connector

## 6. Configure the Data Source

1. Enter the following details:
   - **Backend URL**: URL of the backend service providing schema and data.
   - **API Token**: Token for authenticating with the backend API.
   - **Source Table**: Name of the table to fetch data from.
2. **Add A PARAMETER** "token" (Data Type: Text) .

## 7. Start Building Reports

1. After setting up the data source, you can use the fields provided by your backend schema to build visualizations in Google Data Studio.
2. In report Editing view select **Recource** menu then click on **Manage report URL parameters**
3. Click on **Allow to be modified in report URL** checkbox
