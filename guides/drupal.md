---
layout: page
width: xsmall
permalink: /drupal-installation
title: Drupal installation
image: /uploads/dscm_sm.png
metaDesc: Learn how to seamlessly integrate DSCM (Did someone clone me) into your Drupal website using a plugin, ensuring the security and authenticity of your site's content.
tags: 
  - Drupal
  - DSCM
---

# Drupal installation

In this guide, we will walk you through the process of installing DSCM via a Drupal Module to enhance the security of your Drupal website.

## Step 1: Install DSCM Module

Start by downloading the DSCM Module from the official Drupal Module repository. You can access this repository at <a href="https://www.drupal.org/project/dscm" target="_blank">https://www.drupal.org/project/dscm</a>.

![DSCM module page](/assets/img/drupal/dscm-page-drupal.jpg)

On the module's project page, scroll down to the "**Releases**" section. Here, click on the latest stable release.
This action will take you to a new page with more details. 

Scroll down to the "**Downloads**" section. You'll find a list of files associated with the module. Look for the file with a "**.tar.gz**" extension. Click on the"**tar.gz**" link to start the download process.

![Download module version](/assets/img/drupal/download-dscm.jpg)

## Step 2: Module Installation

Log in to your Drupal website's admin area, usually accessible at http://yourwebsite.com/admin.

![Admin Page Drupal](/assets/img/drupal/login-dscm.jpg)

Inside the Drupal administrator dashboard, navigate to the "**Extend**" menu.

![Extend Menu](/assets/img/drupal/dscm-extends.jpg)

Click on the "**Add new module**" button, usually located at the top of the page.

![Add a New Module](/assets/img/drupal/add-new-module.jpg)

Choose the option to upload the module and then select the DSCM module file that you downloaded in Step 1. Click the "**Continue**" button. Drupal will install the DSCM module for you.

![Instll DSCM Module](/assets/img/drupal/install-dscm-module.jpg)

## Step 3: Configure DSCM Settings
After successfully installing the DSCM plugin on your website, let's set it up to receive notifications when someone clones your site. Go to the official DSCM website at [https://didsomeoneclone.me](https://didsomeoneclone.me), input your Drupal website's domain and your email address, and then patiently wait for a few seconds.

You will receive an email containing your personal link. Click the “Confirm email address” button in the email. On the destination page, your personal link is displayed:

![Get Personal link](/assets/img/drupal/dscm-personal-link.jpg)

## Step 4: Configuring the Module's Settings
After copying your personal link, return to your Drupal admin area, go to the "**System**" section in the "**Configuration**" menu, and find the DSCM module (named "Did someone clone me") in the list of installed modules. 

![System section](/assets/img/drupal/system-section.jpg)

Access its settings, locate the section for adding and configuring links, paste the copied link from Step 3, and then save your settings. 

![Save Configuration](/assets/img/drupal/save-configuration.jpg)

This will embed the link into your content, ensuring the functionality of DSCM on your Drupal website.

Congratulations! You have successfully installed DSCM using a Drupal Module. Your website is now equipped to send you email notifications whenever someone clones your website, helping to maintain the security and integrity of your site's content





