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
    loadData();
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
            <th>Description</th>
            <th>Status</th>
            <th>Settings</th>
        </tr>
    </thead>
</table>

<div id="users">
  <table id="users_table" class="stripe" style="width:100%">
      <thead>
          <tr>
              <th>Username</th>
              <th>Remove</th>
          </tr>
      </thead>
  </table>
  <form id="addUser">
    <input class="uk-input uk-form-width-medium" type="text" id="userInput" placeholder="Enter email">
    <button class="uk-button uk-button-premium" type="submit">Add user</button>
  </form>
  <script>
    document.getElementById('addUser').addEventListener('submit', function(event) {
      event.preventDefault();

      const userInput = document.getElementById('userInput');
      const email = userInput.value;

      if (!validateEmail(email)) {
          alert('Please enter a valid email address.');
          return;
      }

      addUser(token);
    });
  </script>
</div>

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
        <p>
            <h3>Settings</h3>
        </p>
        <p>Configure your settings below.</p>
        <input class="uk-input uk-border-rounded" type="text" id="site" name="site" style="display: none;">
        <p>
            <b>Description</b>
            <input class="uk-input uk-border-rounded" type="text" id="description" name="description">
        </p>
        <p>
            <b>Webhook URL <span id="webhook_enabled"></span></b>
            <input class="uk-input uk-border-rounded" type="text" id="webhookURL" name="webhookURL">
        </p>
        <p>
            <b>Automated mitigations <span id="auto_mitigate_enabled"></span></b>
            <select id="mitigationDropdown" class="uk-select"></select>
        </p>
        <p>
            <b>Enable detection filtering <span id="filtering_enabled"></span></b>
            <br>
            <label for="filtered">
                <input type="checkbox" id="filtered" name="filtered"> Filtered
            </label>
        </p>
        <button class="uk-button uk-button-primary" onclick="storeSettingsForm(document.getElementById('site').value, document.getElementById('webhookURL').value, token, event, document.getElementById('mitigationDropdown').value, document.getElementById('description').value, document.getElementById('filtered').checked)">Save</button>
        <p id="messageLabel"></p>
    </form>
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
  function openModal(id, webhook, mitigations, mitigated, filtered, description) {
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

    var span = document.getElementById('filtering_enabled');
    var filtered_checkbox = document.getElementById("filtered");
    if ((filtered === "true") || (filtered === "")) {
        span.innerHTML = '<font color="green">[ENABLED]</font>';
        filtered_checkbox.checked = true;
    } else {
        span.innerHTML = '<font color="red">[DISABLED]</font>';
        filtered_checkbox.checked = false;
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
    document.getElementById('description').value = description;

    for (var i = 0; i < dropdown.options.length; i++) {
      if (dropdown.options[i].text === mitigated) {
        dropdown.selectedIndex = i;
        break;
      }
    }
}
</script>