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
  <!-- 1️⃣ Install Magic SDK -->
  <script src="https://auth.magic.link/sdk"></script>
  <script>
    /* 2️⃣ Initialize Magic Instance */
    let magic = new Magic("pk_live_3A7B3A29118F5872");

    /* 4️⃣ Implement Login Handler */
    const handleLogin = async (e) => {
      e.preventDefault();
      const email = new FormData(e.target).get("email");
      const redirectURI = `${window.location.origin}/dashboard`;
      if (email) {
        /* One-liner login 🤯 */
        await magic.auth.loginWithEmailOTP({ email, redirectURI });
        document.location = redirectURI;
      }
    };
  </script>
</head>
<body>
  <h1>Premium Dashboard</h1>
  <form class="uk-form" onsubmit="handleLogin(event)">
    <input type="email" name="email" required="required" class="uk-input uk-form-width-large" placeholder="Email" />
    <p>
    <button class="uk-button uk-button-primary" type="submit"><b>Login</b></button>
    </p>
  </form>
</body>
