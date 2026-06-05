
// ─── PRICE ───────────────────────────────────────────────
function fmt(n) {
return '$' + Number(n).toFixed(2);
}

// ─── CART (localStorage) ─────────────────────────────────
function getCart() {
try { return JSON.parse(localStorage.getItem('uw_cart') || '[]'); }
catch { return []; }
}

function saveCart(items) {
localStorage.setItem('uw_cart', JSON.stringify(items));
updateCartBadge();
}

function addToCart(product, size, qty) {
const cart = getCart();
const key = `${product.id}__${size}`;
const existing = cart.find(i => i.key === key);
if (existing) {
existing.qty += qty;
} else {
cart.push({
key,
productId: product.id,
name: product.name,
price: product.price,
image: product.image,
size,
qty
});
}
saveCart(cart);
showToast(`${product.name} added to cart`);
}

function removeFromCart(key) {
const cart = getCart().filter(i => i.key !== key);
saveCart(cart);
}

function getCartTotal() {
return getCart().reduce((s, i) => s + i.price * i.qty, 0);
}

function getCartCount() {
return getCart().reduce((s, i) => s + i.qty, 0);
}

// ─── NAVBAR CART BADGE ────────────────────────────────────
function updateCartBadge() {
const badge = document.getElementById('cart-badge');
if (!badge) return;
const n = getCartCount();
badge.textContent = n;
badge.classList.toggle('show', n > 0);
}

// ─── TOAST ───────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
let t = document.getElementById('toast');
if (!t) {
t = document.createElement('div');
t.id = 'toast';
document.body.appendChild(t);
}
t.textContent = msg;
t.classList.add('show');
clearTimeout(toastTimer);
toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── NAVBAR RENDER ────────────────────────────────────────
function renderNavbar(activePage) {
const pages = [
{ label:'Shop All', href:'shop.html', slug:'shop' },
{ label:'Men', href:'shop.html?cat=tees&gender=men', slug:'men' },
{ label:'Women', href:'shop.html?cat=tees&gender=women', slug:'women' },
{ label:'Accessories', href:'shop.html?cat=accessories', slug:'accessories' },
{ label:'Sale', href:'shop.html?sale=1', slug:'sale' },
];
const links = pages.map(p =>
`<li><a href="${p.href}">${p.label}</a></li>`
).join('');

const nav = document.getElementById('navbar');
if (!nav) return;
nav.innerHTML = `
<a class="nav-logo" href="index.html">UNDERWALD</a>
<ul class="nav-links">${links}</ul>
<button class="nav-cart" onclick="location.href='cart.html'" aria-label="Cart">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
</svg>
<span class="cart-badge" id="cart-badge">0</span>
</button>
`;
updateCartBadge();
}

// ─── FOOTER RENDER ────────────────────────────────────────
function renderFooter() {
const el = document.getElementById('footer');
if (!el) return;
el.innerHTML = `
<div class="container">
<div class="footer-grid">
<div class="footer-brand">
<div class="nav-logo">UNDERWALD</div>
<p>Raw aesthetics. Unapologetic design.<br>Limited drops. Underground culture.</p>
</div>
<div class="footer-col">
<h4>Shop</h4>
<ul>
<li><a href="shop.html">All Products</a></li>
<li><a href="shop.html?cat=tees">T-Shirts</a></li>
<li><a href="shop.html?cat=hoodies">Hoodies</a></li>
<li><a href="shop.html?cat=pants">Pants</a></li>
<li><a href="shop.html?cat=jackets">Jackets</a></li>
<li><a href="shop.html?sale=1">Sale</a></li>
</ul>
</div>
<div class="footer-col">
<h4>Company</h4>
<ul>
<li><a href="about.html">About</a></li>
<li><a href="contact.html">Contact</a></li>
</ul>
</div>
<div class="footer-col">
<h4>Support</h4>
<ul>
<li><a href="contact.html">Customer Service</a></li>
<li><a href="#">Shipping & Returns</a></li>
<li><a href="#">Size Guide</a></li>
<li><a href="#">FAQ</a></li>
</ul>
</div>
</div>
<div class="footer-bottom">
<p>&copy; 2026 UNDERWALD. All rights reserved.</p>
<p>Privacy Policy &nbsp;|&nbsp; Terms of Service</p>
</div>
</div>
`;
}

// ─── PRODUCT CARD HTML ────────────────────────────────────
function productCardHTML(p) {
const badgeHTML = p.badge
? `<span class="product-badge ${p.badge.toLowerCase()}">${p.badge}</span>`
: (!p.inStock ? `<span class="product-badge out">Sold Out</span>` : '');
const priceHTML = p.badge === 'SALE'
? `<span class="price-current sale">${fmt(p.price)}</span><span class="price-original">${fmt(p.original)}</span>`
: `<span class="price-current">${fmt(p.price)}</span>`;
return `
<div class="product-card" onclick="location.href='product.html?id=${p.id}'">
<div class="product-img-wrap">
<img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy">
${badgeHTML}
</div>
<div class="product-info">
<div class="product-name">${p.name}</div>
<div class="product-price">${priceHTML}</div>
</div>
</div>`;
}