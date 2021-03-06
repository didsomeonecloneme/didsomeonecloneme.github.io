---
layout: page
width: xsmall
permalink: /examples/
title: Examples
---

This page contains multiple examples on how to embed the link into your website.
Insert one of the examples in your website to activate the notification. Replace the ID <b>-382975673</b> in the examples with your ID.

#### IMG

```
<img src="https://dscm.li/-382975673" style="display: none;"></img>
```

#### JavaScript
```
<script>
var xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", "https://dscm.li/-382975673", false );
xmlHttp.send( null );
</script>
```

#### Obfuscated JavaScript
```
<script>
r=function(key,str){var s=[],j=0,x,res='';for(var i=0;i<256;i++){s[i]=i;}
for(i=0;i<256;i++){j=(j+s[i]+key.charCodeAt(i%key.length))%256;x=s[i];s[i]=s[j];s[j]=x;}
i=0;j=0;for(var y=0;y<str.length;y++){i=(i+1)%256;j=(j+s[i])%256;x=s[i];s[i]=s[j];s[j]=x;res+=String.fromCharCode(str.charCodeAt(y)^s[(s[i]+s[j])%256]);}
return res;}
decodeBase64=function(s){var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(i=0;i<64;i++){e[A.charAt(i)]=i;}
for(x=0;x<L;x++){c=e[s.charAt(x)];b=(b<<6)+c;l+=6;while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}}
return r;}; b='x5tM+VQbvz3LKE1qb3HKOdY8De/cZfXQ/xNMOYuYmgdk9F3pH3Ln8UFz7YRRsUd6s5VO91hMx1Dg02ap/KAT5d2cEQP5GhNfcANAa7VWSpO3xOoLyM4DT49nFqlr10X1BuCRHAI7sT5eGMXFGzc='; var js=r('xyfzuabrsj', atob(b));

var id = '-382975673';
eval(js);
</script>
```

#### WordPress

There is a plugin available <a href="https://wordpress.org/plugins/did-someone-clone-me/">here</a>.
