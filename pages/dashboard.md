---
layout: page
width: xmedium
title: Dashboard
permalink: /dashboard/
image: /uploads/dscm_sm.png
description: The DSCM Premium users dashboard.
---
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
<link rel="stylesheet" href="/assets/css/dashboard.css">
<script type="text/javascript" src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="/assets/js/dashboard.js"></script>

<p>
<div id="dashboardButtons" hidden>
<button class="uk-button uk-button-premium" onclick="showOrderOverview()">
  New order
</button>&nbsp;
<button class="uk-button uk-button-primary" onclick="showDetectionsOverview()">
  Detections overview
</button>&nbsp;
<button class="uk-button uk-button-primary" onclick="showInstallationsOverview()">
  Installations overview
</button>&nbsp;
<button class="uk-button uk-button-primary" onclick="showTools()">
  Tools
</button>&nbsp;
{% if jekyll.environment != 'enterprise' %}
<button id="subscription_button" class="uk-button uk-button-primary" onclick="location.href='https://billing.stripe.com/p/login/3cs18a29O1kk7zq4gg'">
  Manage subscription
</button>&nbsp;
{% endif %}
<button class="uk-button uk-button-danger">
  <a href="/contact" style="color: #fff; border-bottom:0px">Need help?</a>
</button>
</div>
</p>

<script>
  let token;
  var u = "https://" + domain + "/dashboard";
  window.addEventListener('load', (event) => {
    var urlParams = new URLSearchParams(window.location.search);
    var idToken = urlParams.get('token');
    token = idToken;

    $.ajax({
      url: u,
      dataType: 'json',
      beforeSend: function (request) { request.setRequestHeader("Authorization", idToken); },
      success: function (data) {
        if (data.error && data.error === 'No Premium plan found.') {
          $('#loader').hide();
          $('#dashboardTitle').html("❌ Access denied. No Premium plan found. <a href='/?plan=premium'>Sign up here</a> to get Premium.");
          $('#dashboardTitle').removeAttr('hidden');
        } else if (data.error) {
          $('#loader').hide();
          $('#dashboardTitle').html("❌ Error occured. Your token may be expired. Please try to login again.");
          $('#dashboardTitle').removeAttr('hidden');   
        } else {
          // Populate the history table
          $('#history_table').DataTable({
            data: data.data,
            order: [[0, 'desc']],
            columns: [
              { data: 'Date' },
              { data: 'Clone' },
              { data: 'Website' },
              { data: 'Statistics', render: function (data, type, row) { return data + ' views' } },
              {
                data: 'Automated analysis', render: function (data, type, row) {
                  if (data.startsWith('http')) {
                    return '<a href="' + data + '" style="border-bottom:0px;" target="_blank"><button class="uk-button uk-button-primary uk-button-small">Analysis</button></a>'
                  } else {
                    return 'N/A';
                  }
                }
              },
              {
                data: 'Mitigate threat', render: function (data, type, row) {
                  if (row.Website === 'microsoftonline.com') {
                    return '<button class="uk-button uk-button-primary uk-button-small" onclick="mitigate(\'' + data + '\', \'' + idToken + '\', \'' + row.Mitigations[0] + '\')">Warn users</button>';
                  } else {
                    return '<button class="uk-button uk-button-primary uk-button-small" onclick="mitigate(\'' + data + '\', \'' + idToken + '\', \'' + row.Mitigations[0] + '\')">Block input</button>';
                  }
                }
              },
              {
                data: 'Status', render: function (data, type, row) {
                  return data == "Offline" ? '<font color="red">' + data + '</font>' : '<font color="green">' + data + '</font>';
                }
              }
            ]
          });

          // Populate the installations table
          $('#installations_table').DataTable({
            data: data.installations,
            order: [[0, 'desc']],
            columns: [
              { data: 'Protected website' },
              { data: 'Personal link' },
              {
                data: 'Status', render: function (data, type, row) {
                  return data == "Online" ? '<font color="green">' + data + '</font>' : '<font color="red">' + data + '</font>';
                }
              },
              {
                data: 'Webhook', render: function (data, type, row) {
                  return '<a style="border-bottom: none;" onclick="openModal(\'' + row.ID + '\', \'' + data + '\', \'' + row.Mitigations + '\', \'' + row.AutomatedMitigation + '\')" uk-toggle><button class="uk-button uk-button-primary uk-button-small">Configure</button></a>';
                }
              }
            ]
          });

          $('#installations_table_wrapper').hide();
          $('#order').hide();
          $('#tools').hide();
          $('#table').removeAttr('hidden');
          $('#dashboardButtons').removeAttr('hidden');
          $('#dashboardTitle').removeAttr('hidden');
          $('#loader').hide();
          $("a[href*='/login']").attr("href", "/logout").text("Logout");
	        $('#subscription_button').attr('onclick', 'location.href=\'' + data.stripe_portal + '\'');
        }
      },
      error: function (error) {
        console.error(error);
      }
    });
  });
