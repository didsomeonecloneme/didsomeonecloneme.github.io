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
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <script
    src="https://res.cdn.office.net/teams-js/2.32.0/js/MicrosoftTeams.min.js"
    integrity="sha384-TOLACGjmwQohHyLubBrUeaUjuqYYAxJsVKufxV6VWXWEQepFpamUASNMMIhgJmoW"
    crossorigin="anonymous"
    ></script>
    <script src="/assets/js/dashboard.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        :root[data-theme="default"] {
            --themePrimaryForeground: #1a1a1a;
            --themeSecondaryForeground: #4a4a4a;
            --themeAccentColor: #05c896;
            --themeInfoBackground: #f0f6ff;
            --themeInfoBorder: #b3d7ff;
            --themeInfoIcon: #05c896;
            --themeLinkColor: #05c896;
            --themeIconBoxBorder: #05c896;
            --themeIconBoxShadow: rgba(0, 120, 212, 0.15);
        }

        :root[data-theme="dark"] {
            --themePrimaryForeground: #ffffff;
            --themeSecondaryForeground: #c8c8c8;
            --themeAccentColor: #05c896;
            --themeInfoBackground: #1f2941;
            --themeInfoBorder: #2b3a57;
            --themeInfoIcon: #05c896;
            --themeLinkColor: #05c896;
            --themeIconBoxBorder: #05c896;
            --themeIconBoxShadow: rgba(76, 194, 255, 0.15);
        }

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
            background-color: var(--themeInfoBackground);
            border: 1px solid var(--themeInfoBorder);
            border-radius: 8px;
            padding: 16px 20px;
            margin: 20px auto;
            position: relative;
            padding-left: 48px;
            max-width: 25%;
            width: fit-content;
            min-width: 300px; /* Ensures readability on smaller screens */
        }
        .subtitle::before {
            content: '\f05a';  /* Font Awesome info icon */
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            position: absolute;
            left: 20px;
            color: var(--themeInfoIcon);
        }
        .subtitle a {
            color: var(--themeLinkColor);
            text-decoration: none;
        }
        .subtitle a:hover {
            text-decoration: underline;
        }
        .icon-box {
            width: 160px;
            height: 160px;
            border: 3px solid var(--themeIconBoxBorder);
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
            border: 2px solid var(--themeIconBoxBorder);
            border-radius: 16px;
            opacity: 0.3;
            pointer-events: none;
        }
        .icon-box:hover::before {
            opacity: 0.5;
        }
        .icon-box:hover {
            transform: scale(1.02);
            box-shadow: 0 0 0 6px var(--themeIconBoxShadow);
        }
        .icon-box i {
            font-size: 64px;
            color: var(--themeAccentColor);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">Authenticity Seal</h1>
    </div>
    <div class="icon-box">
        <i class=""></i>
    </div>
    <p class="subtitle">If this symbol is visible on the Microsoft 365 login page, you can be confident you're on the official site. Unsure? Avoid entering any information and contact the helpdesk for assistance.</p>
    <script>
        async function fetchAndUpdateSymbol() {
            try {
                // Get URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');
                
                if (!token) {
                    console.error('No token provided');
                    return;
                }

                // Make API call
                const response = await fetch(`https://${domain}/seal_display`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                
                // Update the icon
                const iconElement = document.querySelector('.icon-box i');
                iconElement.className = data.symbol;
            } catch (error) {
                console.error('Error fetching symbol:', error);
            }
        }

        // Initialize Teams and then fetch symbol
        try {
            microsoftTeams.initialize();
            microsoftTeams.getContext((context) => {
                try {
                    if (context.theme) {
                        document.documentElement.setAttribute("data-theme", context.theme);
                    }
                } catch (error) {
                    console.error('Error setting initial theme:', error);
                    // Fallback to default theme
                    document.documentElement.setAttribute("data-theme", "default");
                }
            });

            microsoftTeams.registerOnThemeChangeHandler((theme) => {
                try {
                    document.documentElement.setAttribute("data-theme", theme);
                } catch (error) {
                    console.error('Error handling theme change:', error);
                    // Fallback to default theme
                    document.documentElement.setAttribute("data-theme", "default");
                }
            });
        } catch (error) {
            console.error('Error initializing Microsoft Teams:', error);
            // Fallback to default theme
            document.documentElement.setAttribute("data-theme", "default");
        }

        // Fetch symbol after Teams initialization
        fetchAndUpdateSymbol();
    </script>
</body>
</html>