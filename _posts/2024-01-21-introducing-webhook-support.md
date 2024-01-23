---
title: Introducing webhook support
author: dscm
image: /uploads/dscm_sm.png
categories: [DSCM, Premium, Webhooks]
---

Today we are adding support for notifications via webhooks to DSCM Premium. Webhooks are often used by SOC's to ingest data into a SIEM/SOAR system. This way the SOC is able to centralize their logs into one system. This is just an example use-case of Webhooks. They can be used for many more integrations. We just take this one as an example. This blog explains how to use our webhooks.

## Scenario
So, let's assume you would like to protect your Microsoft 365 tenants login page with DSCM. This allows you to get notified whenever your tenant, or it's users, are targeted by a phishing attack. Not only 'classic' phishing attacks are detected, even the new Adversary-in-the-Middle (AiTM) attack can be detected using DSCM. 

Cybercriminals may use AiTM attacks to even bypass the Multi-Factor Authentication (MFA) on a secured account. After a detection is spotted by DSCM, you can take action to reduce the impact of the attack. Such as investigating whether the phishing attempt was successful, resetting the password, revoking all sessions etc.

You would like to have all detections in your SIEM environment for your SOC team. In this example, we will show the Microsoft Azure Sentinel SIEM as an example.

## Installation
In order to implement above detection, you will need to take the steps described on the <a href="https://didsomeoneclone.me/microsoft-tenant-installation">Microsoft 365 tenant installation</a> page. Make sure to sign up for a <a href="/?plan=premium">Premium</a> account, because the webhooks are only supported in the Premium plan. After taking the steps described, you successfully setup DSCM and you will receive email alerts whenever your Microsoft 365 login page is targeted in a phishing attack. We still have some steps to take, in order to receive the notifications via webhooks instead.

## Creating a Logic App and configure the webhook
To ingest data into Azure Sentinel, we are going to use a Logic App in Azure. Instructions how to create the Logic App are available within our Docs section <a href="/docs/sentinel/">Connecting to Azure Sentinel</a>. Follow the steps to create the Logic App and configure the webhook.

## Implementation completed
Now, whenever a detection occurs, it is written to your Azure Sentinel instance. Allowing your SOC to have all the alerts in a single place.
After querying the **dscm_cl** field, the data is returned:

![Sentinel](/assets/img/blogs/sentinel.png)

It may take some time for Sentinel to understand the Webhooks data, so if the data is incomplete, please be patience. It may take a while.

Happy detecting!




