---
layout: page
width: xsmall
title: Email address confirmed successfully
permalink: /confirmed/
---

The final step is to insert the following code snippet into your website:
{% include examples.md %}

## Share it!
<a href="https://twitter.com/share?text=I%20just%20signed%20up%20to%20didsomeoneclone.me%20to%20get%20notified%20once%20my%20website%20is%20cloned%20#phishing%20#dscm&url=%20" class="twitter-share-button" data-size=large data-show-count="false"></a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<script>
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
id = urlParams.get('id');

if (id && /^-?[0-9]+$/.test(id)) {
	document.body.innerHTML = document.body.innerHTML.replace(/-382975673/g, id);
}
</script>
