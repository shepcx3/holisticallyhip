/* Holistically Hip — static prototype
   One file renders the shared chrome (announcement bar, header, menus, drawers,
   newsletter, footer) and the data-driven parts of each page. When this moves to
   Shopify, STORE, NAV and COLLECTIONS map onto theme settings and menus, and
   PRODUCTS is replaced by the live catalogue. */

const STORE = {
  name: "Holistically Hip",
  address: ["233 Princess Street", "Kingston, ON K7L 1B3"],
  phone: "613-766-4443",
  instagram: "https://www.instagram.com/holisticallyhipygk/",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=233+Princess+Street+Kingston+ON",
  // TODO: confirm with the client. Their current site lists two different schedules.
  hours: [
    ["Mon – Sat", "10am – 6pm"],
    ["Sunday", "11am – 5pm"],
  ],
  freeShippingThreshold: 100, // TODO: confirm the real threshold
  announcements: [
    "Free local delivery in Kingston, every day",
    "Shipping across Canada",
    "Visit us at 233 Princess Street, downtown Kingston",
  ],
};

const COLLECTIONS = [
  {
    handle: "health",
    title: "Health",
    blurb: "Everyday support for immunity, digestion, sleep and hormones, chosen with a nutritionist's eye.",
    subs: ["Immunity", "Digestion", "Sleep & Stress", "Women's Health"],
    image: "assets/img/store-interior-sm.jpg",
  },
  {
    handle: "wellness",
    title: "Wellness",
    blurb: "Clean skincare, body care and self-care rituals, most of it made in Canada.",
    subs: ["Skincare", "Body Care", "Deodorant", "Bath"],
    image: "assets/img/routine-shelf-sm.jpg",
  },
  {
    handle: "home",
    title: "Home",
    blurb: "Low-tox home goods, candles and small things that make a space feel calm.",
    subs: ["Candles", "Aromatherapy", "Kitchen", "Gifts"],
    image: "assets/img/store-interior-sm.jpg",
  },
  {
    handle: "snacks",
    title: "Snacks",
    blurb: "Better-for-you snacks, drink mixes and pantry staples.",
    subs: ["Drink Mixes", "Bars", "Pantry"],
    image: null,
  },
  {
    handle: "supplements",
    title: "Supplements",
    blurb: "Practitioner-quality vitamins, minerals, tinctures and functional mushrooms.",
    subs: ["Vitamins", "Minerals", "Mushrooms", "Collagen"],
    image: null,
  },
  {
    handle: "sale",
    title: "Sale",
    blurb: "Limited-time prices on favourites while stock lasts.",
    subs: [],
    image: null,
  },
];

const NAV = [
  { label: "Shop", href: "shop.html", mega: true },
  { label: "About Us", href: "about.html" },
  { label: "Blog & Recipes", href: "journal.html" },
  { label: "Services & Events", href: "services.html" },
];

/* Sample products: real brands the shop carries, used to show layout only.
   Prices are left blank until they come from Shopify. */
