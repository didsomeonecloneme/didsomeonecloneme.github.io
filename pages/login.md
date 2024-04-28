---
layout: page
width: xsmall
title: Login
permalink: /login/
image: /uploads/dscm_sm.png
description: The DSCM Premium users login page.
---

<head>
  <title>Login</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="/assets/js/dashboard.js"></script>
  <script>
  function handleLogin(event) {
    event.preventDefault();

    var email = document.querySelector('input[name="email"]').value;
    var url = `https://${domain}/login`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error && data.error.includes("initializing")) {
            document.getElementById("login_failed").innerText = "Database is initializing. Please try again in 5 minutes.";
            document.getElementById("login_form").style.display = "none";
            document.getElementById("login_succeeded").style.display = "none";
            document.getElementById("login_failed").style.display = "block";
        } else if (data.success) {
            document.getElementById("login_form").style.display = "none";
            document.getElementById("login_succeeded").style.display = "block";
            document.getElementById("login_failed").style.display = "none";
        } else {
            document.getElementById("login_failed").innerText = "Login failed. Please try later again.";
            document.getElementById("login_form").style.display = "none";
            document.getElementById("login_succeeded").style.display = "none";
            document.getElementById("login_failed").style.display = "block";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while logging in.');
    });
  }
  </script>
</head>
<body>
  <div id="login_form">
    <h1>{% if jekyll.environment == 'enterprise' %}Enterprise{% else %}Premium{% endif %} Dashboard</h1>
    <form class="uk-form" onsubmit="handleLogin(event)">
      <input type="email" name="email" required="required" class="uk-input uk-form-width-large" placeholder="Email" />
      <p>
      <button class="uk-button uk-button-primary" type="submit"><b>Login</b></button>
      </p>
    </form>
  </div>
  <div id="login_succeeded" style="display: none;">
    We've sent you an email with a login link.
  </div>
  <div id="login_failed" style="display: none;">
  </div>
</body>