</script>

<div id="dashboardTitle" hidden>
<h2>My Dashboard</h2>
</div>
<div class="" style="height:150px;width:150px; margin:auto" id="loader">
<svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
    <path fill="#05c896" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
      <animateTransform 
         attributeName="transform" 
         attributeType="XML" 
         type="rotate"
         dur="0.7s" 
         from="0 50 50"
         to="360 50 50" 
         repeatCount="indefinite" />
  </path>
</svg>

</div>
<div id="table" hidden>
<table id="history_table" class="stripe" style="width:100%">
    <thead>
        <tr>
            <th>Last update</th>
            <th>Clone</th>
            <th>Cloned website</th>
            <th>Statistics</th>
            <th>Automated analysis</th>
            <th>Mitigate threat</th>
            <th>Status</th>
        </tr>
    </thead>
</table>

<table id="installations_table" class="stripe" style="width:100%">
    <thead>
        <tr>
            <th>Protected website</th>
            <th>Personal link</th>
            <th>Status</th>
            <th>Settings</th>
        </tr>
    </thead>
</table>

{% if jekyll.environment == 'enterprise' %}
<div id="order" style="width:100%">
  <p>Add a new link below:</p>
  <form id="addWebsiteForm">
    <input class="uk-input uk-form-width-medium" type="text" id="domainInput" placeholder="Enter domain">
    <button class="uk-button uk-button-premium" type="submit">Add website</button>
  </form>
  <script>
    document.getElementById('addWebsiteForm').addEventListener('submit', function(event) {
      event.preventDefault();
      addPlan(token);
    });
  </script>
</div>
{% else %}
<div id="order" style="width:100%">
  <p>Order a new Premium plan using the form below:</p>
  <form id="addWebsiteForm">
    <input class="uk-input uk-form-width-medium" type="text" id="domainInput" placeholder="Enter domain">
    <button class="uk-button uk-button-premium" type="submit">Add website</button>
  </form>
  <script>
    document.getElementById('addWebsiteForm').addEventListener('submit', function(event) {
      event.preventDefault();
      addPlan(token);
    });
  </script>
  <p>
    Total: <span id="total">€10 / month</span>
  </p>
  <p>
    <div id="submitButton"><a id="price_period" class="uk-button uk-button-success" style="font-size: 1.125rem; color: #ffffff; border-bottom: 0px" onclick="togglePeriod()">Pay Annually</a>
    </div>
  </p>
</div>
{% endif %}

<div id="tools" style="width:100%">
  <p>We offer tools to test our service:</p>
  <ul>
    <li><a href="https://microsoft.dscm.dev" target="_blank">Microsoft AITM Detection tester</a></li>
  </ul>
</div>
</div>

<!-- Settings Modal -->
<div id="myModal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <form id="settingsForm">
        <p><h3>Settings</h3>
        <p>Configure your settings below.</p>
        <b>Webhook URL <span id="webhook_enabled"></span></b>
        <input class="uk-input uk-border-rounded" type="text" id="site" name="site" style="display: none;">
        <input class="uk-input uk-border-rounded" type="text" id="webhookURL" name="webhookURL">
        <p>
        <b>Automated mitigations <span id="auto_mitigate_enabled"></span></b>
        <select id="mitigationDropdown" class="uk-select">
        </select>
        <br>
        <p>
        <button class="uk-button uk-button-primary" onclick="storeSettingsForm(document.getElementById('site').value, document.getElementById('webhookURL').value, token, event, document.getElementById('mitigationDropdown').value)">Save</button></p></p>
        <p id="messageLabel"></p>

<script>
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    //modal.style.display = "none";
    location.reload();
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      //modal.style.display = "none";
      location.reload();
    }
  }
</script>

<script>
  function openModal(id, webhook, mitigations, mitigated) {
    modal.style.display = "block";

    var span = document.getElementById('webhook_enabled');
    if (webhook) {
        span.innerHTML = '<font color="green">[ENABLED]</font>';
    } else {
        span.innerHTML = '<font color="red">[DISABLED]</font>';
    }

    var span = document.getElementById('auto_mitigate_enabled');
    if (mitigated) {
        span.innerHTML = '<font color="green">[ENABLED]</font>';
    } else {
        span.innerHTML = '<font color="red">[DISABLED]</font>';
    }

    var dropdown = document.getElementById('mitigationDropdown');
    // Add an empty option
    var emptyOption = document.createElement('option');
    emptyOption.text = '';
    emptyOption.value = '';
    dropdown.add(emptyOption);

    var option = document.createElement('option');
    option.text = mitigations;
    option.value = mitigations;
    dropdown.add(option);

    document.getElementById('site').value = id;
    document.getElementById('webhookURL').value = webhook;

    for (var i = 0; i < dropdown.options.length; i++) {
      if (dropdown.options[i].text === mitigated) {
        dropdown.selectedIndex = i;
        break;
      }
    }
}
</script>