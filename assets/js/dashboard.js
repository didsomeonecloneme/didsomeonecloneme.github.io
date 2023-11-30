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