const PRODUCTS = [
  { handle: "routine-deodorant-sexy-sadie", brand: "Routine", name: "Natural Deodorant, Sexy Sadie", variant: "Sweet, spicy & delightful · 58g", image: "assets/img/routine-deodorant-sm.jpg", collections: ["wellness"], badge: "Made in Canada" },
  { handle: "routine-body-cream-the-curator", brand: "Routine", name: "Natural Body Cream, The Curator", variant: "Botanic, aromatic & savvy · 350ml", image: "assets/img/routine-shelf-sm.jpg", collections: ["wellness"], badge: "Made in Canada" },
  { handle: "wildcraft-brighten-vitamin-c-serum", brand: "Wildcraft", name: "Brighten Vitamin C Face Serum", variant: "30ml", collections: ["wellness"], badge: "Best seller" },
  { handle: "rainbo-11-11-mushroom-tincture", brand: "Rainbo", name: "11:11 Super Multi-Mushroom Tincture", variant: "60ml", collections: ["health", "supplements"], badge: "Best seller" },
  { handle: "natural-factors-ubiquinol-coq10", brand: "Natural Factors", name: "Ubiquinol CoQ10", variant: "Softgels", collections: ["supplements", "health"] },
  { handle: "womensense-vitex", brand: "WomenSense", name: "Vitex", variant: "Capsules", collections: ["health", "supplements"] },
  { handle: "biosil-collagen-generator", brand: "BioSil", name: "Collagen Generator", variant: "Capsules", collections: ["supplements", "sale"], sale: true },
  { handle: "blume-superbelly", brand: "Blume", name: "SuperBelly Hydration Powder", variant: "Single serve", collections: ["snacks", "health"] },
  { handle: "natura-soylights-shower-steamers", brand: "Natura", name: "Soylights Shower Steamers", variant: "Assorted scents", collections: ["wellness", "home"] },
  { handle: "3-brains-brilliant-mind", brand: "3 Brains", name: "Brilliant Mind", variant: "Capsules", collections: ["supplements"] },
  { handle: "aeryon-up-and-away", brand: "Aeryon", name: "Up & Away", variant: "Boric acid suppositories", collections: ["health", "sale"], sale: true },
  { handle: "womensense-cranberry-d-mannose", brand: "WomenSense", name: "Cranberry D-Mannose", variant: "Capsules", collections: ["health", "supplements", "sale"], sale: true },
];

const TOTAL_PRODUCTS = 1004;

/* ---------- helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const page = document.body.dataset.page || "";

const ICONS = {
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
  account: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5c1.3-3.7 4.1-5.5 7.5-5.5s6.2 1.8 7.5 5.5"/></svg>',
  bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12.5H6L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg>',
};

function collectionUrl(handle) { return `collection.html#${handle}`; }
function productUrl(handle) { return `product.html#${handle}`; }

/* ---------- shared chrome ---------- */
function renderAnnouncement() {
  const el = document.createElement("div");
  el.className = "announce";
  el.setAttribute("role", "region");
  el.setAttribute("aria-label", "Store announcements");
  el.innerHTML = `<div class="wrap">${STORE.announcements
    .map((m, i) => `<p class="announce__msg" style="margin:0" aria-hidden="${i ? "true" : "false"}">${esc(m)}</p>`)
    .join("")}</div>`;
  document.body.prepend(el);
  const msgs = $$(".announce__msg", el);
  let i = 0;
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(() => {
      msgs[i].setAttribute("aria-hidden", "true");
      i = (i + 1) % msgs.length;
      msgs[i].setAttribute("aria-hidden", "false");
    }, 4500);
  }
}

function megaMenu() {
  const list = COLLECTIONS.map((c) => `<li><a href="${collectionUrl(c.handle)}">${esc(c.title)}</a></li>`).join("");
  return `
  <div class="mega" id="mega-shop">
    <div class="wrap mega__inner">
      <div>
        <p class="eyebrow muted" style="margin-bottom:16px">Shop by category</p>
        <ul class="mega__list">${list}<li><a href="shop.html">Shop all</a></li></ul>
      </div>
      <div>
        <p class="eyebrow muted" style="margin-bottom:16px">Discover</p>
        <ul class="mega__list">
          <li><a href="${collectionUrl("wellness")}">Made in Canada</a></li>
          <li><a href="${collectionUrl("health")}">Best sellers</a></li>
          <li><a href="${collectionUrl("supplements")}">New arrivals</a></li>
          <li><a href="services.html">Gift cards</a></li>
        </ul>
      </div>
      <div class="mega__features">
        <a class="mega__card" href="${collectionUrl("wellness")}">
          <img src="assets/img/routine-deodorant-sm.jpg" alt="Routine natural deodorants in pastel tubes on a wooden shelf" loading="lazy">
          <span class="title-sm">Natural deodorant</span>
        </a>
        <a class="mega__card" href="visit.html">
          <img src="assets/img/store-interior-sm.jpg" alt="Inside the Holistically Hip shop on Princess Street" loading="lazy">
          <span class="title-sm">Visit the shop</span>
        </a>
      </div>
    </div>
  </div>`;
}

