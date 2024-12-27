---
layout: login
title: Unknown Tenant
width: small
permalink: /unknown-tenant
---

<html>
<head>
    <title>Tenant not found</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/@microsoft/teams-js@2.5.1/dist/MicrosoftTeams.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@fluentui/react-northstar@0.69.0/dist/next-northstar.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fluentui/react-northstar@0.69.0/dist/next-northstar.min.css">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
        .container {
            text-align: center;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: var(--themePrimaryForeground);
        }
        .subtitle {
            font-size: 18px;
            color: var(--themeSecondaryForeground);
        }
        .subtitle a {
            color: #05c896;
            text-decoration: none;
        }
        .subtitle a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">Organization not found</h1>
        <p class="subtitle">To use this application, you need an active <a href="https://didsomeoneclone.me" target="_blank">didsomeoneclone.me</a> Enterprise subscription.</p>
    </div>
    <script>
        microsoftTeams.initialize();
        microsoftTeams.getContext((context) => {
            if (context.theme) {
                document.documentElement.setAttribute("data-theme", context.theme);
            }
        });
        microsoftTeams.registerOnThemeChangeHandler((theme) => {
            document.documentElement.setAttribute("data-theme", theme);
        });
    </script>
</body>
</html>