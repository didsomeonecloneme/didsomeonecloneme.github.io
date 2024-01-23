---
title: Webhook support
subtitle: This document covers the Webhook support feature
tags: [webhook]
---

For our Premium features, we provide webhooks. This allows you to write all the detections to a external system. For example a SIEM environment. Our webhooks send JSON via a POST-request to the provided URL. The table below shows all fields that are available via our webhook:

| Key   |      Value      | 
|----------|:-------------|
| website_url| The URL of your protected website | 
| clone_url |  The URL of the detected clone   |
| clone_domain | The domain of the detected clone |
| mail | Your email |
| embedlink | Your personal link|
| plan | The plan |
| client_ip | IP-address of the victim |
| victim_page_views | Number of PageViews on the clone |
| last_activity | Timestamp of the Last Activity on the clone |
| urlscan | A link to the automated analysis |
| mitigated | Mitgation status |
| aitm | Whether the clone is a Evilginx clone |