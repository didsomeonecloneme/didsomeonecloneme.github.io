---
layout: page
width: small
permalink: /microsoft-tenant-installation-ads
title: Microsoft 365 Tenant installation
metaDesc: Learn how to seamlessly integrate DSCM (Did someone clone me) into your Microsoft 365 tenant, ensuring the security and authenticity of your site's content.
tags: 
  - Microsoft
  - Portal
  - DSCM
---

<p class="hero-image uk-text-center"><img src="/uploads/dscm.png" alt="Did someone clone me"></p>

<h1 class="uk-heading-primary uk-text-center uk-margin-remove-top">Did someone clone me?</h1>
<p class="uk-text-lead uk-text-center">Sign up below to detect (AiTM) phishing attacks on your Microsoft 365 tenant</p>
<div class="uk-text-center hero-search" style="margin:60px;">
<form class="uk-search uk-search-default uk-width-1-1" name="search-hero" onsubmit="return false">
      <input id="email" class="uk-search-input uk-box-shadow-large" style="border-radius:50px;padding-left:36px;height:80px" type="search" placeholder="Your email address" autocomplete="off">
      <p><div id="submitButton"><a id="signup" class="uk-button uk-button-primary" style="font-size: 1.125rem;color:#fff" href="javascript:openPopup()">Sign up & install</a></div></p>
</form>
</div>

### What is this?
DSCM is a free to use service that allows you to get notified whenever a (AITM)-phishing attack is performed against your Microsoft 365 tenant. A detection indicates that one of the users within your tenant attempted to login into the phishing website. This may indicate that access was obtained to the victims account, even bypassing advanced protections such as Multi-Factor Authentication (MFA). After a detection, you can take appropriate actions to protect your organization and employees. For example resetting passwords, revoking user sessions and performing investigation. 

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

### How does it work?
To detect phishing attacks on your Microsoft tenant, we are using the ability to add external CSS to your Microsoft login page. This allows us to add a reference to a (invisible) remote image hosted by DSCM. After adding the CSS, DSCM analyses every incoming request to validate whether it is originated from a malicious phishing website. If a malicious website is detected, we will notify you via emails. To provide easy installation, we've developed a fully automated installer. The following videos demonstrates our easy installer:
<div class="outer">
   <div class="video">
  <iframe src="https://www.youtube.com/embed/fKrkSkJfOAY" title="Microsoft 365 installer" allowfullscreen></iframe>
    </div>
</div>
### More details
Do you prefer installing DSCM manually within your tenant? Then check out our <a href="/microsoft-tenant-installation">manual install instructions</a>. Are you looking for more technical details? Check <a href="https://zolder.io/using-honeytokens-to-detect-aitm-phishing-attacks-on-your-microsoft-365-tenant/" target="_blank">this</a> write-up.