function renderHeader() {
  const navItems = NAV.map((n) => {
    const current = (n.href === `${page}.html`) || (n.mega && (page === "shop" || page === "collection" || page === "product"));
    if (n.mega) {
      return `<div class="nav__item" data-mega>
        <a class="nav__link" href="${n.href}" aria-haspopup="true" aria-expanded="false" aria-controls="mega-shop"${current ? ' aria-current="page"' : ""}>${esc(n.label)}</a>
        ${megaMenu()}
      </div>`;
    }
    return `<div class="nav__item"><a class="nav__link" href="${n.href}"${current ? ' aria-current="page"' : ""}>${esc(n.label)}</a></div>`;
  }).join("");

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="wrap site-header__inner">
      <div style="display:flex;align-items:center;gap:16px;height:100%">
        <button class="icon-btn menu-toggle" type="button" aria-label="Open menu" aria-controls="menu-drawer" aria-expanded="false" data-open="menu-drawer">${ICONS.menu}</button>
        <nav class="nav" aria-label="Main">${navItems}</nav>
      </div>
      <a class="site-header__logo" href="index.html" aria-label="Holistically Hip, home">
        <img src="assets/img/wordmark-dark.png" alt="Holistically Hip" width="1071" height="113">
      </a>
      <div class="header-tools">
        <button class="icon-btn" type="button" aria-label="Search" data-open="search-panel">${ICONS.search}</button>
        <a class="icon-btn hide-mobile" href="#" aria-label="Account" data-soon>${ICONS.account}</a>
        <button class="icon-btn" type="button" aria-label="Bag, 0 items" data-open="cart-drawer">${ICONS.bag}<span class="cart-count" data-cart-count>0</span></button>
      </div>
    </div>`;
  document.querySelector(".announce").after(header);

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 4);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mega menu: hover on desktop, focus for keyboard
  const item = $("[data-mega]", header);
  if (item) {
    const link = $(".nav__link", item);
    let t;
    const open = () => { clearTimeout(t); item.classList.add("is-open"); link.setAttribute("aria-expanded", "true"); };
    const close = () => { t = setTimeout(() => { item.classList.remove("is-open"); link.setAttribute("aria-expanded", "false"); }, 120); };
    item.addEventListener("mouseenter", open);
    item.addEventListener("mouseleave", close);
    item.addEventListener("focusin", open);
    item.addEventListener("focusout", (e) => { if (!item.contains(e.relatedTarget)) close(); });
    item.addEventListener("keydown", (e) => { if (e.key === "Escape") { close(); link.focus(); } });
  }
}

function renderDrawers() {
  const shopLinks = COLLECTIONS.map((c) => `<li><a href="${collectionUrl(c.handle)}">${esc(c.title)}</a></li>`).join("");
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div class="scrim" data-scrim></div>

    <aside class="drawer drawer--left" id="menu-drawer" aria-label="Menu" aria-hidden="true">
      <div class="drawer__head">
        <img src="assets/img/wordmark-dark.png" alt="Holistically Hip" style="height:16px;width:auto">
        <button class="icon-btn" type="button" aria-label="Close menu" data-close>${ICONS.close}</button>
      </div>
      <div class="drawer__body">
        <ul class="mobile-nav">
          <li><details open><summary>Shop</summary><ul>${shopLinks}<li><a href="shop.html">Shop all</a></li></ul></details></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="journal.html">Blog & Recipes</a></li>
          <li><a href="services.html">Services & Events</a></li>
          <li><a href="visit.html">Visit the Shop</a></li>
        </ul>
        <div class="mobile-meta">
          <span>${esc(STORE.address.join(", "))}</span>
          <span>${esc(STORE.phone)}</span>
        </div>
      </div>
    </aside>

    <aside class="drawer drawer--right" id="cart-drawer" aria-label="Your bag" aria-hidden="true">
      <div class="drawer__head">
        <span class="title-sm">Your bag (0)</span>
        <button class="icon-btn" type="button" aria-label="Close bag" data-close>${ICONS.close}</button>
      </div>
      <div class="drawer__body">
        <div class="ship-meter">
          <span>You're $${STORE.freeShippingThreshold} away from free shipping in Canada.</span>
          <div class="ship-meter__bar"><span></span></div>
        </div>
        <div class="cart-empty">
          <p class="heading" style="font-size:var(--fs-md)">Your bag is empty</p>
          <p class="muted" style="margin:0;font-size:var(--fs-sm)">Kingston orders can be delivered locally the same day.</p>
          <a class="btn" href="shop.html">Start shopping</a>
        </div>
      </div>
      <div class="drawer__foot">
        <p class="muted" style="margin:0;font-size:var(--fs-xs)">Checkout runs through Shopify on the live site.</p>
      </div>
    </aside>

    <div class="search-panel" id="search-panel" aria-label="Search" aria-hidden="true">
      <div class="wrap">
        <form role="search" data-search-form>
          <label class="visually-hidden" for="site-search">Search products</label>
          <input id="site-search" type="search" placeholder="Search products, brands, rituals" autocomplete="off">
          <button class="icon-btn" type="button" aria-label="Close search" data-close>${ICONS.close}</button>
        </form>
        <div class="search-panel__hints">
          <span class="eyebrow muted">Popular</span>
          <a class="link" href="${collectionUrl("supplements")}">Magnesium</a>
          <a class="link" href="${collectionUrl("wellness")}">Deodorant</a>
          <a class="link" href="${collectionUrl("supplements")}">Mushrooms</a>
          <a class="link" href="${collectionUrl("health")}">Sleep</a>
        </div>
      </div>
    </div>

    <div class="toast" role="status" aria-live="polite" data-toast></div>`;
  document.body.append(...wrap.children);

  const scrim = $("[data-scrim]");
  let openEl = null, lastFocus = null;
  const close = () => {
    if (!openEl) return;
    openEl.classList.remove("is-open");
    openEl.setAttribute("aria-hidden", "true");
    $$(`[aria-controls="${openEl.id}"]`).forEach((b) => b.setAttribute("aria-expanded", "false"));
    scrim.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    openEl = null;
    lastFocus?.focus();
  };
  const open = (id) => {
    close();
    openEl = document.getElementById(id);
    lastFocus = document.activeElement;
    openEl.classList.add("is-open");
    openEl.setAttribute("aria-hidden", "false");
    $$(`[aria-controls="${id}"]`).forEach((b) => b.setAttribute("aria-expanded", "true"));
    scrim.classList.add("is-open");
    document.body.classList.add("is-locked");
    const focusable = $("input, a, button", openEl);
    setTimeout(() => (id === "search-panel" ? $("#site-search") : focusable)?.focus(), 50);
  };
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open]");
    if (opener) { e.preventDefault(); open(opener.dataset.open); return; }
    if (e.target.closest("[data-close]") || e.target === scrim) close();
    const soon = e.target.closest("[data-soon]");
    if (soon) { e.preventDefault(); toast("Customer accounts connect when the site moves to Shopify."); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  $("[data-search-form]").addEventListener("submit", (e) => {
    e.preventDefault();
    toast("Search connects to the Shopify catalogue on the live site.");
  });
}

