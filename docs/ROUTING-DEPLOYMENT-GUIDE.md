# Multi-Market Routing: Vercel & IONOS Configuration Guide

All four market hosts point to ONE Vercel project and ONE Next.js codebase.

## 1. Domains to Add to the Vercel Project

Navigate to your Vercel Project Dashboard: **Settings > Domains** and ensure the following domains are added:

1. `purpleoryn.com` (Apex domain — Dominican Republic full site)
2. `www.purpleoryn.com` (Redirects to purpleoryn.com or serves as alias)
3. `us.purpleoryn.com` (United States landing page)
4. `ca.purpleoryn.com` (Canada landing page)
5. `ht.purpleoryn.com` (Haiti landing page)

---

## 2. IONOS DNS Records to Create

In your IONOS Control Panel under **DNS Settings** for `purpleoryn.com`:

| Type  | Host Name / Subdomain | Points To / Target       | TTL   | Purpose                     |
|-------|-----------------------|--------------------------|-------|-----------------------------|
| CNAME | `us`                  | `cname.vercel-dns.com.`  | 1 hr  | Points `us.purpleoryn.com`  |
| CNAME | `ca`                  | `cname.vercel-dns.com.`  | 1 hr  | Points `ca.purpleoryn.com`  |
| CNAME | `ht`                  | `cname.vercel-dns.com.`  | 1 hr  | Points `ht.purpleoryn.com`  |

*Note: The root domain `purpleoryn.com` (A record pointing to `76.76.21.21`) and `www` CNAME record already exist and should not be modified.*

---

## 3. Environment Variables to Set in Vercel

Under **Settings > Environment Variables**, add:

- `MARKET_LINK_SECRET`: A high-entropy random string (at least 32 characters) used to sign and verify link tokens (`?k=`) and the `pcl_market` cookie.
- `GEO_STRICT`: `true` (default) treats unknown proxy reputation as neutral. Set to `false` if carrier IPs in Haiti or the DR trigger false positives.
- `IP_REPUTATION_PROVIDER`: `none` (default for v1), `ipinfo`, or `ipqualityscore`.
- `IP_REPUTATION_KEY`: API key for the chosen reputation provider (leave empty if provider is `none`).
- `ROUTING_IP_SALT`: Random hex salt used to hash visitor IPs before inserting into `routing_events` (ensuring raw IPs are never stored).
- `BOOKING_URL_US`: Cal.com or Calendly booking URL for US consultations.
- `BOOKING_URL_CA`: Booking URL for Canadian consultations.
- `WHATSAPP_HT`: WhatsApp destination URL for Haiti (e.g. `https://wa.me/18293417129`).
