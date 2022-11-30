---
layout: page
width: xsmall
permalink: /installation/
title: Installation
---

DSCM requires you to add the personal link to your websites source code. Implement one of the solutions below to activate the notification. 
Use your own personal link when installing the examples (if you lost the link, its always included in the emails we send).

#### Easy installs
<span title="Wordpress"><a href="https://wordpress.org/plugins/did-someone-clone-me/" style="border-bottom:0px;"><img src="/assets/img/wp.png" style="max-width: auto; height: 75px;"></a></span>
<span title="Google tag manager" hidden><a href="https://dummy/" style="border-bottom:0px;"><img src="/assets/img/gtm.png" style="max-width: auto; height: 50px;"></a></span>

#### IMG

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