function renderFooter() {
  const shopLinks = COLLECTIONS.map((c) => `<li><a href="${collectionUrl(c.handle)}">${esc(c.title)}</a></li>`).join("");
  const hours = STORE.hours.map(([d, h]) => `<li>${esc(d)} · ${esc(h)}</li>`).join("");
  const el = document.createElement("div");
  el.innerHTML = `
  <section class="newsletter" aria-labelledby="nl-title">
    <div class="wrap">
      <div style="display:grid;gap:12px">
        <h2 class="heading" id="nl-title">Join the Hip list</h2>
        <p class="muted" style="margin:0;max-width:40ch">New arrivals, workshops and seasonal recipes from the shop. One email, every so often.</p>
      </div>
      <form data-newsletter novalidate>
        <div class="field">
          <label class="visually-hidden" for="nl-email">Email address</label>
          <input id="nl-email" type="email" placeholder="Email address" autocomplete="email" required>
          <button type="submit">Sign up</button>
        </div>
        <p class="form-note" data-note>Unsubscribe anytime.</p>
      </form>
    </div>
  </section>
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-cols">
        <div class="footer-brand">
          <img src="assets/img/logo-light.png" alt="Holistically Hip" width="733" height="488">
          <p>High-integrity skincare, body care, home goods and natural health, curated in downtown Kingston.</p>
        </div>
        <div><h2 class="eyebrow">Shop</h2><ul>${shopLinks}</ul></div>
        <div><h2 class="eyebrow">Explore</h2><ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="journal.html">Blog & Recipes</a></li>
          <li><a href="services.html">Services & Events</a></li>
          <li><a href="visit.html">Visit the Shop</a></li>
        </ul></div>
        <div><h2 class="eyebrow">Help</h2><ul>
          <li><a href="visit.html#delivery">Shipping & Local Delivery</a></li>
          <li><a href="visit.html#returns">Returns</a></li>
          <li><a href="visit.html">Contact</a></li>
        </ul></div>
        <div><h2 class="eyebrow">Visit</h2><ul>
          <li>${esc(STORE.address[0])}</li>
          <li>${esc(STORE.address[1])}</li>
          ${hours}
          <li>${esc(STORE.phone)}</li>
          <li><a href="${STORE.instagram}" target="_blank" rel="noopener">Instagram</a></li>
        </ul></div>
      </div>
      <div class="footer-base">
        <span>© ${new Date().getFullYear()} Holistically Hip · Kingston, Ontario</span>
        <span>Prices in CAD</span>
      </div>
    </div>
  </footer>`;
  document.body.append(...el.children);

  $("[data-newsletter]").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#nl-email");
    const note = $("[data-note]");
    if (!input.value || !input.checkValidity()) {
      note.textContent = "Enter an email address like name@example.com.";
      input.focus();
      return;
    }
    note.textContent = "Thanks. In the prototype nothing is sent; on the live site this joins the Shopify mailing list.";
    input.value = "";
  });
}

