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

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function addAdminButton() {
  var urlParams = new URLSearchParams(window.location.search);
  $.ajax({
      url: "https://" + domain + '/dashboard?action=is_admin',
      type: 'GET',
      headers: {
          'Authorization': urlParams.get('token')
      },
      success: function(data) {
          if (data.success) {
              const dashboardButtons = document.getElementById('dashboardButtons');
              if (dashboardButtons) {
                  const button = document.createElement('button');
                  button.textContent = 'Users';
                  button.classList.add('uk-button', 'uk-button-primary');
                  button.addEventListener('click', showUserOverview);
                  dashboardButtons.appendChild(button);
              }
          }
      },
      error: function(error) {
          console.error('Error:', error);
      }
  });
}

function showUserOverview() {
  $('#history_table_wrapper').hide();
  $('#installations_table_wrapper').hide();
  $('#users').show();
  $('#order').hide();
  $('#tools').hide();

  var urlParams = new URLSearchParams(window.location.search);
  $.ajax({
    url: "https://" + domain + '/dashboard?action=get_users',
    type: 'GET',
    headers: {
        'Authorization': urlParams.get('token')
    },
    success: function(data) {
        const usersTable = $('#users_table').DataTable();
        usersTable.clear();

        for (const userId in data) {
            const userMail = data[userId].Mail;
            const deleteButton = `<button onclick="deleteUser('${userMail}')" class="uk-button uk-button-danger">Remove</button>`;
            usersTable.row.add([userMail, deleteButton]);
        }

        usersTable.draw();
    },
    error: function(error) {
        console.error('Error:', error);
    }
});
}

function addUser(idToken) {
  $('#users').hide();
  $('#loader').show();
  var username = document.getElementById('userInput').value;
  var url = u + '?action=add_user&username=' + encodeURIComponent(username);
  $.ajax({
      'url': url,
      'type': "GET",
      'dataSrc': 'data',
      'beforeSend': function (request) { request.setRequestHeader("Authorization", idToken); },
      'success': function () {
          showUserOverview();
          $('#loader').hide();
          $('#users').show();
        },
        'error': function (jqXHR, textStatus, errorThrown) {
          console.error('Error:', errorThrown);
        }
    });
}

function deleteUser(userMail) {
  var urlParams = new URLSearchParams(window.location.search);
  $.ajax({
      url: "https://" + domain + '/dashboard?action=delete_user&username=' + userMail,
      type: 'GET',
      headers: {
          'Authorization': urlParams.get('token')
      },
      success: function(data) {
          showUserOverview();
      },
      error: function(error) {
          console.error('Error:', error);
      }
  });
}

function loadData() {
  var urlParams = new URLSearchParams(window.location.search);
  var idToken = urlParams.get('token');
  token = idToken;

  $.ajax({
    url: u,
    dataType: 'json',
    beforeSend: function (request) { request.setRequestHeader("Authorization", idToken); },
    success: function (data) {
      if (data.error && data.error === 'No Premium plan found.' && data.enterprise === "false") {
        $('#loader').hide();
        $('#dashboardTitle').html("❌ Access denied. No Premium plan found. <a href='/?plan=premium'>Sign up here</a> to get Premium.");
        $('#dashboardTitle').removeAttr('hidden');
      } else if (data.error && data.error === 'No Premium plan found.' && data.enterprise === "true")  {
        $('#loader').hide();
        $('#dashboardTitle').html("❌ Access denied. No account found.");
        $('#dashboardTitle').removeAttr('hidden');
      } else if (data.error) {
        $('#loader').hide();
        $('#dashboardTitle').html("❌ Error occurred. Your token may be expired. Please try to login again.");
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
            { data: 'Description'},
            {
              data: 'Status', render: function (data, type, row) {
                return data == "Online" ? '<font color="green">' + data + '</font>' : '<font color="red">' + data + '</font>';
              }
            },
            {
              data: 'Webhook', render: function (data, type, row) {
                return '<a style="border-bottom: none;" onclick="openModal(\'' + row.ID + '\', \'' + data + '\', \'' + row.Mitigations + '\', \'' + row.AutomatedMitigation + '\', \'' + row.Filtered + '\', \'' + row.Description + '\')" uk-toggle><button class="uk-button uk-button-primary uk-button-small">Configure</button></a>';
              }
            }
          ]
        });

        $('#users_table').DataTable();
        $('#users').hide();
        $('#installations_table_wrapper').hide();
        $('#history_table_wrapper').hide();
        $('#tools').hide();
        $('#table').removeAttr('hidden');
        $('#dashboardButtons').removeAttr('hidden');
        $('#dashboardTitle').removeAttr('hidden');
        $('#loader').hide();
        $("a[href*='/login']").attr("href", "/logout").text("Logout");
        $('#subscription_button').attr('onclick', 'location.href=\'' + data.stripe_portal + '\'');
        addAdminButton();
      }
    },
    error: function (error) {
      console.error(error);
    }
  });
}

