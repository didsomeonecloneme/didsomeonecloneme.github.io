---
title: Adding Microsoft 365 Mitigations 
author: dscm
image: /uploads/dscm_sm.png
categories: [DSCM, Premium, Microsoft, Mitigations]
---

Today we are adding support for a new Microsoft 365 mitigation in our Premium plan. This mitigation allows you to not only detect a phishing attempt, but it also enables you to warn the users within your tenant whenever they visit a (AITM) phishing page. The warning states that the victim should not login with their credentials (password). This may prevent a successful phishing attack, protecting your organization.

## Screenshot
What does the warning look like? The screenshot below shows the warning that will be displayed whenever a victim is part of a phishing attack.

![Mitigation](/assets/img/microsoft/mitigation_warning.png)

## Installation
In order to enable the mitigation, you will need a Premium plan. Also, make sure that you have installed the newest version of our CSS, as we introduced an updated version in order to provide this feature ([install instructions](https://didsomeoneclone.me/microsoft-tenant-installation)). 

Now it is time to enable the mitigation. Login to our [Premium dashboard](/login/). Go to the `Installations overview` tab and click on the `Configure` button at the website you do like to protect. Select the dropdown under the `Automated mitigations` setting and select `warn_user`:

![Enable Mitigation](/assets/img/microsoft/enable_automated_mitigations.png)

Click the `Save` button. 

## Done

For all new phishing attempts, a warning will be displayed to the potential victim. Of course, you will also still receive a detection message via our system.

Happy preventing!




