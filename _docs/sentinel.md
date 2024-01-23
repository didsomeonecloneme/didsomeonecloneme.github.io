---
title: Connecting to Azure Sentinel
subtitle: This document describes how to write our alerts to Azure Sentinel via Webhooks
tags: [azure, sentinel, webhooks]
---

To write all the DSCM alerts to Azure Sentinel, we are going to use a Logic App in your Azure environment. We assume that you already have a Azure Sentinel environment running.

## Setup the Logic App
The first step is to login to your Azure environment. We are going to create a new resource, a **Logic App**. Use the following settings while setting up the **Logic App**

![Create Logic App](/assets/img/blogs/create_logic_app.png)

After creating the **Logic App**, we will click the **Go to resource** button. When landing in the resource, we are going to the **Logic App Designer**.
Start to create a **Blank Logic App**.

As a trigger, we will search and select the **When a HTTP request is received** trigger. No further changes are required on this trigger.

Then in a **New step**, we will add a **Azure Log Analytics Data Collector** with a **Send Data** action. After creating the action, you will need to define the following settings:
* Connection name: dscm
* Workspace ID: obtain this value from your Sentinel Log Analytics workspace
* Workspace Key: obtain this value from your Sentinel Log Analytics workspace

The following screenshot shows where to obtain the **Workspace ID** and **Workspace Key** value of your Sentinel instance.

![Obtain Sentinel settings](/assets/img/blogs/sentinel_id_and_key.png)

Define **Body** as the **JSON Request Body**. After filling in all settings, **Save** the Logic App. Your final Logic App should look similar to this:

![Final logic app](/assets/img/blogs/final_logic_app.png)

## Obtain the Logic App URL
Now we've setup the Logic App, we need to obtain its Url. The Url is available on the **Overview** page of the Logic App:

![Obtain Logic App Url](/assets/img/blogs/sentinel_workflow_url.png)

Copy the **Workflow URL**.

## Configuring webhook
After signing up for a Premium plan and creating the Logic App, you can login to the <a href="/login/">Premium Dashboard</a>. Then go to the **Installations overview** tab and click on the **Configure** button in the **Settings** column.

![Overview](/assets/img/blogs/installations_overview_configure.png)

This will open a Settings popup, where you will need to submit your Webhook endpoint URL.

![Popup](/assets/img/blogs/settings_popup.png)

Past the URL of your Logic App into the Webhook field and click **Save**. The setting will go into **[ENABLED]** state.
Now, whenever a detection occurs, your alert is written to Azure Sentinel:

![Sentinel](/assets/img/blogs/sentinel.png)

It may take some time for Sentinel to understand the Webhooks data, so if the data is incomplete, please be patience. It may take a while.

Happy detecting!
