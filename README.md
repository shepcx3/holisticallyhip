# Holistically Hip: website redesign prototype

A static design prototype for the [Holistically Hip](https://holisticallyhip.ca/) website redesign. The shop is at 233 Princess Street in Kingston, Ontario. The look follows SKIMS: full-bleed photography, a quiet off-white canvas, small tracked uppercase type, underlined text links and square-cornered buttons. The logo's forest green is the only accent colour.

The live site runs on Shopify. This prototype is for getting the design approved first; once it is, it gets converted into a Shopify theme.

## Run it

Open `index.html` in a browser. There is no build step and no dependencies. Fonts load from Google Fonts (Jost for headings, Hanken Grotesk for body text).

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `shop.html` | Shop landing (all categories) |
| `collection.html#<handle>` | Collection template: `health`, `wellness`, `home`, `snacks`, `supplements`, `sale` |
| `product.html#<handle>` | Product template |
| `about.html` | About Us |
| `journal.html` | Blog & Recipes |
| `services.html` | Services & Events |
| `visit.html` | Visit, hours, delivery, contact |

## Structure

- `assets/css/styles.css`: design tokens (colour, type, spacing) and all components.
- `assets/js/site.js`: renders the shared announcement bar, header, mega menu, mobile menu, cart drawer, search panel, newsletter and footer. It also holds the store info (`STORE`), the collections (`COLLECTIONS`) and a few sample products (`PRODUCTS`).
- `assets/img/`: the client's photos and a transparent logo and wordmark traced from their logo.

## Moving to Shopify

| Prototype | Shopify |
| --- | --- |
| `STORE` | Theme settings |
| `NAV` and `COLLECTIONS` | The main menu and collections |
| `PRODUCTS` | The live catalogue (1,004 products) |
| Header, footer and drawers | Theme sections |

The cart, search, accounts and newsletter sign-up are visual only in the prototype.

## To confirm with the client

- Store hours. The current site lists two different schedules.
- Free-shipping threshold, local delivery area and the return policy.
- The About copy, which is a draft written from public information.
- Services, events and blog posts. Those sections use placeholders.
- More photography. Snacks, Supplements and Sale have no category images yet.
