---
layout: page
width: xsmall
permalink: /installation/
title: Installation \| Find malicious website clones
image: /uploads/dscm_sm.png
description: On this page you can find all the information about the installation of DSCM. Install DSCM to detect malicious clones of your website that are used in phishing attacks.
---

# Installation

DSCM requires you to add the personal link to your websites source code. Implement one of the solutions below to activate the notification. 
Use your own personal link when installing the examples (if you lost the link, its always included in the emails we send).

#### Easy installs
{% include easy_installs.html %}

#### HTML

```
<img src="<YOUR_PERSONAL_LINK_HERE>" style="display: none;"></img>
```

#### JavaScript
```
<script>
var xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", "<YOUR_PERSONAL_LINK_HERE>", false );
xmlHttp.send( null );
</script>
```

<script>
var replaced = $("body").html().replace(/&lt;YOUR_PERSONAL_LINK_HERE&gt;/g,'<mark>&lt;YOUR_PERSONAL_LINK_HERE&gt;</mark>');
$("body").html(replaced);
</script>
