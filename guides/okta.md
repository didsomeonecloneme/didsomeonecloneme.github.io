---
layout: page
width: xsmall
permalink: /okta-installation/
title: Okta installation
metaDesc: Learn how to seamlessly integrate DSCM into your Okta login page
tags: 
  - Shopify
  - DSCM
---

# Okta installation

In this guide, we'll walk you through the process of integrating DSCM into your Okta login page. By doing so, you'll be able to receive alerts whenever someone performs a (AITM) phishing attack against your Okta login page. This enables you to protect your users and organization.

## Obtain your personal link
Before proceeding with the integration, you'll need to obtain your personal DSCM link:

- Visit the official DSCM website at [https://didsomeoneclone.me](https://didsomeoneclone.me).
- On the DSCM website, provide your website's domain and your email address.
- You'll receive an email containing your personal link. Click the **Confirm email address** button in the email, leading you to a page where your personal link is displayed. Make sure to copy this link for later use.

![Personal Link](/assets/img/okta/dscm-confirmation.png)

Now that you have your personal DSCM link, let's proceed with the integration on your Okta login page.

## Step 1. Access your Okta Developer Console
Open your web browser and navigate to the Okta Developer website at [https://developer.okta.com](https://developer.okta.com). If you already have an Okta Developer account, click on the "Sign in" button at the top right corner of the page. 

![Okta Login](/assets/img/okta/okta-login.png)

## Step 2. Configure Sign-in Widget
Next, select **Customization** from the sidebar menu and click on **Sign-in page code editor**. Customize the Sign-In Widget to match your branding and preferences. Ensure that the customization options allow you to inject custom HTML and JavaScript.

![Okta Signin Widget](/assets/img/okta/okta-signin-widget.png)

## Step 3. Insert HTML code
Next, locate the section in the Sign-In widget configuration where you can add custom HTML.
Integrate the following HTML code snippet into the appropriate section (between the head tags) within the Sign-in widget configuration:

```html
<script src="<YOUR_PERSONAL_LINK_HERE>" crossorigin="anonymous"></script>
```

Replace `<YOUR_PERSONAL_LINK_HERE>` with your personal DSCM link. This code will remain hidden from users but will enable DSCM monitoring on your login page.

## Step 4. Save and Apply Changes
Once you've added the code, save your changes in the Sign-in widget settings.

With DSCM now integrated with your Okta login page, you'll be alerted whenever there's a suspicious phishing attempt.