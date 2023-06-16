---
layout: page
width: xsmall
permalink: /privacy/
title: Privacy \| Website clone monitor
image: /uploads/dscm.png
description: The DSCM privacy page. This page describes what data we collect, where it's located and for what purposes.
---

DSCM stores information that is required to deliver the service. We are only using this information to deliver our services and will never use it for other purposes nor share it with third parties. This page lists all information that we store.

### Registration

To be able to send notifications we store the following information:
* your email address
* your website domain

### Notifications

After sending notifications we store the following information:
* the cloned domain
* the email address the notification was send to
* the phishing site domain

### Diagnostics and debugging

To debug issues in DSCM we store diagnostics information. We are using Azure Application Insights to track the usage of our Azure Functions.
The Application Insights logs are automatically purged after 90 days.

### Cloud-based

DSCM is heavily cloud based. We are using the following cloud services:
* Microsoft Azure for registration & callback services including data storage
* Cloudflare DNS & Caching services
* Github to host our website frontend
* SendGrid for sending the e-mail notifications
