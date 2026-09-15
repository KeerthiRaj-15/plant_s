const cartKey='greennestCart';
let cart=JSON.parse(localStorage.getItem(cartKey)||'[]');

const cartBtn=document.getElementById('cartBtn');
const cartPanel=document.getElementById('cartPanel');
const closeCart=document.getElementById('closeCart');
const overlay=document.getElementById('overlay');
const cartItems=document.getElementById('cartItems');
const cartCount=document.getElementById('cartCount');
const cartTotal=document.getElementById('cartTotal');
const toast=document.getElementById('toast');
const menuBtn=document.getElementById('menuBtn');
const nav=document.querySelector('.nav');

function saveCart(){localStorage.setItem(cartKey,JSON.stringify(cart))}
function openCart(){cartPanel?.classList.add('open');overlay?.classList.add('show');cartPanel?.setAttribute('aria-hidden','false');renderCart()}
function closeCartPanel(){cartPanel?.classList.remove('open');overlay?.classList.remove('show');cartPanel?.setAttribute('aria-hidden','true')}
cartBtn?.addEventListener('click',openCart);closeCart?.addEventListener('click',closeCartPanel);overlay?.addEventListener('click',closeCartPanel);

function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1700)}
function renderCart(){
  if(!cartCount)return;
  cartCount.textContent=cart.length;
  if(!cart.length){cartItems.innerHTML='<p class="empty">Your cart is empty.</p>'}
  else cartItems.innerHTML=cart.map((x,i)=>`<div class="cart-row"><span>${x.name}</span><span>$${x.price.toFixed(2)}</span><button onclick="removeItem(${i})">×</button></div>`).join('');
  cartTotal.textContent='₹'+cart.reduce((s,x)=>s+x.price,0).toFixed(2);
}
window.removeItem=i=>{cart.splice(i,1);saveCart();renderCart()};

document.querySelectorAll('.add-btn').forEach(btn=>btn.addEventListener('click',()=>{
  const card=btn.closest('.product-card'); if(!card)return;
  const item={name:card.dataset.name,price:Number(card.dataset.price)};
  cart.push(item);saveCart();renderCart();showToast(`${item.name} added to cart`);
}));

document.getElementById('checkoutBtn')?.addEventListener('click',()=>{
  showToast(cart.length?'Checkout demo — connect your payment gateway here':'Add a plant before checkout');
});

document.getElementById('menuBtn')?.addEventListener('click',()=>nav?.classList.toggle('mobile-open'));
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('mobile-open')));

document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const filter=btn.dataset.filter;let visible=0;
  document.querySelectorAll('.shop-item').forEach(card=>{
    const show=filter==='all'||card.dataset.category===filter;card.style.display=show?'':'none';if(show)visible++;
  });
  const count=document.getElementById('resultCount');if(count)count.textContent=`${visible} plants`;
}));

document.getElementById('newsletterForm')?.addEventListener('submit',e=>{e.preventDefault();showToast('Thanks for joining Green Notes 🌿');e.target.reset()});
document.getElementById('contactForm')?.addEventListener('submit',e=>{e.preventDefault();showToast('Message sent — we’ll get back to you soon.');e.target.reset()});
renderCart();

const current=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.nav a').forEach(a=>{if(a.getAttribute('href')===current)a.classList.add('active')});
