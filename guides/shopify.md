---
layout: page
width: xsmall
permalink: /shopify-installation
title: Shopify installation
metaDesc: Learn how to seamlessly integrate DSCM (Did someone clone me) into your Shopify website using a plugin, protecting your shop against website clones.
tags: 
  - Shopify
  - DSCM
---

# Shopify installation

In this guide, we will show you how to install DSCM on your Shopify Website, allowing you to receive email alerts whenever your website is cloned. This proactive approach can help you maintain control over your site's content and security.

## Get your personal link
Before proceeding with the installation, you need to obtain your unique DSCM personal link. Follow these steps to acquire it:

1. Start by visiting the official DSCM website at [https://didsomeoneclone.me](https://didsomeoneclone.me)
2. On the DSCM website, enter your website's domain and your email address.
3. Wait for a few moments as DSCM processes your request. You will receive an email containing your personal link. In the email, click the "**Confirm email address**" button. This will lead you to a destination page where your personal link is displayed. Make sure to copy this link for later use.

Now that you have your personal link, you can proceed with the installation on your Shopify website.

![DSCM Link](/assets/img/shopify/dscm-link.jpg)

## Installation Steps
To install DSCM on your website, you will need to incorporate a code snippet into your theme's source code. Follow these steps to get started:

### 1. Access your shopify theme editor:
Begin by accessing your Shopify admin panel and navigate to "**Online Store**" and then "**Themes**" .

![Access Themes Editor](/assets/img/shopify/access-themes.jpg)

Select the theme you wish to edit and click on "**Actions**" and then "**Edit code**."

![Edit Code](/assets/img/shopify/edit-theme.jpg)

### 2. Insert HTML code

After clicking on "**Edit Code**" you will be directed to the Shopify theme editor. Here, you will find several files within your Shopify theme. Locate the "**theme.liquid**" file.

![Locate Theme Liquid File](/assets/img/shopify/locate-liquid-theme.jpg)

Integrate the following HTML code snippet into the appropriate section within this file:

```
<script src="<YOUR_PERSONAL_LINK_HERE>" crossorigin="anonymous"></script>
```

Do not forget to add your own personal link to the code. This code will operate inconspicuously, remaining invisible to visitors.

### 4. Save and update your theme:
After integrating the code snippet, save the changes to your theme's source code. Next, publish or update your website to apply the changes.

With DSCM now integrated into your Shopify store, you're all set to monitor for cloning attempts. Anytime someone attempts to clone your website, you will receive email alerts notifying you of suspicious activity.
