---
layout: page
width: expand
title: Detect Phishing Attacks
hero:
    title: Did someone clone me?
    subtitle: Request a link below and start detecting clones of your website
    search: true
    image: dscm.svg
image: /uploads/dscm_sm.png
description: We offer a free service that enables you to detect phishing attacks abusing your website. This allows you to protect your website and it's visitors against phishing attacks.
---
{% if jekyll.environment == 'enterprise' %}
<script>
    window.location.href = "/login";
</script>
{% else %}
{% include boxes.html columns="3" title="" subtitle="" %}

{% include trusted.html columns="3" title="" subtitle="" %}

{% include faqs.html multiple="true" title="FAQ" category="presale" subtitle="" %}
{% endif %}