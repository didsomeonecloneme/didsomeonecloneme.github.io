---
title: Adding Microsoft 365 Mitigations 
author: dscm
image: /uploads/dscm_sm.png
categories: [DSCM, Premium, Microsoft, Mitigations]
---

Today we are adding support for a new Microsoft 365 mitigation to our Premium plan. This mitigation allows you to not only detect a phishing attempt, but it also enables you to warn the users within your tenant whenever they visit a (AITM) phishing page. The warning states that the victim should not login with their credentials (password). This may prevent a successful phishing attack, protecting your organization.

## Video
What does the warning look like? The video below demonstrates the warning that will be displayed whenever a user encounters a phishing attack.

<div class="outer">
   <div class="video">
    <iframe src="https://youtube.com/embed/tc_pIrjx7o0" title="Microsoft 365 Mitigation" allowfullscreen></iframe>
    </div>
</div>

## Installation
To enable our Mitigation on your tenant:
- Sign up for a <a href="https://10.202.0.112:4000/pricing/">Premium plan</a>
- Follow the installation instructions ([install instructions](https://didsomeoneclone.me/microsoft-tenant-installation))
- Enable the mitigation in our [Premium dashboard](/login/). Go to the `Installations overview` tab and click on the `Configure` button for the website you would like to protect. Select the dropdown under the `Automated mitigations` setting and select `warn_user`

![Enable Mitigation](/assets/img/microsoft/enable_automated_mitigations.png)

Click the `Save` button. 

## Done

For all new phishing attempts, a warning will be displayed to the potential victim. Of course, you will also still receive a detection message via our system.

Happy preventing!

## Want to try our free plan first?
Would you like to try our detection solution for free first? Use this form to sign up and install DSCM on your Microsoft tenant in minutes:

<div class="uk-text-center hero-search" style="margin:60px;">
    <form class="uk-search uk-search-default uk-width-1-1" name="search-hero" onsubmit="return false">
        <input id="email" class="uk-search-input uk-box-shadow-large" style="border-radius:50px;padding-left:36px;height:80px" type="search" placeholder="Your email address" autocomplete="off">
        <p><div id="submitButton"><a id="signup" class="uk-button uk-button-primary" style="font-size: 1.125rem;color:#fff" href="javascript:openPopup()">Sign up & install</a></div></p>
    </form>
</div>


<script>
    document.addEventListener("keydown", function (event) { 
            if (event.keyCode == 13) { 
                openPopup();
            } 
        }); 

    function openPopup() {
        form = document.getElementById('email');
        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(form.value)) {
            form.setCustomValidity('Please enter a valid email (e.g. john.doe@example.com)');
            form.reportValidity();
            return;
        } else {
            form.setCustomValidity('');
        }

        var email = document.getElementById('email').value;
        var url = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize" +
                  "?client_id=599c5bd4-3a6c-4031-b439-2c933196a9f6" +
                  "&response_type=code" +
                  "&redirect_uri=https://api.didsomeoneclone.me/m365" +
                  "&response_mode=form_post" +
                  "&scope=OrganizationalBranding.ReadWrite.All%20User.Read" +
                  "&prompt=select_account" +
                  "&state=" + encodeURIComponent(email);

        // Open a new browser window
        var popupWindow = window.open(url, 'M365Popup', 'width=468, height=740, top=100, left=100');

        // Optionally, you can focus on the new window
        if (popupWindow) {
            popupWindow.focus();
        }
    }
</script>