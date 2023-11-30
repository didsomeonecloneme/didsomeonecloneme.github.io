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
<script src="https://auth.magic.link/pnp/callback" data-magic-publishable-api-key="pk_live_3A7B3A29118F5872"></script>
<script type="text/javascript" src="/assets/js/dashboard.js"></script>

<p>
<div id="dashboardButtons" hidden>
<button class="uk-button uk-button-primary" onclick="showDetectionsOverview()">
  Detections overview
</button>&nbsp;
<button class="uk-button uk-button-primary" onclick="showInstallationsOverview()">
  Installations overview
</button>
&nbsp;<button id="subscription_button" class="uk-button uk-button-primary" onclick="location.href='https://billing.stripe.com/p/login/3cs18a29O1kk7zq4gg'">
  Manage subscription
</button>&nbsp;
<button class="uk-button uk-button-danger">
  <a href="/contact" style="color: #fff; border-bottom:0px">Need help?</a>
</button>
</div>
</p>

<script>
  var u = "https://" + domain + "/dashboard";
  window.addEventListener('@magic/ready', (event) => {
    const { magic, idToken, userMetadata, oauth } = event.detail;

    $.ajax({
      url: u,
      dataType: 'json',
      beforeSend: function (request) { request.setRequestHeader("Authorization", "Bearer " + idToken); },
      success: function (data) {
        if (data.error && data.error === 'No Premium plan found.') {
          $('#loader').hide();
          $('#dashboardTitle').html("❌ Access denied. No Premium plan found. <a href='/?plan=premium'>Sign up here</a> to get Premium.");
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
                    return '';
                  }
                }
              },
              {
                data: 'Mitigate threat', render: function (data, type, row) {
                  return '<button class="uk-button uk-button-primary uk-button-small" onclick="mitigate(\'' + data + '\', \'' + idToken + '\', \'block_user_input\')">Mitigate</button>'
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
              }
            ]
          });

          $('#installations_table_wrapper').hide();
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
            </tr>
        </thead>
    </table>
</div>