let toastTimer;
function toast(msg) {
  const t = $("[data-toast]");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-on"), 3200);
}

/* ---------- product cards ---------- */
function cardMedia(p) {
  if (p.image) return `<img src="${p.image}" alt="${esc(p.brand + " " + p.name)}" loading="lazy">`;
  return `<div class="card__ph"><img src="assets/img/leaf-dark.png" alt=""><span>${esc(p.brand)}</span></div>`;
}
function priceHtml(p) {
  // Prices are intentionally blank in the prototype.
  return p.sale ? `<span class="is-sale">Sale · price from Shopify</span>` : `<span class="muted">Price from Shopify</span>`;
}
function productCard(p) {
  const badge = p.sale ? "Sale" : p.badge;
  return `
  <article class="card">
    <a class="card__media" href="${productUrl(p.handle)}" aria-label="${esc(p.brand + " " + p.name)}">
      ${cardMedia(p)}
      ${badge ? `<span class="card__badge">${esc(badge)}</span>` : ""}
    </a>
    <button class="btn btn--light card__quick" type="button" data-add="${esc(p.handle)}">Quick add</button>
    <div class="card__info">
      <span class="card__brand">${esc(p.brand)}</span>
      <a class="card__name" href="${productUrl(p.handle)}">${esc(p.name)}</a>
      <span class="card__price">${priceHtml(p)}</span>
    </div>
  </article>`;
}
function bindQuickAdd(root = document) {
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (!b) return;
    const p = PRODUCTS.find((x) => x.handle === b.dataset.add);
    toast(`${p ? p.name : "Item"}: adding to bag works once Shopify is connected.`);
  });
}

/* ---------- page-specific ---------- */
function initHome() {
  const rail = $("[data-bestsellers]");
  if (rail) rail.innerHTML = PRODUCTS.slice(0, 8).map(productCard).join("");
  const rail2 = $("[data-supplements]");
  if (rail2) rail2.innerHTML = PRODUCTS.filter((p) => p.collections.includes("supplements")).map(productCard).join("");
}

