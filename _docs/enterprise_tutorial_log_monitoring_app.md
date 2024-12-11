---
title: Configure the Log Monitoring App
subtitle: This document describes how to configure the Log Monitoring App
tags: [configure, log monitoring, app]
---

In order to use the Log monitoring feature, you need to configure a Log Monitoring app registration within your Entra ID. This app is used to gain access to the Microsoft Graph API of the protected tenants. All access tokens are stored within your Entra ID tenant / DSCM Enterprise solution.

## Create the App

1. Go to the [Azure Portal](https://portal.azure.com) and navigate to the Entra ID tenant.
2. Navigate to the "App registrations" section.
3. Click on "New registration".
4. Fill in the required fields:
    - Name: `didsomeoneclone.me Log Monitoring App`
    - Supported account types: `Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant)`
5. Click on "Register".
6. Click on "Add a Redirect URI"
7. Click on "Add a platform"
8. Click on "Web"
9. Fill in the required fields:
    - Redirect URI: `https://dscm-api-<YOUR_AZURE_APP_NAME>.azurewebsites.net/m365_logmon_auth`
10. Click on "Configure"
11. Click on "Add URI"
12. Fill in the required fields:
    - Redirect URI: `https://dscm-api-<YOUR_AZURE_APP_NAME>.azurewebsites.net/m365_logmon_mitigate`
13. Click on "Save"
14. Click on "API permissions"
15. Click on "Add a permission"
16. Click on "Microsoft Graph"
17. Click on "Delegated permissions"
18. Click on "AuditLog.Read.All"
19. Click on "Add permissions"
20. Repeat step 15-19 for the following permissions:
    - User.EnableDisableAccount.All
    - User.RevokeSessions.All
21. Click on "Certificates & secrets"
22. Click on "New client secret"
23. Fill in the required fields:
    - Description: `didsomeoneclone.me Log Monitoring App`
    - Expires: `730 days (24 months)`
24. Click on "Add"
25. Copy the "Client secret" and "Client ID".

Email the Client ID and Client Secret to contact@didsomeoneclone.me. We will enable Log Monitoring in your DSCM Enterprise solution.