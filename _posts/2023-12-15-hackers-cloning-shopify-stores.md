---
title: Cybercriminals cloning Shopify stores to scam visitors
author: dscm
categories: [Shopify]
---

Nowadays, lots of people run online stores using Shopify. It's a great way to sell things on the internet. However, Shopify stores are also being cloned and mirrored by malicious actors in order to scam visitors. In this blog, we'll talk about what they're doing and how it can hurt store owners and customers. 

![Shopify banner](/assets/img/blogs/shopify-banner.png)

## How it began
Among our customers we noticed an increase of clones against Shopify stores. A huge amount of random domains with uncommon TLD's like .top, .icu, .website are redirected to Shopify stores. The clones are exact copies of the Shopify stores. How does this attack work and how to protect yourself?

## Cloudflare
The attackers are using Cloudflare in order to forward the fake domains to the Shopify stores. Cloudflare offers a proxy feature, that forwards all requests from the fake domain to the legit Shopify website. This results in a exact copy: even if the site owner changes the Shopify store, the fake clone is updated in real-time. 

## Using Search Engines
We found many clones showing up in Search engines like Google. Most likely, the victims falling for this scam, are originated from these search engines while searching for products that they would like to buy. We found out that victims are actually visiting the clones while they are online.

## Hijacking the checkout
We expect that the cybercriminals are updating the checkout page on the clone in order to scam visitors. The payment is going to the malicious actor instead of the legit Shopify owner or the cybercriminals are stealing the payment details of the users. 

This both damages the customers and the website owner. The customer is losing money during the scam, while the website owners brand reputation is damaged, because the victims believe they bought the product at the original store.

## Mitigating the threat
Our free service of <a href="https://didsomeoneclone.me/">DSCM</a> allows you to get notified whenever your website is cloned (max 1 clone per month). This allows you to be aware of this attack whenever it takes place.

By upgrading to <a href="https://didsomeoneclone.me/pricing/">Premium</a>, you will get more features like unlimited clones and capabilities to block the threat.

After detecting and blocking the threat using DSCM, we recommend to contact <a href="https://abuse.cloudflare.com/">Cloudflare</a> and report your findings. They may be able to completely shutdown the attack by disabling the attackers Cloudflare account.