function initShop() {
  const grid = $("[data-tiles]");
  if (!grid) return;
  grid.innerHTML = COLLECTIONS.map((c, i) => {
    const count = PRODUCTS.filter((p) => p.collections.includes(c.handle)).length;
    if (c.image) {
      return `<a class="tile" href="${collectionUrl(c.handle)}">
        <img src="${c.image}" alt="" loading="lazy" style="${c.handle === "home" ? "object-position:85% 50%" : ""}">
        <span class="tile__label"><span class="heading" style="font-size:var(--fs-md)">${esc(c.title)}</span><span class="tile__count">Shop</span></span>
      </a>`;
    }
    const tone = c.handle === "sale" ? "tile--forest" : "tile--plain";
    return `<a class="tile ${tone}" href="${collectionUrl(c.handle)}">
      <span class="tile__label"><span class="heading" style="font-size:var(--fs-md)">${esc(c.title)}</span><span class="tile__count">Shop</span></span>
    </a>`;
  }).join("");
}

function initCollection() {
  const root = $("[data-collection]");
  if (!root) return;
  const render = () => {
    const handle = (location.hash || "#health").slice(1);
    const c = COLLECTIONS.find((x) => x.handle === handle) || COLLECTIONS[0];
    document.title = `${c.title} | Holistically Hip`;
    $("[data-c-title]").textContent = c.title;
    $("[data-c-crumb]").textContent = c.title;
    $("[data-c-blurb]").textContent = c.blurb;
    $("[data-c-nav]").innerHTML = COLLECTIONS.map((x) =>
      `<li><a class="chip" href="${collectionUrl(x.handle)}"${x.handle === c.handle ? ' aria-current="page"' : ""}>${esc(x.title)}</a></li>`).join("");
    $("[data-c-subs]").innerHTML = ["All", ...c.subs].map((s, i) =>
      `<li><button class="chip" type="button" aria-pressed="${i === 0}" data-sub>${esc(s)}</button></li>`).join("");
    $("[data-c-subs]").hidden = !c.subs.length;
    const items = PRODUCTS.filter((p) => p.collections.includes(c.handle));
    $("[data-c-count]").textContent = `${items.length} sample ${items.length === 1 ? "product" : "products"}`;
    $("[data-c-grid]").innerHTML = items.map(productCard).join("");
    window.scrollTo({ top: 0 });
  };
  render();
  window.addEventListener("hashchange", render);
  $("[data-c-subs]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-sub]");
    if (!b) return;
    $$("[data-sub]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    if (b.textContent !== "All") toast(`"${b.textContent}" filters by Shopify product tags on the live site.`);
  });
}

function initProduct() {
  const root = $("[data-product]");
  if (!root) return;
  const handle = location.hash.slice(1);
  const p = PRODUCTS.find((x) => x.handle === handle) || PRODUCTS[0];
  const c = COLLECTIONS.find((x) => x.handle === p.collections[0]);
  document.title = `${p.name} | Holistically Hip`;
  $("[data-p-crumb]").innerHTML = `<a href="index.html">Home</a><span>/</span><a href="${collectionUrl(c.handle)}">${esc(c.title)}</a>`;
  $("[data-p-brand]").textContent = p.brand;
  $("[data-p-name]").textContent = p.name;
  $("[data-p-variant]").textContent = p.variant;
  $("[data-p-price]").innerHTML = priceHtml(p);
  const media = p.image
    ? `<div><img src="${p.image.replace("-sm", "")}" alt="${esc(p.brand + " " + p.name)}"></div>`
    : `<div><div class="card__ph"><img src="assets/img/leaf-dark.png" alt=""><span>${esc(p.brand)}</span></div></div>`;
  const second = `<div><div class="card__ph"><img src="assets/img/leaf-dark.png" alt=""><span>Additional image</span></div></div>`;
  $("[data-p-gallery]").innerHTML = media + second;
  $("[data-p-add]").dataset.add = p.handle;
  const related = PRODUCTS.filter((x) => x.handle !== p.handle && x.collections.some((k) => p.collections.includes(k))).slice(0, 4);
  $("[data-related]").innerHTML = related.map(productCard).join("");

  const qty = $("#qty");
  root.addEventListener("click", (e) => {
    const step = e.target.closest("[data-step]");
    if (!step) return;
    qty.value = Math.max(1, (parseInt(qty.value, 10) || 1) + Number(step.dataset.step));
  });
}

/* ---------- boot ---------- */
renderAnnouncement();
renderHeader();
renderDrawers();
renderFooter();
bindQuickAdd();
({ home: initHome, shop: initShop, collection: initCollection, product: initProduct }[page] || (() => {}))();
