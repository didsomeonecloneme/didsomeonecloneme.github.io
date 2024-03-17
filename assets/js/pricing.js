function adjustPricesBasedOnPeriod() {
  // Get the 'period' parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const period = urlParams.get('period');

  // Get all span elements
  const spans = document.getElementsByTagName('span');

  // Loop through all spans
  for (let i = 0; i < spans.length; i++) {
    // Check if the span id starts with 'price_'
    if (spans[i].id.startsWith('price_')) {
      spans[i].style.display = '';
      
      // Get the value from the span and convert it to a number
      let price = parseFloat(spans[i].textContent);

      // If the period is 'yearly', multiply the price by 12
      if (period === 'yearly') {
        price *= 12;
      }

      // Add a euro sign in front of the value and '/ month' or '/ year' depending on the period value
      spans[i].textContent = '€ ' + price.toFixed(2) + (period === 'yearly' ? ' / year' : ' / month');
    }
  }

  // Get all 'a' elements
  const links = document.getElementsByTagName('a');

  // Loop through all 'a' elements
  for (let i = 0; i < links.length; i++) {
    // Check if the 'a' id starts with 'select_'
    if (links[i].id.startsWith('select_')) {
      // If 'period' is not null, add it to the 'href' attribute
      if (period) {
        links[i].href += '&period=' + period;
      }
    }
  }
}

function updatePricePeriodLink() {
  // Get the 'period' parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const period = urlParams.get('period');

  // Perform the action only if 'period' is 'yearly'
  if (period === 'yearly') {
    // Get the 'a' element with id 'price_period'
    const pricePeriodLink = document.getElementById('price_period');

    if (pricePeriodLink) {
      // Update the 'href' attribute and the text content
      pricePeriodLink.href = "/pricing?period=monthly";
      pricePeriodLink.textContent = "Pay Monthly";
    }
  }
}

// Add the function to the 'load' event of the window
window.addEventListener('load', updatePricePeriodLink);
window.addEventListener('load', adjustPricesBasedOnPeriod);