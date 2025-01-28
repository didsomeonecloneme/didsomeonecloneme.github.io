---
layout: empty
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
    <link rel="stylesheet" href="/assets/css/all.min.css">
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            text-align: center;
            background-color: white;
            padding: 2em;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            background-color: #ffffff;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: #1a1a1a;
            margin: 0 0 24px 0;
            line-height: 1;
        }
        .subtitle {
            font-size: 18px;
            color: #4a4a4a;
            background-color: #f0f6ff;
            border: 1px solid #b3d7ff;
            border-radius: 8px;
            padding: 16px 20px;
            margin: 20px 0;
            position: relative;
            padding-left: 48px;
            max-width: none;
            width: auto;
            min-width: auto;
        }
        .subtitle::before {
            content: '\f05a';
            font-family: 'Font Awesome 6 Pro';
            font-weight: 900;
            position: absolute;
            left: 20px;
            color: #05c896;
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
            margin: 0 auto 24px auto;
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
            box-shadow: 0 0 0 6px rgba(0, 120, 212, 0.15);
        }
        .icon-box i {
            font-size: 64px;
            color: #05c896;
        }
        /* Add new loading spinner styles */
        .loading {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #05c896;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            display: none; /* Hidden by default */
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .date-subtitle {
            font-size: 16px;
            color: #666;
            margin: -16px 0 24px 0;
        }
        .help-link {
            display: block;
            color: #666666;
            text-decoration: none;
            font-size: 14px;
            margin-top: 16px;
        }
        .help-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <p class="title">Authenticity Seal</p>
        <p class="date-subtitle" id="current-date"></p>
        <div class="icon-box">
            <div class="loading"></div>
            <i class="" style="display: none;"></i>
        </div>
        <p class="subtitle">If the symbol is missing on the Microsoft 365 login page, the site is malicious. Do not enter any information and contact the helpdesk for assistance.</p>
        <p class="subtitle">This symbol changes every month.</p>
        <a href="/docs/enterprise_seal_authenticity/" class="help-link">More information</a>
    </div>
    <script>
        // Add date formatting function
        function formatDate(date) {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
            return `${months[date.getMonth()]} ${date.getFullYear()}`;
        }

        // Set current date
        document.getElementById('current-date').textContent = formatDate(new Date());

        async function fetchAndUpdateSymbol() {
            try {
                // Show loading spinner, hide icon
                const loadingElement = document.querySelector('.loading');
                const iconElement = document.querySelector('.icon-box i');
                loadingElement.style.display = 'block';
                iconElement.style.display = 'none';

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
                
                // Update the icon and hide loading spinner
                iconElement.className = data.symbol;
                loadingElement.style.display = 'none';
                iconElement.style.display = 'block';
            } catch (error) {
                console.error('Error fetching symbol:', error);
            }
        }

        // Fetch symbol after Teams initialization
        fetchAndUpdateSymbol();
    </script>
</body>
</html>