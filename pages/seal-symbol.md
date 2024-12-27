---
layout: login
title: Seal Symbol
width: small
permalink: /seal-symbol
---

<html>
<head>
    <title>Authenticity Seal</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/@microsoft/teams-js@2.5.1/dist/MicrosoftTeams.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@fluentui/react-northstar@0.69.0/dist/next-northstar.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fluentui/react-northstar@0.69.0/dist/next-northstar.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
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
        .icon-box {
            width: 160px;
            height: 160px;
            border: 3px solid #05c896;
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 24px;
            position: relative;
            transition: all 0.3s ease;
        }
        .icon-box::before {
            content: '';
            position: absolute;
            top: -8px;
            left: -8px;
            right: -8px;
            bottom: -8px;
            border: 2px solid #05c896;
            border-radius: 16px;
            opacity: 0.3;
            pointer-events: none;
        }
        .icon-box:hover::before {
            opacity: 0.5;
        }
        .icon-box:hover {
            transform: scale(1.02);
            box-shadow: 0 0 0 6px rgba(var(--themePrimaryForeground), 0.15);
        }
        .icon-box i {
            font-size: 64px;
            color: #05c896;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">Authenticity Seal</h1>
    </div>
    <div class="icon-box">
        <i class="fas fa-exclamation-triangle"></i>
    </div>
    <p class="subtitle">Use the seal above to verify your Microsoft 365 login page.</p>
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