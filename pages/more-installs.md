---
layout: page
width: xsmall
permalink: /more-manual-installs/
title: Other manual installs \| Find website clones
image: /uploads/dscm_sm.png
description: On this page you can find all the information about the manual installation of DSCM. Install DSCM to detect malicious clones of your website that are used in phishing attacks.
---

# Other manual installs

Here is a overview of all the manual install options that are currently available to our technical users. 
Each option includes a table with information on their compatibility with our plans. 
We offer a variety of languages (HTML, JavaScript, CSS), allowing you to install the personal link in a location of your choise, increasing its difficulty to be identified.

<table>
<tbody>
<tr>
<td style="width:30px"><strong>Free</strong></td>
<td><strong>Premium</strong></td>
</tr>
<tr>
<td>✅</td>
<td>❌</td>
</tr>
</tbody>
</table>
```
<img src="<YOUR_PERSONAL_LINK_HERE>" style="display: none;"></img>
```

<table>
<tbody>
<tr>
<td style="width:30px"><strong>Free</strong></td>
<td><strong>Premium</strong></td>
</tr>
<tr>
<td>✅</td>
<td>❌</td>
</tr>
</tbody>
</table>
```
<script>
var xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", "<YOUR_PERSONAL_LINK_HERE>", false );
xmlHttp.send( null );
</script>
```

<table>
<tbody>
<tr>
<td style="width:30px"><strong>Free</strong></td>
<td><strong>Premium</strong></td>
</tr>
<tr>
<td>✅</td>
<td>❌</td>
</tr>
</tbody>
</table>
```
<style>
@import url('<YOUR_PERSONAL_LINK_HERE>');
</style>
```


<script>
var replaced = $("body").html().replace(/&lt;YOUR_PERSONAL_LINK_HERE&gt;/g,'<span id="link2"><mark>&lt;YOUR_PERSONAL_LINK_HERE&gt;</mark></span>');
$("body").html(replaced);
</script>
