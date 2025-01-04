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

  return new Promise((resolve, reject) => {
    $.ajax({
      url: u,
      dataType: 'json',
      beforeSend: function (request) { request.setRequestHeader("Authorization", idToken); },
      success: function (data) {
        if (data.error && data.error === 'No Premium plan found.' && data.enterprise === "false") {
          $('#loader').hide();
          $('#dashboardTitle').html("❌ Access denied. No Premium plan found. <a href='/?plan=premium'>Sign up here</a> to get Premium.");
          $('#dashboardTitle').removeAttr('hidden');
          resolve(data);
        } else if (data.error && data.error === 'No Premium plan found.' && data.enterprise === "true")  {
          $('#loader').hide();
          $('#dashboardTitle').html("❌ Access denied. No account found.");
          $('#dashboardTitle').removeAttr('hidden');
          resolve(data);
        } else if (data.error) {
          $('#loader').hide();
          $('#dashboardTitle').html("❌ Error occurred. Your token may be expired. Please try to login again.");
          $('#dashboardTitle').removeAttr('hidden');   
          resolve(data);
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
                data: 'm365_logmon_enabled',
                render: function (data, type, row) {
                  if (row.m365_logmon_auth === "") {
                    return 'N/A';
                  }
                  return data ? '<font color="green">Enabled</font>' : '<font color="red">Disabled</font>';
                }
              },
              {
                data: 'Webhook',
                render: function(data, type, row) {
                  const modalParams = {
                    id: row.ID,
                    webhook: data,
                    mitigations: row.Mitigations,
                    automatedMitigation: row.AutomatedMitigation,
                    filtered: row.Filtered,
                    description: row.Description,
                    m365LogmonEnabled: row.m365_logmon_enabled,
                    m365LogmonAuth: row.m365_logmon_auth,
                    sealEnabled: row.seal_enabled,
                    sealAvailable: row.seal_available,
                    sealTenantId: row.seal_tenant_id,
                    sealCollection: row.seal_collection
                  };

                  return `
                    <a style="border-bottom: none;" 
                       onclick="openModal(
                         '${modalParams.id}',
                         '${modalParams.webhook}',
                         '${modalParams.mitigations}',
                         '${modalParams.automatedMitigation}',
                         '${modalParams.filtered}',
                         '${modalParams.description}',
                         '${modalParams.m365LogmonEnabled}',
                         '${modalParams.m365LogmonAuth}',
                         '${modalParams.sealEnabled}',
                         '${modalParams.sealAvailable}',
                         '${modalParams.sealTenantId}',
                         '${modalParams.sealCollection}'
                       )" 
                       uk-toggle>
                      <button class="uk-button uk-button-primary uk-button-small">Configure</button>
                    </a>
                  `;
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
          resolve(data);
        }
      },
      error: function (error) {
        console.error(error);
        reject(error);
      }
    });
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

function storeSettingsForm(site, webhook, idToken, event, mitigate, description, filtered, sealSymbols, sealTenantId) {
  event.preventDefault();

  if (webhook === "") {
    webhook = "undefined";
  }

  if (mitigate === "") {
    mitigate = "undefined";
  }

  if (description === "") {
    description = "undefined";
  }

  if (sealSymbols === "") {
    sealSymbols = "undefined";
  }

  if (sealTenantId === "") {
    sealTenantId = "undefined";
  }

  const queryParams = new URLSearchParams({
    site: site,
    webhook: encodeURIComponent(webhook),
    mitigate: mitigate,
    description: encodeURIComponent(description),
    filtered: filtered,
    sealSymbols: sealSymbols,
    sealTenantId: sealTenantId
  });
  
  const u = `https://${domain}/dashboard?${queryParams.toString()}`;
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
    if (sealSymbols === "undefined" || sealTenantId === "undefined") {
      var span = document.getElementById('seal_enabled');
      span.innerHTML = '<font color="red">[DISABLED]</font>';
    } else {
      var span = document.getElementById('seal_enabled');
      span.innerHTML = '<font color="green">[ENABLED]</font>';
    }
  })
  .fail(function(jqXHR) {
    let errorMessage = 'Error occurred: ';
    if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
      errorMessage += jqXHR.responseJSON.error;
    } else {
      errorMessage += 'try again later';
    }
    document.getElementById('messageLabel').innerHTML = errorMessage;
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

// FontAwesome icon picker functionality
document.addEventListener('DOMContentLoaded', function() {
    const iconPicker = document.getElementById('GetIconPicker');
    const iconPickerModal = document.getElementById('iconPickerModal');
    const closeIconPicker = document.querySelector('.close-picker');
    const iconContainer = document.getElementById('iconContainer');
    const iconInput = document.getElementById('IconInput');
    const iconPreview = document.getElementById('IconPreview');
    const iconSearch = document.getElementById('iconSearch');

    // Sample FontAwesome icons - you can expand this list
    const icons = [
        'fas fa-ad', 
        'fas fa-address-book', 
        'fas fa-address-card', 
        'fas fa-adjust', 
        'fas fa-air-freshener', 
        'fas fa-align-center', 
        'fas fa-align-justify', 
        'fas fa-align-left', 
        'fas fa-align-right', 
        'fas fa-allergies', 
        'fas fa-ambulance', 
        'fas fa-american-sign-language-interpreting', 
        'fas fa-anchor', 
        'fas fa-angle-double-down', 
        'fas fa-angle-double-left', 
        'fas fa-angle-double-right', 
        'fas fa-angle-double-up', 
        'fas fa-angle-down', 
        'fas fa-angle-left', 
        'fas fa-angle-right', 
        'fas fa-angle-up', 
        'fas fa-angry', 
        'fas fa-ankh', 
        'fas fa-apple-alt', 
        'fas fa-archive', 
        'fas fa-archway', 
        'fas fa-arrow-alt-circle-down', 
        'fas fa-arrow-alt-circle-left', 
        'fas fa-arrow-alt-circle-right', 
        'fas fa-arrow-alt-circle-up', 
        'fas fa-arrow-circle-down', 
        'fas fa-arrow-circle-left', 
        'fas fa-arrow-circle-right', 
        'fas fa-arrow-circle-up', 
        'fas fa-arrow-down', 
        'fas fa-arrow-left', 
        'fas fa-arrow-right', 
        'fas fa-arrow-up', 
        'fas fa-arrows-alt-h', 
        'fas fa-arrows-alt-v', 
        'fas fa-arrows-alt', 
        'fas fa-assistive-listening-systems', 
        'fas fa-asterisk', 
        'fas fa-at', 
        'fas fa-atlas', 
        'fas fa-atom', 
        'fas fa-audio-description', 
        'fas fa-award', 
        'fas fa-baby-carriage', 
        'fas fa-baby', 
        'fas fa-backspace', 
        'fas fa-backward', 
        'fas fa-bacon', 
        'fas fa-bacteria', 
        'fas fa-bacterium', 
        'fas fa-bahai', 
        'fas fa-balance-scale-left', 
        'fas fa-balance-scale-right', 
        'fas fa-balance-scale', 
        'fas fa-ban', 
        'fas fa-band-aid', 
        'fas fa-barcode', 
        'fas fa-bars', 
        'fas fa-baseball-ball', 
        'fas fa-basketball-ball', 
        'fas fa-bath', 
        'fas fa-battery-empty', 
        'fas fa-battery-full', 
        'fas fa-battery-half', 
        'fas fa-battery-quarter', 
        'fas fa-battery-three-quarters', 
        'fas fa-bed', 
        'fas fa-beer', 
        'fas fa-bell-slash', 
        'fas fa-bell', 
        'fas fa-bezier-curve', 
        'fas fa-bible', 
        'fas fa-bicycle', 
        'fas fa-biking', 
        'fas fa-binoculars', 
        'fas fa-biohazard', 
        'fas fa-birthday-cake', 
        'fas fa-blender-phone', 
        'fas fa-blender', 
        'fas fa-blind', 
        'fas fa-blog', 
        'fas fa-bold', 
        'fas fa-bolt', 
        'fas fa-bomb', 
        'fas fa-bone', 
        'fas fa-bong', 
        'fas fa-book-dead', 
        'fas fa-book-medical', 
        'fas fa-book-open', 
        'fas fa-book-reader', 
        'fas fa-book', 
        'fas fa-bookmark', 
        'fas fa-border-all', 
        'fas fa-border-none', 
        'fas fa-border-style', 
        'fas fa-bowling-ball', 
        'fas fa-box-open', 
        'fas fa-box-tissue', 
        'fas fa-box', 
        'fas fa-boxes', 
        'fas fa-braille', 
        'fas fa-brain', 
        'fas fa-bread-slice', 
        'fas fa-briefcase-medical', 
        'fas fa-briefcase', 
        'fas fa-broadcast-tower', 
        'fas fa-broom', 
        'fas fa-brush', 
        'fas fa-bug', 
        'fas fa-building', 
        'fas fa-bullhorn', 
        'fas fa-bullseye', 
        'fas fa-burn', 
        'fas fa-bus-alt', 
        'fas fa-bus', 
        'fas fa-business-time', 
        'fas fa-calculator', 
        'fas fa-calendar-alt', 
        'fas fa-calendar-check', 
        'fas fa-calendar-day', 
        'fas fa-calendar-minus', 
        'fas fa-calendar-plus', 
        'fas fa-calendar-times', 
        'fas fa-calendar-week', 
        'fas fa-calendar', 
        'fas fa-camera-retro', 
        'fas fa-camera', 
        'fas fa-campground', 
        'fas fa-candy-cane', 
        'fas fa-cannabis', 
        'fas fa-capsules', 
        'fas fa-car-alt', 
        'fas fa-car-battery', 
        'fas fa-car-crash', 
        'fas fa-car-side', 
        'fas fa-car', 
        'fas fa-caravan', 
        'fas fa-caret-down', 
        'fas fa-caret-left', 
        'fas fa-caret-right', 
        'fas fa-caret-square-down', 
        'fas fa-caret-square-left', 
        'fas fa-caret-square-right', 
        'fas fa-caret-square-up', 
        'fas fa-caret-up', 
        'fas fa-carrot', 
        'fas fa-cart-arrow-down', 
        'fas fa-cart-plus', 
        'fas fa-cash-register', 
        'fas fa-cat', 
        'fas fa-certificate', 
        'fas fa-chair', 
        'fas fa-chalkboard-teacher', 
        'fas fa-chalkboard', 
        'fas fa-charging-station', 
        'fas fa-chart-area', 
        'fas fa-chart-bar', 
        'fas fa-chart-line', 
        'fas fa-chart-pie', 
        'fas fa-check-circle', 
        'fas fa-check-double', 
        'fas fa-check-square', 
        'fas fa-check', 
        'fas fa-cheese', 
        'fas fa-chess-bishop', 
        'fas fa-chess-board', 
        'fas fa-chess-king', 
        'fas fa-chess-knight', 
        'fas fa-chess-pawn', 
        'fas fa-chess-queen', 
        'fas fa-chess-rook', 
        'fas fa-chess', 
        'fas fa-chevron-circle-down', 
        'fas fa-chevron-circle-left', 
        'fas fa-chevron-circle-right', 
        'fas fa-chevron-circle-up', 
        'fas fa-chevron-down', 
        'fas fa-chevron-left', 
        'fas fa-chevron-right', 
        'fas fa-chevron-up', 
        'fas fa-child', 
        'fas fa-church', 
        'fas fa-circle-notch', 
        'fas fa-circle', 
        'fas fa-city', 
        'fas fa-clinic-medical', 
        'fas fa-clipboard-check', 
        'fas fa-clipboard-list', 
        'fas fa-clipboard', 
        'fas fa-clock', 
        'fas fa-clone', 
        'fas fa-closed-captioning', 
        'fas fa-cloud-download-alt', 
        'fas fa-cloud-meatball', 
        'fas fa-cloud-moon-rain', 
        'fas fa-cloud-moon', 
        'fas fa-cloud-rain', 
        'fas fa-cloud-showers-heavy', 
        'fas fa-cloud-sun-rain', 
        'fas fa-cloud-sun', 
        'fas fa-cloud-upload-alt', 
        'fas fa-cloud', 
        'fas fa-cocktail', 
        'fas fa-code-branch', 
        'fas fa-code', 
        'fas fa-coffee', 
        'fas fa-cog', 
        'fas fa-cogs', 
        'fas fa-coins', 
        'fas fa-columns', 
        'fas fa-comment-alt', 
        'fas fa-comment-dollar', 
        'fas fa-comment-dots', 
        'fas fa-comment-medical', 
        'fas fa-comment-slash', 
        'fas fa-comment', 
        'fas fa-comments-dollar', 
        'fas fa-comments', 
        'fas fa-compact-disc', 
        'fas fa-compass', 
        'fas fa-compress-alt', 
        'fas fa-compress-arrows-alt', 
        'fas fa-compress', 
        'fas fa-concierge-bell', 
        'fas fa-cookie-bite', 
        'fas fa-cookie', 
        'fas fa-copy', 
        'fas fa-copyright', 
        'fas fa-couch', 
        'fas fa-credit-card', 
        'fas fa-crop-alt', 
        'fas fa-crop', 
        'fas fa-cross', 
        'fas fa-crosshairs', 
        'fas fa-crow', 
        'fas fa-crown', 
        'fas fa-crutch', 
        'fas fa-cube', 
        'fas fa-cubes', 
        'fas fa-cut', 
        'fas fa-database', 
        'fas fa-deaf', 
        'fas fa-democrat', 
        'fas fa-desktop', 
        'fas fa-dharmachakra', 
        'fas fa-diagnoses', 
        'fas fa-dice-d20', 
        'fas fa-dice-d6', 
        'fas fa-dice-five', 
        'fas fa-dice-four', 
        'fas fa-dice-one', 
        'fas fa-dice-six', 
        'fas fa-dice-three', 
        'fas fa-dice-two', 
        'fas fa-dice', 
        'fas fa-digital-tachograph', 
        'fas fa-directions', 
        'fas fa-disease', 
        'fas fa-divide', 
        'fas fa-dizzy', 
        'fas fa-dna', 
        'fas fa-dog', 
        'fas fa-dollar-sign', 
        'fas fa-dolly-flatbed', 
        'fas fa-dolly', 
        'fas fa-donate', 
        'fas fa-door-closed', 
        'fas fa-door-open', 
        'fas fa-dot-circle', 
        'fas fa-dove', 
        'fas fa-download', 
        'fas fa-drafting-compass', 
        'fas fa-dragon', 
        'fas fa-draw-polygon', 
        'fas fa-drum-steelpan', 
        'fas fa-drum', 
        'fas fa-drumstick-bite', 
        'fas fa-dumbbell', 
        'fas fa-dumpster-fire', 
        'fas fa-dumpster', 
        'fas fa-dungeon', 
        'fas fa-edit', 
        'fas fa-egg', 
        'fas fa-eject', 
        'fas fa-ellipsis-h', 
        'fas fa-ellipsis-v', 
        'fas fa-envelope-open-text', 
        'fas fa-envelope-open', 
        'fas fa-envelope-square', 
        'fas fa-envelope', 
        'fas fa-equals', 
        'fas fa-eraser', 
        'fas fa-ethernet', 
        'fas fa-euro-sign', 
        'fas fa-exchange-alt', 
        'fas fa-exclamation-circle', 
        'fas fa-exclamation-triangle', 
        'fas fa-exclamation', 
        'fas fa-expand-alt', 
        'fas fa-expand-arrows-alt', 
        'fas fa-expand', 
        'fas fa-external-link-alt', 
        'fas fa-external-link-square-alt', 
        'fas fa-eye-dropper', 
        'fas fa-eye-slash', 
        'fas fa-eye', 
        'fas fa-fan', 
        'fas fa-fast-backward', 
        'fas fa-fast-forward', 
        'fas fa-faucet', 
        'fas fa-fax', 
        'fas fa-feather-alt', 
        'fas fa-feather', 
        'fas fa-female', 
        'fas fa-fighter-jet', 
        'fas fa-file-alt', 
        'fas fa-file-archive', 
        'fas fa-file-audio', 
        'fas fa-file-code', 
        'fas fa-file-contract', 
        'fas fa-file-csv', 
        'fas fa-file-download', 
        'fas fa-file-excel', 
        'fas fa-file-export', 
        'fas fa-file-image', 
        'fas fa-file-import', 
        'fas fa-file-invoice-dollar', 
        'fas fa-file-invoice', 
        'fas fa-file-medical-alt', 
        'fas fa-file-medical', 
        'fas fa-file-pdf', 
        'fas fa-file-powerpoint', 
        'fas fa-file-prescription', 
        'fas fa-file-signature', 
        'fas fa-file-upload', 
        'fas fa-file-video', 
        'fas fa-file-word', 
        'fas fa-file', 
        'fas fa-fill-drip', 
        'fas fa-fill', 
        'fas fa-film', 
        'fas fa-filter', 
        'fas fa-fingerprint', 
        'fas fa-fire-alt', 
        'fas fa-fire-extinguisher', 
        'fas fa-fire', 
        'fas fa-first-aid', 
        'fas fa-fish', 
        'fas fa-fist-raised', 
        'fas fa-flag-checkered', 
        'fas fa-flag-usa', 
        'fas fa-flag', 
        'fas fa-flask', 
        'fas fa-flushed', 
        'fas fa-folder-minus', 
        'fas fa-folder-open', 
        'fas fa-folder-plus', 
        'fas fa-folder', 
        'fas fa-font-awesome-logo-full', 
        'fas fa-font', 
        'fas fa-football-ball', 
        'fas fa-forward', 
        'fas fa-frog', 
        'fas fa-frown-open', 
        'fas fa-frown', 
        'fas fa-funnel-dollar', 
        'fas fa-futbol', 
        'fas fa-gamepad', 
        'fas fa-gas-pump', 
        'fas fa-gavel', 
        'fas fa-gem', 
        'fas fa-genderless', 
        'fas fa-ghost', 
        'fas fa-gift', 
        'fas fa-gifts', 
        'fas fa-glass-cheers', 
        'fas fa-glass-martini-alt', 
        'fas fa-glass-martini', 
        'fas fa-glass-whiskey', 
        'fas fa-glasses', 
        'fas fa-globe-africa', 
        'fas fa-globe-americas', 
        'fas fa-globe-asia', 
        'fas fa-globe-europe', 
        'fas fa-globe', 
        'fas fa-golf-ball', 
        'fas fa-gopuram', 
        'fas fa-graduation-cap', 
        'fas fa-greater-than-equal', 
        'fas fa-greater-than', 
        'fas fa-grimace', 
        'fas fa-grin-alt', 
        'fas fa-grin-beam-sweat', 
        'fas fa-grin-beam', 
        'fas fa-grin-hearts', 
        'fas fa-grin-squint-tears', 
        'fas fa-grin-squint', 
        'fas fa-grin-stars', 
        'fas fa-grin-tears', 
        'fas fa-grin-tongue-squint', 
        'fas fa-grin-tongue-wink', 
        'fas fa-grin-tongue', 
        'fas fa-grin-wink', 
        'fas fa-grin', 
        'fas fa-grip-horizontal', 
        'fas fa-grip-lines-vertical', 
        'fas fa-grip-lines', 
        'fas fa-grip-vertical', 
        'fas fa-guitar', 
        'fas fa-h-square', 
        'fas fa-hamburger', 
        'fas fa-hammer', 
        'fas fa-hamsa', 
        'fas fa-hand-holding-heart', 
        'fas fa-hand-holding-medical', 
        'fas fa-hand-holding-usd', 
        'fas fa-hand-holding-water', 
        'fas fa-hand-holding', 
        'fas fa-hand-lizard', 
        'fas fa-hand-middle-finger', 
        'fas fa-hand-paper', 
        'fas fa-hand-peace', 
        'fas fa-hand-point-down', 
        'fas fa-hand-point-left', 
        'fas fa-hand-point-right', 
        'fas fa-hand-point-up', 
        'fas fa-hand-pointer', 
        'fas fa-hand-rock', 
        'fas fa-hand-scissors', 
        'fas fa-hand-sparkles', 
        'fas fa-hand-spock', 
        'fas fa-hands-helping', 
        'fas fa-hands-wash', 
        'fas fa-hands', 
        'fas fa-handshake-alt-slash', 
        'fas fa-handshake-slash', 
        'fas fa-handshake', 
        'fas fa-hanukiah', 
        'fas fa-hard-hat', 
        'fas fa-hashtag', 
        'fas fa-hat-cowboy-side', 
        'fas fa-hat-cowboy', 
        'fas fa-hat-wizard', 
        'fas fa-hdd', 
        'fas fa-head-side-cough-slash', 
        'fas fa-head-side-cough', 
        'fas fa-head-side-mask', 
        'fas fa-head-side-virus', 
        'fas fa-heading', 
        'fas fa-headphones-alt', 
        'fas fa-headphones', 
        'fas fa-headset', 
        'fas fa-heart-broken', 
        'fas fa-heart', 
        'fas fa-heartbeat', 
        'fas fa-helicopter', 
        'fas fa-highlighter', 
        'fas fa-hiking', 
        'fas fa-hippo', 
        'fas fa-history', 
        'fas fa-hockey-puck', 
        'fas fa-holly-berry', 
        'fas fa-home', 
        'fas fa-horse-head', 
        'fas fa-horse', 
        'fas fa-hospital-alt', 
        'fas fa-hospital-symbol', 
        'fas fa-hospital-user', 
        'fas fa-hospital', 
        'fas fa-hot-tub', 
        'fas fa-hotdog', 
        'fas fa-hotel', 
        'fas fa-hourglass-end', 
        'fas fa-hourglass-half', 
        'fas fa-hourglass-start', 
        'fas fa-hourglass', 
        'fas fa-house-damage', 
        'fas fa-house-user', 
        'fas fa-hryvnia', 
        'fas fa-i-cursor', 
        'fas fa-ice-cream', 
        'fas fa-icicles', 
        'fas fa-icons', 
        'fas fa-id-badge', 
        'fas fa-id-card-alt', 
        'fas fa-id-card', 
        'fas fa-igloo', 
        'fas fa-image', 
        'fas fa-images', 
        'fas fa-inbox', 
        'fas fa-indent', 
        'fas fa-industry', 
        'fas fa-infinity', 
        'fas fa-info-circle', 
        'fas fa-info', 
        'fas fa-italic', 
        'fas fa-jedi', 
        'fas fa-joint', 
        'fas fa-journal-whills', 
        'fas fa-kaaba', 
        'fas fa-key', 
        'fas fa-keyboard', 
        'fas fa-khanda', 
        'fas fa-kiss-beam', 
        'fas fa-kiss-wink-heart', 
        'fas fa-kiss', 
        'fas fa-kiwi-bird', 
        'fas fa-landmark', 
        'fas fa-language', 
        'fas fa-laptop-code', 
        'fas fa-laptop-house', 
        'fas fa-laptop-medical', 
        'fas fa-laptop', 
        'fas fa-laugh-beam', 
        'fas fa-laugh-squint', 
        'fas fa-laugh-wink', 
        'fas fa-laugh', 
        'fas fa-layer-group', 
        'fas fa-leaf', 
        'fas fa-lemon', 
        'fas fa-less-than-equal', 
        'fas fa-less-than', 
        'fas fa-level-down-alt', 
        'fas fa-level-up-alt', 
        'fas fa-life-ring', 
        'fas fa-lightbulb', 
        'fas fa-link', 
        'fas fa-lira-sign', 
        'fas fa-list-alt', 
        'fas fa-list-ol', 
        'fas fa-list-ul', 
        'fas fa-list', 
        'fas fa-location-arrow', 
        'fas fa-lock-open', 
        'fas fa-lock', 
        'fas fa-long-arrow-alt-down', 
        'fas fa-long-arrow-alt-left', 
        'fas fa-long-arrow-alt-right', 
        'fas fa-long-arrow-alt-up', 
        'fas fa-low-vision', 
        'fas fa-luggage-cart', 
        'fas fa-lungs-virus', 
        'fas fa-lungs', 
        'fas fa-magic', 
        'fas fa-magnet', 
        'fas fa-mail-bulk', 
        'fas fa-male', 
        'fas fa-map-marked-alt', 
        'fas fa-map-marked', 
        'fas fa-map-marker-alt', 
        'fas fa-map-marker', 
        'fas fa-map-pin', 
        'fas fa-map-signs', 
        'fas fa-map', 
        'fas fa-marker', 
        'fas fa-mars-double', 
        'fas fa-mars-stroke-h', 
        'fas fa-mars-stroke-v', 
        'fas fa-mars-stroke', 
        'fas fa-mars', 
        'fas fa-mask', 
        'fas fa-medal', 
        'fas fa-medkit', 
        'fas fa-meh-blank', 
        'fas fa-meh-rolling-eyes', 
        'fas fa-meh', 
        'fas fa-memory', 
        'fas fa-menorah', 
        'fas fa-mercury', 
        'fas fa-meteor', 
        'fas fa-microchip', 
        'fas fa-microphone-alt-slash', 
        'fas fa-microphone-alt', 
        'fas fa-microphone-slash', 
        'fas fa-microphone', 
        'fas fa-microscope', 
        'fas fa-minus-circle', 
        'fas fa-minus-square', 
        'fas fa-minus', 
        'fas fa-mitten', 
        'fas fa-mobile-alt', 
        'fas fa-mobile', 
        'fas fa-money-bill-alt', 
        'fas fa-money-bill-wave-alt', 
        'fas fa-money-bill-wave', 
        'fas fa-money-bill', 
        'fas fa-money-check-alt', 
        'fas fa-money-check', 
        'fas fa-monument', 
        'fas fa-moon', 
        'fas fa-mortar-pestle', 
        'fas fa-mosque', 
        'fas fa-motorcycle', 
        'fas fa-mountain', 
        'fas fa-mouse-pointer', 
        'fas fa-mouse', 
        'fas fa-mug-hot', 
        'fas fa-music', 
        'fas fa-network-wired', 
        'fas fa-neuter', 
        'fas fa-newspaper', 
        'fas fa-not-equal', 
        'fas fa-notes-medical', 
        'fas fa-object-group', 
        'fas fa-object-ungroup', 
        'fas fa-oil-can', 
        'fas fa-om', 
        'fas fa-otter', 
        'fas fa-outdent', 
        'fas fa-pager', 
        'fas fa-paint-brush', 
        'fas fa-paint-roller', 
        'fas fa-palette', 
        'fas fa-pallet', 
        'fas fa-paper-plane', 
        'fas fa-paperclip', 
        'fas fa-parachute-box', 
        'fas fa-paragraph', 
        'fas fa-parking', 
        'fas fa-passport', 
        'fas fa-pastafarianism', 
        'fas fa-paste', 
        'fas fa-pause-circle', 
        'fas fa-pause', 
        'fas fa-paw', 
        'fas fa-peace', 
        'fas fa-pen-alt', 
        'fas fa-pen-fancy', 
        'fas fa-pen-nib', 
        'fas fa-pen-square', 
        'fas fa-pen', 
        'fas fa-pencil-alt', 
        'fas fa-pencil-ruler', 
        'fas fa-people-arrows', 
        'fas fa-people-carry', 
        'fas fa-pepper-hot', 
        'fas fa-percent', 
        'fas fa-percentage', 
        'fas fa-person-booth', 
        'fas fa-phone-alt', 
        'fas fa-phone-slash', 
        'fas fa-phone-square-alt', 
        'fas fa-phone-square', 
        'fas fa-phone-volume', 
        'fas fa-phone', 
        'fas fa-photo-video', 
        'fas fa-piggy-bank', 
        'fas fa-pills', 
        'fas fa-pizza-slice', 
        'fas fa-place-of-worship', 
        'fas fa-plane-arrival', 
        'fas fa-plane-departure', 
        'fas fa-plane-slash', 
        'fas fa-plane', 
        'fas fa-play-circle', 
        'fas fa-play', 
        'fas fa-plug', 
        'fas fa-plus-circle', 
        'fas fa-plus-square', 
        'fas fa-plus', 
        'fas fa-podcast', 
        'fas fa-poll-h', 
        'fas fa-poll', 
        'fas fa-poo-storm', 
        'fas fa-poo', 
        'fas fa-poop', 
        'fas fa-portrait', 
        'fas fa-pound-sign', 
        'fas fa-power-off', 
        'fas fa-pray', 
        'fas fa-praying-hands', 
        'fas fa-prescription-bottle-alt', 
        'fas fa-prescription-bottle', 
        'fas fa-prescription', 
        'fas fa-print', 
        'fas fa-procedures', 
        'fas fa-project-diagram', 
        'fas fa-pump-medical', 
        'fas fa-pump-soap', 
        'fas fa-puzzle-piece', 
        'fas fa-qrcode', 
        'fas fa-question-circle', 
        'fas fa-question', 
        'fas fa-quidditch', 
        'fas fa-quote-left', 
        'fas fa-quote-right', 
        'fas fa-quran', 
        'fas fa-radiation-alt', 
        'fas fa-radiation', 
        'fas fa-rainbow', 
        'fas fa-random', 
        'fas fa-receipt', 
        'fas fa-record-vinyl', 
        'fas fa-recycle', 
        'fas fa-redo-alt', 
        'fas fa-redo', 
        'fas fa-registered', 
        'fas fa-remove-format', 
        'fas fa-reply-all', 
        'fas fa-reply', 
        'fas fa-republican', 
        'fas fa-restroom', 
        'fas fa-retweet', 
        'fas fa-ribbon', 
        'fas fa-ring', 
        'fas fa-road', 
        'fas fa-robot', 
        'fas fa-rocket', 
        'fas fa-route', 
        'fas fa-rss-square', 
        'fas fa-rss', 
        'fas fa-ruble-sign', 
        'fas fa-ruler-combined', 
        'fas fa-ruler-horizontal', 
        'fas fa-ruler-vertical', 
        'fas fa-ruler', 
        'fas fa-running', 
        'fas fa-rupee-sign', 
        'fas fa-sad-cry', 
        'fas fa-sad-tear', 
        'fas fa-satellite-dish', 
        'fas fa-satellite', 
        'fas fa-save', 
        'fas fa-school', 
        'fas fa-screwdriver', 
        'fas fa-scroll', 
        'fas fa-sd-card', 
        'fas fa-search-dollar', 
        'fas fa-search-location', 
        'fas fa-search-minus', 
        'fas fa-search-plus', 
        'fas fa-search', 
        'fas fa-seedling', 
        'fas fa-server', 
        'fas fa-shapes', 
        'fas fa-share-alt-square', 
        'fas fa-share-alt', 
        'fas fa-share-square', 
        'fas fa-share', 
        'fas fa-shekel-sign', 
        'fas fa-shield-alt', 
        'fas fa-shield-virus', 
        'fas fa-ship', 
        'fas fa-shipping-fast', 
        'fas fa-shoe-prints', 
        'fas fa-shopping-bag', 
        'fas fa-shopping-basket', 
        'fas fa-shopping-cart', 
        'fas fa-shower', 
        'fas fa-shuttle-van', 
        'fas fa-sign-in-alt', 
        'fas fa-sign-language', 
        'fas fa-sign-out-alt', 
        'fas fa-sign', 
        'fas fa-signal', 
        'fas fa-signature', 
        'fas fa-sim-card', 
        'fas fa-sink', 
        'fas fa-sitemap', 
        'fas fa-skating', 
        'fas fa-skiing-nordic', 
        'fas fa-skiing', 
        'fas fa-skull-crossbones', 
        'fas fa-skull', 
        'fas fa-slash', 
        'fas fa-sleigh', 
        'fas fa-sliders-h', 
        'fas fa-smile-beam', 
        'fas fa-smile-wink', 
        'fas fa-smile', 
        'fas fa-smog', 
        'fas fa-smoking-ban', 
        'fas fa-smoking', 
        'fas fa-sms', 
        'fas fa-snowboarding', 
        'fas fa-snowflake', 
        'fas fa-snowman', 
        'fas fa-snowplow', 
        'fas fa-soap', 
        'fas fa-socks', 
        'fas fa-solar-panel', 
        'fas fa-sort-alpha-down-alt', 
        'fas fa-sort-alpha-down', 
        'fas fa-sort-alpha-up-alt', 
        'fas fa-sort-alpha-up', 
        'fas fa-sort-amount-down-alt', 
        'fas fa-sort-amount-down', 
        'fas fa-sort-amount-up-alt', 
        'fas fa-sort-amount-up', 
        'fas fa-sort-down', 
        'fas fa-sort-numeric-down-alt', 
        'fas fa-sort-numeric-down', 
        'fas fa-sort-numeric-up-alt', 
        'fas fa-sort-numeric-up', 
        'fas fa-sort-up', 
        'fas fa-sort', 
        'fas fa-spa', 
        'fas fa-space-shuttle', 
        'fas fa-spell-check', 
        'fas fa-spider', 
        'fas fa-spinner', 
        'fas fa-splotch', 
        'fas fa-spray-can', 
        'fas fa-square-full', 
        'fas fa-square-root-alt', 
        'fas fa-square', 
        'fas fa-stamp', 
        'fas fa-star-and-crescent', 
        'fas fa-star-half-alt', 
        'fas fa-star-half', 
        'fas fa-star-of-david', 
        'fas fa-star-of-life', 
        'fas fa-star', 
        'fas fa-step-backward', 
        'fas fa-step-forward', 
        'fas fa-stethoscope', 
        'fas fa-sticky-note', 
        'fas fa-stop-circle', 
        'fas fa-stop', 
        'fas fa-stopwatch-20', 
        'fas fa-stopwatch', 
        'fas fa-store-alt-slash', 
        'fas fa-store-alt', 
        'fas fa-store-slash', 
        'fas fa-store', 
        'fas fa-stream', 
        'fas fa-street-view', 
        'fas fa-strikethrough', 
        'fas fa-stroopwafel', 
        'fas fa-subscript', 
        'fas fa-subway', 
        'fas fa-suitcase-rolling', 
        'fas fa-suitcase', 
        'fas fa-sun', 
        'fas fa-superscript', 
        'fas fa-surprise', 
        'fas fa-swatchbook', 
        'fas fa-swimmer', 
        'fas fa-swimming-pool', 
        'fas fa-synagogue', 
        'fas fa-sync-alt', 
        'fas fa-sync', 
        'fas fa-syringe', 
        'fas fa-table-tennis', 
        'fas fa-table', 
        'fas fa-tablet-alt', 
        'fas fa-tablet', 
        'fas fa-tablets', 
        'fas fa-tachometer-alt', 
        'fas fa-tag', 
        'fas fa-tags', 
        'fas fa-tape', 
        'fas fa-tasks', 
        'fas fa-taxi', 
        'fas fa-teeth-open', 
        'fas fa-teeth', 
        'fas fa-temperature-high', 
        'fas fa-temperature-low', 
        'fas fa-tenge', 
        'fas fa-terminal', 
        'fas fa-text-height', 
        'fas fa-text-width', 
        'fas fa-th-large', 
        'fas fa-th-list', 
        'fas fa-th', 
        'fas fa-theater-masks', 
        'fas fa-thermometer-empty', 
        'fas fa-thermometer-full', 
        'fas fa-thermometer-half', 
        'fas fa-thermometer-quarter', 
        'fas fa-thermometer-three-quarters', 
        'fas fa-thermometer', 
        'fas fa-thumbs-down', 
        'fas fa-thumbs-up', 
        'fas fa-thumbtack', 
        'fas fa-ticket-alt', 
        'fas fa-times-circle', 
        'fas fa-times', 
        'fas fa-tint-slash', 
        'fas fa-tint', 
        'fas fa-tired', 
        'fas fa-toggle-off', 
        'fas fa-toggle-on', 
        'fas fa-toilet-paper-slash', 
        'fas fa-toilet-paper', 
        'fas fa-toilet', 
        'fas fa-toolbox', 
        'fas fa-tools', 
        'fas fa-tooth', 
        'fas fa-torah', 
        'fas fa-torii-gate', 
        'fas fa-tractor', 
        'fas fa-trademark', 
        'fas fa-traffic-light', 
        'fas fa-trailer', 
        'fas fa-train', 
        'fas fa-tram', 
        'fas fa-transgender-alt', 
        'fas fa-transgender', 
        'fas fa-trash-alt', 
        'fas fa-trash-restore-alt', 
        'fas fa-trash-restore', 
        'fas fa-trash', 
        'fas fa-tree', 
        'fas fa-trophy', 
        'fas fa-truck-loading', 
        'fas fa-truck-monster', 
        'fas fa-truck-moving', 
        'fas fa-truck-pickup', 
        'fas fa-truck', 
        'fas fa-tshirt', 
        'fas fa-tty', 
        'fas fa-tv', 
        'fas fa-umbrella-beach', 
        'fas fa-umbrella', 
        'fas fa-underline', 
        'fas fa-undo-alt', 
        'fas fa-undo', 
        'fas fa-universal-access', 
        'fas fa-university', 
        'fas fa-unlink', 
        'fas fa-unlock-alt', 
        'fas fa-unlock', 
        'fas fa-upload', 
        'fas fa-user-alt-slash', 
        'fas fa-user-alt', 
        'fas fa-user-astronaut', 
        'fas fa-user-check', 
        'fas fa-user-circle', 
        'fas fa-user-clock', 
        'fas fa-user-cog', 
        'fas fa-user-edit', 
        'fas fa-user-friends', 
        'fas fa-user-graduate', 
        'fas fa-user-injured', 
        'fas fa-user-lock', 
        'fas fa-user-md', 
        'fas fa-user-minus', 
        'fas fa-user-ninja', 
        'fas fa-user-nurse', 
        'fas fa-user-plus', 
        'fas fa-user-secret', 
        'fas fa-user-shield', 
        'fas fa-user-slash', 
        'fas fa-user-tag', 
        'fas fa-user-tie', 
        'fas fa-user-times', 
        'fas fa-user', 
        'fas fa-users-cog', 
        'fas fa-users-slash', 
        'fas fa-users', 
        'fas fa-utensil-spoon', 
        'fas fa-utensils', 
        'fas fa-vector-square', 
        'fas fa-venus-double', 
        'fas fa-venus-mars', 
        'fas fa-venus', 
        'fas fa-vest-patches', 
        'fas fa-vest', 
        'fas fa-vial', 
        'fas fa-vials', 
        'fas fa-video-slash', 
        'fas fa-video', 
        'fas fa-vihara', 
        'fas fa-virus-slash', 
        'fas fa-virus', 
        'fas fa-viruses', 
        'fas fa-voicemail', 
        'fas fa-volleyball-ball', 
        'fas fa-volume-down', 
        'fas fa-volume-mute', 
        'fas fa-volume-off', 
        'fas fa-volume-up', 
        'fas fa-vote-yea', 
        'fas fa-vr-cardboard', 
        'fas fa-walking', 
        'fas fa-wallet', 
        'fas fa-warehouse', 
        'fas fa-water', 
        'fas fa-wave-square', 
        'fas fa-weight-hanging', 
        'fas fa-weight', 
        'fas fa-wheelchair', 
        'fas fa-wifi', 
        'fas fa-wind', 
        'fas fa-window-close', 
        'fas fa-window-maximize', 
        'fas fa-window-minimize', 
        'fas fa-window-restore', 
        'fas fa-wine-bottle', 
        'fas fa-wine-glass-alt', 
        'fas fa-wine-glass', 
        'fas fa-won-sign', 
        'fas fa-wrench', 
        'fas fa-x-ray', 
        'fas fa-yen-sign', 
        'fas fa-yin-yang'
    ];

    // Create icon grid
    function createIconGrid(searchTerm = '') {
        iconContainer.innerHTML = '';
        const filteredIcons = icons.filter(icon => 
            icon.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredIcons.forEach(icon => {
            const div = document.createElement('div');
            div.className = 'icon-item';
            const cleanIconClass = icon.replace(/^fas\s+fas\s+/, 'fas ');
            const iconName = cleanIconClass.replace(/^fas fa-/, '');
            div.innerHTML = `
                <i class="${cleanIconClass}"></i>
                <small>${iconName}</small>
            `;
            div.onclick = () => {
                handleIconClick(cleanIconClass);
            };
            iconContainer.appendChild(div);
        });
    }

    // Event listeners
    iconPicker.onclick = () => {
        iconPickerModal.style.display = 'block';
        createIconGrid();
    };

    closeIconPicker.onclick = () => {
        iconPickerModal.style.display = 'none';
    };

    iconSearch.addEventListener('input', (e) => {
        createIconGrid(e.target.value);
    });

    const saveButton = document.getElementById('saveIconSelection');
    
    // Add save button event listener with event parameter
    saveButton.addEventListener('click', function(event) {
        saveIconSelection(event);
    });

    // Update window click handler to not close when clicking inside modal content
    window.onclick = (event) => {
        if (event.target === iconPickerModal) {
            iconPickerModal.style.display = 'none';
        }
    };
});

let selectedIcons = [];

function updateIconPreview() {
    const previewDiv = document.getElementById('IconPreview');
    previewDiv.innerHTML = '';
    selectedIcons.forEach(icon => {
        const i = document.createElement('i');
        i.className = icon;
        i.style.marginRight = '5px';
        previewDiv.appendChild(i);
    });
    
    document.getElementById('IconInput').value = selectedIcons.join(',');
}

function updateSelectedIconsDisplay() {
    const container = document.getElementById('selectedIcons');
    container.innerHTML = '';
    selectedIcons.forEach(icon => {
        const div = document.createElement('div');
        div.className = 'selected-icon';
        const cleanIconClass = icon.replace(/^fas\s+fas\s+/, 'fas ');
        const iconName = cleanIconClass.replace(/^fas fa-/, '');
        div.innerHTML = `<i class="${cleanIconClass}"></i>${iconName}<span class="remove">×</span>`;
        div.querySelector('.remove').onclick = () => {
            selectedIcons = selectedIcons.filter(i => i !== icon);
            updateSelectedIconsDisplay();
            updateIconPreview();
        };
        container.appendChild(div);
    });
}

function handleIconClick(iconClass) {
    if (!selectedIcons.includes(iconClass)) {
        selectedIcons.push(iconClass);
        updateSelectedIconsDisplay();
        updateIconPreview();
    }
}

// Initialize with default icon if none selected
if (selectedIcons.length === 0) {
    updateSelectedIconsDisplay();
    updateIconPreview();
}

// Add save functionality
function saveIconSelection(event) {
    // Prevent any default form submission
    event.preventDefault();
    // Just close the modal
    iconPickerModal.style.display = 'none';
}
