var domain;

if (window.location.hostname.includes('didsomeoneclone.me')) {
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
  });
  location.reload();
}

function showDetectionsOverview() {
  $('#history_table_wrapper').show();
  $('#installations_table_wrapper').hide();
}

function showInstallationsOverview() {
  $('#installations_table_wrapper').show();
  $('#history_table_wrapper').hide();
}

function storeWebhook(site, webhook, idToken, event) {
  event.preventDefault();
  if (webhook === "") {
    webhook = "undefined";
  }
  var u = "https://" + domain + "/dashboard?site=" + site + "&webhook=" + webhook;
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
  })
  .fail(function() {
    document.getElementById('messageLabel').innerHTML = 'Error occurred, try again later';
    document.getElementById('messageLabel').style.color = 'red';
  });
}