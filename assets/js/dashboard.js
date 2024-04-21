var domain;
var period = "monthly";

const hostnamePattern = /^dscm-management-(.{6})\.azurewebsites\.net$/;
const match = window.location.hostname.match(hostnamePattern);

if (match) {
  domain = `dscm-api-${match[1]}.azurewebsites.net`;
} else if (window.location.hostname === 'didsomeoneclone.me') {
  domain = "api.didsomeoneclone.me";
} else {
  domain = "api-test.didsomeoneclone.me";
}

function mitigate(threat, idToken, type) {
  var u = "https://" + domain + "/dashboard?mitigate=" + threat + "&type=" + type;
  $.ajax({
    'url': u,
    'type': "GET",
    'dataSrc': 'data',
    'beforeSend': function (request) { request.setRequestHeader("Authorization", "Bearer " + idToken); }
  }).done(function() {
    location.reload();
  });
}

function showDetectionsOverview() {
  $('#history_table_wrapper').show();
  $('#installations_table_wrapper').hide();
  $('#order').hide();
  $('#tools').hide();
}

function showInstallationsOverview() {
  $('#installations_table_wrapper').show();
  $('#history_table_wrapper').hide();
  $('#order').hide();
  $('#tools').hide();
}

function showOrderOverview() {
  $('#order').show();
  $('#installations_table_wrapper').hide();
  $('#history_table_wrapper').hide();
  $('#tools').hide();
}

function showTools() {
  $('#tools').show();
  $('#order').hide();
  $('#installations_table_wrapper').hide();
  $('#history_table_wrapper').hide();
}

function storeSettingsForm(site, webhook, idToken, event, mitigate) {
  event.preventDefault();
  if (webhook === "") {
    webhook = "undefined";
  }

  if (mitigate === "") {
    mitigate = "undefined";
  }

  var u = "https://" + domain + "/dashboard?site=" + site + "&webhook=" + encodeURIComponent(webhook) + "&mitigate=" + mitigate;
  $.ajax({
    'url': u,
    'type': "GET",
    'dataSrc': 'data',
    'beforeSend': function (request) { request.setRequestHeader("Authorization", "Bearer " + idToken); }
  }).done(function() {
    document.getElementById('messageLabel').innerHTML = 'Settings saved successfully';
    document.getElementById('messageLabel').style.color = 'green';

    if (webhook === "undefined") {
      var span = document.getElementById('webhook_enabled');
      span.innerHTML = '<font color="red">[DISABLED]</font>';
    } else {
      var span = document.getElementById('webhook_enabled');
      span.innerHTML = '<font color="green">[ENABLED]</font>';
    }
    if (mitigate === "undefined") {
      var span = document.getElementById('auto_mitigate_enabled');
      span.innerHTML = '<font color="red">[DISABLED]</font>';
    } else {
      var span = document.getElementById('auto_mitigate_enabled');
      span.innerHTML = '<font color="green">[ENABLED]</font>';
    }
  })
  .fail(function() {
    document.getElementById('messageLabel').innerHTML = 'Error occurred, try again later';
    document.getElementById('messageLabel').style.color = 'red';
  });
}

function addPlan(idToken) {
  var domain = document.getElementById('domainInput').value;
  var url = u + '?action=new_plan&domain=' + encodeURIComponent(domain) + '&period=' + encodeURIComponent(period);
  $.ajax({
      'url': url,
      'type': "GET",
      'dataSrc': 'data',
      'beforeSend': function (request) { request.setRequestHeader("Authorization", "Bearer " + idToken); },
      'success': function (data) {
        // Get the payment_link from the data
        var payment_link = data.payment_link;
        // Redirect the user to the payment_link
        window.location.href = payment_link;
        },
        'error': function (jqXHR, textStatus, errorThrown) {
          console.error('Error:', errorThrown);
        }
    });
}

function togglePeriod() {
  // Get the 'a' element with id 'price_period'
  const pricePeriodLink = document.getElementById('price_period');
  // Get the 'span' element with id 'total'
  const totalSpan = document.getElementById('total');

  // If the current value is 'monthly', change it to 'yearly'
  if (period === 'monthly') {
    period = 'yearly';
    // Change the text content of the 'price_period' link
    if (pricePeriodLink) {
      pricePeriodLink.textContent = "Pay Monthly";
    }
    // Change the text content of the 'total' span
    if (totalSpan) {
      totalSpan.textContent = "€120 / year";
    }
  }
  // If the current value is 'yearly', change it to 'monthly'
  else if (period === 'yearly') {
    period = 'monthly';
    // Change the text content of the 'price_period' link
    if (pricePeriodLink) {
      pricePeriodLink.textContent = "Pay Annually";
    }
    // Change the text content of the 'total' span
    if (totalSpan) {
      totalSpan.textContent = "€10 / month";
    }
  }

  console.log(period);
}