function mitigate(threat, idToken, type) {
  var u = "https://" + domain + "/dashboard?mitigate=" + threat + "&type=" + type;
  $.ajax({
    'url': u,
    'type': "GET",
    'dataSrc': 'data',
    'beforeSend': function (request) { request.setRequestHeader("Authorization", idToken); }
  }).done(function() {
    location.reload();
  });
}

function showDetectionsOverview() {
  $('#history_table_wrapper').show();
  $('#installations_table_wrapper').hide();
  $('#users').hide();
  $('#order').hide();
  $('#tools').hide();
}

function showInstallationsOverview() {
  $('#installations_table_wrapper').show();
  $('#history_table_wrapper').hide();
  $('#users').hide();
  $('#order').hide();
  $('#tools').hide();
}

function showOrderOverview() {
  $('#order').show();
  $('#installations_table_wrapper').hide();
  $('#history_table_wrapper').hide();
  $('#users').hide();
  $('#tools').hide();
}

function showTools() {
  $('#tools').show();
  $('#order').hide();
  $('#installations_table_wrapper').hide();
  $('#history_table_wrapper').hide();
  $('#users').hide();
}

function storeSettingsForm(site, webhook, idToken, event, mitigate, description, filtered) {
  event.preventDefault();
  if (webhook === "") {
    webhook = "undefined";
  }

  if (mitigate === "") {
    mitigate = "undefined";
  }

  if (description === "") {
    mitigate = "undefined";
  }

  var u = "https://" + domain + "/dashboard?site=" + site + "&webhook=" + encodeURIComponent(webhook) + "&mitigate=" + mitigate + "&description=" + encodeURIComponent(description) + "&filtered=" + filtered;
  $.ajax({
    'url': u,
    'type': "GET",
    'dataSrc': 'data',
    'beforeSend': function (request) { request.setRequestHeader("Authorization", idToken); }
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
    if (!filtered) {
      var span = document.getElementById('filtering_enabled');
      span.innerHTML = '<font color="red">[DISABLED]</font>';
    } else {
      var span = document.getElementById('filtering_enabled');
      span.innerHTML = '<font color="green">[ENABLED]</font>';
    }
  })
  .fail(function() {
    document.getElementById('messageLabel').innerHTML = 'Error occurred, try again later';
    document.getElementById('messageLabel').style.color = 'red';
  });
}

function addPlan(idToken) {
  $('#order').hide();
  $('#loader').show();
  var domain = document.getElementById('domainInput').value;
  var url = u + '?action=new_plan&domain=' + encodeURIComponent(domain) + '&period=' + encodeURIComponent(period);
  $.ajax({
      'url': url,
      'type': "GET",
      'dataSrc': 'data',
      'beforeSend': function (request) { request.setRequestHeader("Authorization", idToken); },
      'success': function (data) {
        if (data.payment_link) {
          // Get the payment_link from the data
          var payment_link = data.payment_link;
          // Redirect the user to the payment_link
          window.location.href = payment_link;
        } else if (data.link) {
          var originalState = document.getElementById('order').innerHTML;
          var textNode1 = document.createTextNode("Link successfully added to your profile.");
          var link = document.createTextNode(data.link);
          var domainText = document.createTextNode(domain);
          var orderDiv = document.getElementById('order');
          orderDiv.innerHTML = '';
          orderDiv.appendChild(textNode1);
          var newElement = document.createElement('div');
          newElement.innerHTML = "<br><b>Personal link </b>";
          orderDiv.appendChild(newElement);
          orderDiv.appendChild(link);
          var newElement = document.createElement('div');
          newElement.innerHTML = "<br><b>Protected website </b>";
          orderDiv.appendChild(newElement);
          orderDiv.appendChild(domainText);
          $('#dashboardButtons').hide();

          var goBackButton = document.createElement('button');
          goBackButton.textContent = 'Go Back';
          goBackButton.classList.add('uk-button');
          goBackButton.classList.add('uk-button-premium');
          goBackButton.addEventListener('click', function() {
            window.location.reload();
          });
          var newElement = document.createElement('div');
          newElement.innerHTML = "<br>";
          orderDiv.appendChild(newElement);
          orderDiv.appendChild(goBackButton);
          }
          $('#loader').hide();
          $('#order').show();
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