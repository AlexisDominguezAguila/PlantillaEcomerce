    /* =====================================================================
    TEC RIVERA – Catálogo público completo (BD + carrito + wishlist + checkout)
    ===================================================================== */
    const API_URL = "../controllers/ProductosController.php";
    const IMAGE_BASE = "../uploads/productos/";
    const CURRENCY = "S/";
    const WHATSAPP_NUMBER = "51985468074";
    const YAPE_PHONE = "985468074";
    const PLIN_PHONE = "985468074";
    const YAPE_QR = "../assets/images/yape.jpg";
    const PLIN_QR = "../assets/images/plin.jpg";
    const BANK_ACCOUNTS = [
    { bank: "BCP", holder: "TEC RIVERA", account: "53504461818006", cci: "00253510446181800638" },
    { bank: "INTERBANK", holder: "TEC RIVERA", account: "8983369307748", cci: "00389801336930774848" }
    ];

    // ---------------------- Estado global ----------------------
    let products = [], categories = [];
    let cart = [], wishlist = [];
    let currentSlide = 0, sliderTimer = null;
    let checkoutStep = 1, selectedPaymentMethod = null;

    // ---------------------- Utilidades ----------------------
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);
    const fmtMoney = (n) => `${CURRENCY}${Number(n).toFixed(2)}`;
    const escapeHtml = (t) => (t || "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

    // ---------------------- API ----------------------
    async function fetchCategorias() {
    const res = await fetch(`${API_URL}?action=categorias`);
    return await res.json();
    }
    async function fetchProductos(categoryId = null) {
    const q = categoryId && categoryId !== "all" ? `&category_id=${categoryId}` : "";
    const res = await fetch(`${API_URL}?action=listar${q}`);
    const data = await res.json();
    return data.map(p => {
        const first = p.first_image ? IMAGE_BASE + p.first_image.trim() : IMAGE_BASE + "no-image.png";
        const imgs = p.images
        ? p.images.split(",").map(s => IMAGE_BASE + s.trim()).filter(Boolean)
        : [first];
        return {
        id: Number(p.id),
        name: p.name,
        price: Number(p.price),
        description: p.description,
        category_id: Number(p.category_id),
        category: p.category_name,
        image: first,
        images: imgs
        };
    });
    }

    // ---------------------- Notificaciones ----------------------
    function showNotification(msg) {
    const n = document.createElement("div");
    n.textContent = msg;
    n.style.cssText = `
        position:fixed;bottom:20px;right:20px;background:#111344;color:#fff;
        padding:1rem 1.25rem;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,.25);
        z-index:10000;font-weight:600;animation:slideIn .25s ease`;
    document.body.appendChild(n);
    setTimeout(() => { n.style.animation="slideOut .25s ease"; setTimeout(()=>n.remove(),250); },2500);
    }

    // ---------------------- LocalStorage ----------------------
    function saveLocal() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    function loadLocal() {
    try {
        cart = JSON.parse(localStorage.getItem("cart") || "[]") || [];
        wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]") || [];
    } catch { cart=[]; wishlist=[]; }
    updateCartCount(); updateWishlistCount();
    }

    // ---------------------- Categorías ----------------------
    function setupSliderNavigation() {
    const slider = $("#categorySlider");
    const leftBtn = document.querySelector(".left-btn");
    const rightBtn = document.querySelector(".right-btn");
    if (!slider || !leftBtn || !rightBtn) return;
    const step = 220;
    rightBtn.onclick = () => {
        const max = slider.scrollWidth - slider.clientWidth;
        slider.scrollTo({ left: Math.min(slider.scrollLeft + step, max), behavior: "smooth" });
    };
    leftBtn.onclick = () => {
        slider.scrollTo({ left: Math.max(slider.scrollLeft - step, 0), behavior: "smooth" });
    };
    }

    function renderCategorias() {
    const slider = $("#categorySlider");
    const select = $("#categoryFilter");
    if (!slider || !select) return;

    slider.innerHTML = "";
    select.innerHTML = ""; // limpiar completamente

    //siempre incluye la opción general
    const optAll = document.createElement("option");
    optAll.value = "all";
    optAll.textContent = "Todas las categorías";
    select.appendChild(optAll);

    categories.forEach(c => {
        const card = document.createElement("div");
        card.className = "category-card";
        card.innerHTML = `<i class="bx bx-folder"></i><h3>${c.name}</h3>`;
        card.onclick = async () => {
        await loadProductos(c.id);
        select.value = c.id;
        renderProductos(c.id);
        initHero();
        };
        slider.appendChild(card);

        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        select.appendChild(opt);
    });

    select.onchange = async (e) => {
        const val = e.target.value;
        await loadProductos(val);
        renderProductos(val);
        initHero();
    };
    }


    // ---------------------- Slider Hero ----------------------
    function initHero() {
    const track = $("#sliderTrack"), dots = $("#sliderDots");
    if (!track || !dots) return;
    track.innerHTML = dots.innerHTML = "";
    const featured = products.slice(0,5);
    featured.forEach((p,i)=>{
        const slide=document.createElement("div");
        slide.className="slide";
        slide.innerHTML=`
        <div class="slide-inner">
            <div class="slide-content">
            <h2>${p.name}</h2>
            <p>${p.description}</p>
            <div class="price">${fmtMoney(p.price)}</div>
            </div>
            <div class="slide-image"><img src="${p.image}" alt="${p.name}"></div>
        </div>`;
        track.appendChild(slide);
        const dot=document.createElement("div");
        dot.className=`dot ${i===0?"active":""}`;
        dot.onclick=()=>goToSlide(i);
        dots.appendChild(dot);
    });
    $("#prevBtn").onclick=prevSlide;
    $("#nextBtn").onclick=nextSlide;
    if(sliderTimer)clearInterval(sliderTimer);
    sliderTimer=setInterval(nextSlide,5000);
    }
    function goToSlide(i){
    const track=$("#sliderTrack"), dots=$$(".dot");
    if(!track)return;
    currentSlide=i; track.style.transform=`translateX(-${i*100}%)`;
    dots.forEach((d,idx)=>d.classList.toggle("active",idx===i));
    }
    function nextSlide(){ currentSlide=(currentSlide+1)%$$(".dot").length; goToSlide(currentSlide);}
    function prevSlide(){ currentSlide=(currentSlide-1+$$(".dot").length)%$$(".dot").length; goToSlide(currentSlide);}

    // ---------------------- Render de productos ----------------------
    function renderProductos(filter="all"){
    const grid=$("#productGrid"); grid.innerHTML="";
    const list=filter==="all"?products:products.filter(p=>p.category_id==filter||p.category===filter);
    list.forEach(p=>{
        const first=p.image, second=p.images?.[1]||first;
        const isWish=wishlist.some(w=>w.id===p.id);
        const card=document.createElement("div");
        card.className="product-card";
        card.innerHTML=`
        <div class="product-image" data-action="open" data-id="${p.id}">
            <img src="${first}" class="product-main-img"/>
            <img src="${second}" class="product-hover-img"/>
            <div class="product-actions">
            <button class="btn-icon wishlist-btn ${isWish?"active":""}" data-action="wish" data-id="${p.id}"><i class="bx bx-heart"></i></button>
            <button class="btn-icon cart-btn" data-action="cart" data-id="${p.id}"><i class="bx bx-cart"></i></button>
            </div>
        </div>
        <div class="product-info">
            <div class="product-category">${p.category}</div>
            <h3 data-action="open" data-id="${p.id}">${p.name}</h3>
            <p>${p.description}</p>
            <div class="product-footer">
            <div class="product-price">${fmtMoney(p.price)}</div>
            <button class="btn-view-detail" data-action="open" data-id="${p.id}"><i class="bx bx-show-alt"></i></button>
            </div>
        </div>`;
        card.onclick=e=>{
        const t=e.target.closest("[data-action]");
        if(!t)return;
        const id=Number(t.dataset.id), prod=products.find(x=>x.id===id);
        if(t.dataset.action==="open")showProductDetail(prod);
        if(t.dataset.action==="wish")toggleWishlist(prod);
        if(t.dataset.action==="cart")addToCart(prod);
        };
        grid.appendChild(card);
    });
    }

    // ---------------------- Wishlist ----------------------
    function toggleWishlist(p){
    const i=wishlist.findIndex(w=>w.id===p.id);
    if(i>-1){wishlist.splice(i,1);showNotification(`${p.name} eliminado`);}
    else {wishlist.push(p);showNotification(`${p.name} añadido`);}
    updateWishlistCount();saveLocal();renderProductos();
    }
    function renderWishlist(){
    const wrap=$("#wishlistItems");
    if(!wishlist.length){wrap.innerHTML='<div class="empty-message">Lista vacía</div>';return;}
    wrap.innerHTML=wishlist.map(i=>`
        <div class="wishlist-item">
        <img src="${i.image}" class="wishlist-item-image"/>
        <div class="wishlist-item-info"><div>${i.name}</div><div>${fmtMoney(i.price)}</div></div>
        <div class="cart-item-actions">
            <button data-action="wish-add" data-id="${i.id}">Agregar</button>
            <button data-action="wish-del" data-id="${i.id}">Eliminar</button>
        </div>
        </div>`).join("");
    wrap.onclick=e=>{
        const t=e.target; const id=Number(t.dataset.id);
        const p=products.find(x=>x.id===id);
        if(t.dataset.action==="wish-add")addToCart(p);
        if(t.dataset.action==="wish-del")removeFromWishlist(id);
    };
    }
    function removeFromWishlist(id){wishlist=wishlist.filter(w=>w.id!==id);saveLocal();updateWishlistCount();renderWishlist();}
    function updateWishlistCount(){ $("#wishlistCount").textContent=wishlist.length; }

    // ---------------------- Carrito ----------------------
    function addToCart(p){
    const f=cart.find(i=>i.id===p.id);
    if(f)f.quantity++; else cart.push({...p,quantity:1});
    updateCartCount();saveLocal();showNotification(`${p.name} agregado`);
    }
    function renderCart(){
    const wrap=$("#cartItems"), totalEl=$("#cartTotal");
    if(!cart.length){wrap.innerHTML='<div class="empty-message">Carrito vacío</div>';totalEl.textContent="0";return;}
    wrap.innerHTML=cart.map(i=>`
        <div class="cart-item">
        <img src="${i.image}" class="cart-item-image">
        <div class="cart-item-info"><div>${i.name}</div><div>${fmtMoney(i.price)}</div></div>
        <div class="cart-item-actions">
            <button data-action="dec" data-id="${i.id}">-</button>
            <span>${i.quantity}</span>
            <button data-action="inc" data-id="${i.id}">+</button>
            <button data-action="del" data-id="${i.id}">x</button>
        </div>
        </div>`).join("");
    totalEl.textContent=cart.reduce((s,i)=>s+i.price*i.quantity,0).toFixed(2);
    wrap.onclick=e=>{
        const t=e.target; const id=Number(t.dataset.id);
        const a=t.dataset.action; if(!a)return;
        if(a==="dec")updateQty(id,-1);
        if(a==="inc")updateQty(id,1);
        if(a==="del")removeFromCart(id);
    };
    }
    function updateQty(id,chg){const it=cart.find(i=>i.id===id);if(!it)return;it.quantity+=chg;if(it.quantity<=0)removeFromCart(id);saveLocal();renderCart();updateCartCount();}
    function removeFromCart(id){cart=cart.filter(i=>i.id!==id);saveLocal();renderCart();updateCartCount();}
    function updateCartCount(){ $("#cartCount").textContent=cart.reduce((s,i)=>s+i.quantity,0); }

    // ---------------------- Detalle + relacionados ----------------------
    function showProductDetail(p){
    $("#productsSection").classList.add("hidden");
    $("#productDetailSection").classList.remove("hidden");
    $("#breadcrumb-name").textContent=p.name;
    $("#name").textContent=p.name;
    $("#brand").textContent=p.category;
    $("#sku").textContent="SKU: "+p.id;
    $("#prices").innerHTML=`<span class="text-3xl font-bold">${fmtMoney(p.price)}</span>`;
    $("#shipping").innerHTML=`<div class="flex items-center gap-3 mb-2">
        <i data-lucide="truck" class="w-5 h-5 text-blue-600"></i>
        <div><div class="font-semibold text-gray-900">Envío disponible en todo el país</div>
        <div class="text-sm text-gray-600">Tiempo estimado: 2-3 días hábiles</div></div></div>`;
    $("#stock").textContent="Disponible en stock";

    // --- Botón de favoritos en detalle ---
    const favIcon = $("#fav-btn i");
    if (favIcon) {
    const isFav = wishlist.some(w => w.id === p.id);
    favIcon.classList.toggle("text-red-500", isFav);
    favIcon.classList.toggle("bx-heart", !isFav);
    favIcon.classList.toggle("bxs-heart", isFav);

    $("#fav-btn").onclick = () => {
        toggleWishlist(p);
        favIcon.classList.toggle("text-red-500");
        favIcon.classList.toggle("bx-heart");
        favIcon.classList.toggle("bxs-heart");
    };
    }

    // --- Contador de cantidad ---
    let cantidad = 1;
    const inputCantidad = $("#quantity");
    if (inputCantidad) inputCantidad.value = cantidad;

    $("#increment")?.addEventListener("click", () => {
    cantidad++;
    if (inputCantidad) inputCantidad.value = cantidad;
    });

    $("#decrement")?.addEventListener("click", () => {
    if (cantidad > 1) cantidad--;
    if (inputCantidad) inputCantidad.value = cantidad;
    });


    const main=$("#main-img"), thumbs=$("#thumbs");
    thumbs.innerHTML="";
    const imgs=p.images?.length?p.images:[p.image];
    let idx=0; main.src=imgs[idx];
    $("#prev-img").onclick=()=>{idx=(idx-1+imgs.length)%imgs.length;main.src=imgs[idx];};
    $("#next-img").onclick=()=>{idx=(idx+1)%imgs.length;main.src=imgs[idx];};
    imgs.forEach((src,i)=>{
        const b=document.createElement("button");
        b.className=`w-20 h-20 rounded-lg overflow-hidden border-2 ${i===0?"border-blue-500 shadow-md":"border-gray-200"}`;
        b.innerHTML=`<img src="${src}" class="w-full h-full object-cover"/>`;
        b.onclick=()=>{idx=i;main.src=src;
        $$("#thumbs button").forEach(bb=>bb.className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200");
        b.className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-500 shadow-md";
        };
        thumbs.appendChild(b);
    });

    $$(".btn-add-cart").forEach(btn =>
    btn.onclick = () => {
        for (let i = 0; i < cantidad; i++) addToCart(p);
    }
    );

    $("#checkoutBtnDetail")?.addEventListener("click",()=>{addToCart(p);openCheckout();});

    $("#specs").innerHTML=`<h2 class="text-2xl font-bold mb-6">Acerca del producto</h2>
        <p class="text-gray-600">${p.description||""}</p>`;

    const related=$("#related");
    const relatedList=products.filter(x=>x.category_id===p.category_id&&x.id!==p.id).slice(0,4);
    related.innerHTML=relatedList.length?`
        <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Podrían interesarte</h2>
        <button id="backToCatalogBtn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg">← Volver al catálogo</button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${relatedList.map(r=>`
            <div class="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition cursor-pointer group" data-id="${r.id}">
            <div class="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                <img src="${r.image}" class="w-full h-full object-contain group-hover:scale-105 transition-transform"/>
            </div>
            <h3 class="font-medium text-sm mb-2 text-gray-900">${r.name}</h3>
            <div class="font-bold text-lg text-blue-600">${fmtMoney(r.price)}</div>
            </div>`).join("")}
        </div>`:`<p class="text-gray-500">No hay productos relacionados en esta categoría.</p>`;

    related.querySelectorAll("[data-id]").forEach(card=>{
        card.onclick=()=>{const id=Number(card.dataset.id);const prod=products.find(x=>x.id===id);if(prod)showProductDetail(prod);};
    });
    $("#backToCatalogBtn")?.addEventListener("click",()=>{$("#productDetailSection").classList.add("hidden");$("#productsSection").classList.remove("hidden");});
    if(typeof lucide!=="undefined")lucide.createIcons();
    }

    // ---------------------- Checkout ----------------------
    function openCheckout(){
    if(!cart.length){showNotification("Carrito vacío");return;}
    checkoutStep=1;selectedPaymentMethod=null;
    updateStepUI();renderCheckoutSummary();
    closeModal("cartModal");openModal("checkoutModal");
    }
    function renderCheckoutSummary(){
    const w=$("#checkoutSummary");
    const total=cart.reduce((s,i)=>s+i.price*i.quantity,0);
    w.innerHTML=cart.map(i=>`<div class="co-item"><div>${i.name} x${i.quantity}</div><div>${fmtMoney(i.price*i.quantity)}</div></div>`).join("")+
        `<div class="co-total"><span>Total</span><strong>${fmtMoney(total)}</strong></div>`;
    }
    function readSelectedMethod(){
    const f=$("#paymentMethodForm");if(!f)return null;
        const fd=new FormData(f);return fd.get("paymentMethod");
    }
    function renderPaymentMethodView() {
    const v = $("#paymentMethodView");
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const totalText = fmtMoney(total);

    const setStepTitle = (t) => {
        const el = $("#step3Title");
        if (el) el.textContent = t;
    }

    if(selectedPaymentMethod==="card"){
        setStepTitle("Pagar con tarjeta");
        v.innerHTML=`<form id="cardForm" class="form-grid" onsubmit="event.preventDefault();">
        <div class="form-field"><label>Nombre del titular</label><input type="text" required /></div>
        <div class="form-field"><label>Número de tarjeta</label><input type="text" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000" required /></div>
        <div class="form-row"><div class="form-field"><label>Vencimiento</label><input type="text" inputmode="numeric" maxlength="5" placeholder="MM/AA" required /></div>
        <div class="form-field"><label>CVV</label><input type="password" inputmode="numeric" maxlength="4" placeholder="***" required /></div></div>
        <button class="btn-primary full" id="payCardBtn">Pagar ${totalText}</button></form>`;
        $("#payCardBtn").onclick=()=>confirmPayment("Tarjeta",total);
    }
    else if(selectedPaymentMethod==="wallet"){
        setStepTitle("Pagar con billetera (Yape / Plin)");
        v.innerHTML=`<div class="wallet-chooser"><label><input type="radio" name="walletType" value="yape" checked/> Yape</label>
        <label><input type="radio" name="walletType" value="plin"/> Plin</label></div>
        <div class="wallet-box"><div class="wallet-info"><div>Monto: <strong>${totalText}</strong></div>
        <div id="walletNumber"></div><div class="hint">* Escanea el QR o envía al número y luego confirma.</div></div>
        <div class="wallet-qr" id="walletQr"></div></div>
        <button class="btn-primary full" id="walletConfirm">Ya realicé el pago</button>`;
        const renderWallet=()=>{const type=(document.querySelector('input[name="walletType"]:checked')||{}).value||"yape";
        const phone=type==="yape"?YAPE_PHONE:PLIN_PHONE;const qr=type==="yape"?YAPE_QR:PLIN_QR;
        $("#walletNumber").innerHTML=`Número ${type.toUpperCase()}: <strong>${phone}</strong>`;
        $("#walletQr").innerHTML=`<img src="${qr}" alt="QR ${type}" class="wallet-qr-img"/>`;};
        renderWallet();
        $$('input[name="walletType"]').forEach(r=>r.addEventListener("change",renderWallet));
        $("#walletConfirm").onclick=()=>confirmPayment("Billetera (Yape/Plin)",total);
    }
    else if(selectedPaymentMethod==="transfer"){
        setStepTitle("Pagar por transferencia bancaria");
        v.innerHTML=BANK_ACCOUNTS.map(b=>`<div class="bank-card"><div class="bank-title">${b.bank}</div>
        <div>Titular: <strong>${b.holder}</strong></div><div>Cuenta: <strong>${b.account}</strong></div>
        <div>CCI: <strong>${b.cci}</strong></div></div>`).join("")+`<button id="transferBtn" class="btn-primary w-full mt-4">He transferido</button>`;
        $("#transferBtn").onclick=()=>confirmPayment("Transferencia",total);
    }
    else if(selectedPaymentMethod==="whatsapp"){
        setStepTitle("Coordinar por WhatsApp (pago en efectivo)");
        const msg=`Hola, quiero coordinar pago en efectivo. Total: ${totalText}. Pedido: ${cart.map(i=>`${i.name} x${i.quantity}`).join(", ")}`;
        v.innerHTML=`<div class="wa-wrap"><a class="btn-primary full" target="_blank" rel="noopener" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}">Abrir WhatsApp</a>
        <button class="btn-secondary full" id="waConfirm">Ya coordiné por WhatsApp</button></div>`;
        $("#waConfirm").onclick=()=>confirmPayment("WhatsApp (efectivo)",total);
    }
    }
    function confirmPayment(method,total){
    $("#receiptBox").innerHTML=`<div>Método: ${method}</div><div>Total: ${fmtMoney(total)}</div>`;
    cart=[];saveLocal();updateCartCount();renderCart();
    checkoutStep=4;updateStepUI();
    }
    function nextStep(){
    if(checkoutStep===1){checkoutStep=2;}
    else if(checkoutStep===2){
        const m=readSelectedMethod();
        if(!m){showNotification("Selecciona método de pago");return;}
        selectedPaymentMethod=m;checkoutStep=3;renderPaymentMethodView();
    }else if(checkoutStep===4){closeModal("checkoutModal");}
    updateStepUI();
    }
    function prevStep(){if(checkoutStep<=1){closeModal("checkoutModal");return;}checkoutStep--;updateStepUI();}

    // ---------------------- Modales ----------------------
    function openModal(id){const m=$("#"+id);if(!m)return;m.classList.add("active");document.body.classList.add("modal-open");}
    function closeModal(id){const m=$("#"+id);if(!m)return;m.classList.remove("active");
    if(!document.querySelector(".modal.active"))document.body.classList.remove("modal-open");}

    // ---------------------- Inicialización ----------------------
    async function loadProductos(cat="all"){products=await fetchProductos(cat);}
    async function init(){
    loadLocal();
    categories=await fetchCategorias();
    products=await fetchProductos();
    renderCategorias();
    renderProductos();
    initHero();
    setupSliderNavigation();
    setupEventListeners();
    }
    function setupEventListeners(){
    $("#cartBtn")?.addEventListener("click",()=>{renderCart();openModal("cartModal");});
    $("#wishlistBtn")?.addEventListener("click",()=>{renderWishlist();openModal("wishlistModal");});
    $("#checkoutBtnCart")?.addEventListener("click",openCheckout);
    $("#checkoutBtnDetail")?.addEventListener("click",()=>{const name=$("#name")?.textContent||"";const prod=products.find(p=>p.name===name);if(prod)addToCart(prod);openCheckout();});
    $("#nextStepBtn")?.addEventListener("click",nextStep);
    $("#prevStepBtn")?.addEventListener("click",prevStep);
    $("#checkoutClose")?.addEventListener("click",()=>closeModal("checkoutModal"));
    $("#cartModalClose")?.addEventListener("click",()=>closeModal("cartModal"));
    $("#wishlistModalClose")?.addEventListener("click",()=>closeModal("wishlistModal"));
    $$(".modal").forEach(m=>{
        m.addEventListener("click",e=>{
        if(e.target===m){m.classList.remove("active");
            if(!document.querySelector(".modal.active"))document.body.classList.remove("modal-open");
        }
        });
    });
    document.addEventListener("click",(e)=>{
        if(e.target?.id==="backToProducts"){
        e.preventDefault();
        $("#productDetailSection").classList.add("hidden");
        $("#productsSection").classList.remove("hidden");
        }
    });
    }

    (() => {
    const style=document.createElement("style");
    style.textContent=`@keyframes slideIn{from{transform:translateX(400px);opacity:0;}to{transform:translateX(0);opacity:1;}}
    @keyframes slideOut{from{transform:translateX(0);opacity:1;}to{transform:translateX(400px);opacity:0;}}`;
    document.head.appendChild(style);
    })();

document.addEventListener("DOMContentLoaded",init);
