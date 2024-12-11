---
title: Enable Log Monitoring
subtitle: This document describes how to enable Log Monitoring for Microsoft 365 tenants
tags: [enable, log monitoring]
---

Enabling Log Monitoring is possible via the DSCM Enterprise Dashboard. Please note that Log Monitoring requires an Entra ID Premium P1 or P2 license in the protected tenant.

1. Login into the Enterprise Dashboard
2. Open the "Installations overview" tab
3. Locate a microsoftonline.com protected website and click its "Configure" button
4. A dialog will be displayed. Click on the "Configure" button at the "Log monitoring" section
5. Sign in with a Microsoft account that exists within the tenant you want to monitor. The following least privileges are required (or higher):
* Global Reader
* Reports Reader
* Security Administrator
* Security Operator
* Security Reader
6. A message will be displayed that Log monitoring is enabled. 

Repeat above steps for every tenant you like to protect.