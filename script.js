
const bags = [
    { id: 1, name: "Hannah Montana bag", cat: "Hand Bag", price: 8500, img: "veloura.png", stock: 15 },
    { id: 2, name: "Blue Vayot", cat: "Hand Bag", price: 15800, img: "obsidian.png", stock: 8 },
    { id: 3, name: "Aurelio Leather", cat: "Shoulder Bag", price: 9200, img: "aurelio.png", stock: 12 },
    { id: 4, name: "Vanté Bags", cat: "Wallet", price: 18500, img: "vante.png", stock: 5 },
    { id: 5, name: "Valentina Wo", cat: "Hand Bag", price: 7400, img: "solenne.png", stock: 20 },
    { id: 6, name: "Marquina Bags", cat: "Shoulder Bag", price: 11200, img: "marquina.png", stock: 10 },
    { id: 7, name: "Elvaré Leather", cat: "Wallet", price: 13900, img: "elvare.png", stock: 14 },
    { id: 8, name: "Calyx & Hide", cat: "Hand Bag", price: 8800, img: "calyx.png", stock: 7 },
    { id: 9, name: "Rovelle Leather", cat: "Shoulder Bag", price: 21000, img: "rovelle.png", stock: 3 },
    { id: 10, name: "Sorelle Hide Co.", cat: "Wallet", price: 6500, img: "sorelle.png", stock: 25 },
    { id: 11, name: "Rawgrain Leather", cat: "Hand Bag", price: 5800, img: "rawgrain.png", stock: 18 },
    { id: 12, name: "EarthTan Bags", cat: "Shoulder Bag", price: 10500, img: "earthtan.png", stock: 9 },
    { id: 13, name: "Oak & Hide", cat: "Wallet", price: 14700, img: "oak.png", stock: 11 },
    { id: 14, name: "Wildgrain Leather", cat: "Hand Bag", price: 9900, img: "wildgrain.png", stock: 6 },
    { id: 15, name: "TerraHide", cat: "Shoulder Bag", price: 12800, img: "terrahide.png", stock: 13 },
    { id: 16, name: "PureTan Co.", cat: "Wallet", price: 4500, img: "puretan.png", stock: 30 },
    { id: 17, name: "Roots & Hide", cat: "Shoulder Bag", price: 16200, img: "roots.png", stock: 5 },
    { id: 18, name: "Grainfolk Leather", cat: "Shoulder Bag", price: 8200, img: "grainfolk.png", stock: 22 },
    { id: 19, name: "NatureTanned Co", cat: "Wallet", price: 22500, img: "nature.png", stock: 2 }
];

    let cart = [];
    let currentFilter = 'all';
    let isVoucherApplied = false;

    
    window.onload = function() {
        render();
        const hasClaimed = localStorage.getItem('shenvy_voucher_claimed');
        if (!hasClaimed) {
            setTimeout(() => {
                const popup = document.getElementById('voucherPopup');
                if(popup) popup.style.display = 'flex';
            }, 2000);
        }
    };

    function closeVoucher() { document.getElementById('voucherPopup').style.display = 'none'; }

    function claimVoucher() {
        localStorage.setItem('shenvy_voucher_claimed', 'true');
        isVoucherApplied = true;
        alert("Voucher Claimed! 10% discount applied.");
        closeVoucher();
    }


function render() {
    const grid = document.getElementById('grid');
    const search = document.getElementById('searchInput').value.toLowerCase();
    const sort = document.getElementById('priceSort').value;

    let filtered = currentFilter === 'all' ? [...bags] : bags.filter(b => b.cat === currentFilter);
    if (search) filtered = filtered.filter(b => b.name.toLowerCase().includes(search));

    if (sort === 'low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'high') filtered.sort((a, b) => b.price - a.price);

    grid.innerHTML = filtered.map(bag => `
        <div class="item-tile">
            <div class="img-holder">
                <img src="images/${bag.img}" onerror="this.src='https://via.placeholder.com/400x500?text=${bag.name}'">
                <div style="position:absolute; top:10px; left:10px; background:rgba(255,255,255,0.8); padding:5px; font-size:10px; font-weight:700;">STOCK: ${bag.stock}</div>
            </div>
            <h2 class="item-name">${bag.name}</h2>
            <span class="item-price">₱${bag.price.toLocaleString()}</span><br><br>
            <button class="add-btn" onclick="addToBag(${bag.id})" ${bag.stock <= 0 ? 'disabled' : ''}>
                ${bag.stock <= 0 ? 'OUT OF STOCK' : 'ADD TO BAG'}
            </button>
        </div>`).join('');
    updateUI();
}

function addToBag(id) {
    const item = bags.find(b => b.id === id);
    if(item && item.stock > 0) {
        cart.push({...item});
        item.stock--;
        updateUI();
        render();
        openPanel('bagSidebar');
    }
}

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    let total = cart.reduce((sum, i) => sum + i.price, 0);
    document.getElementById('bagTotal').innerText = `₱${total.toLocaleString()}`;
    document.getElementById('bagItems').innerHTML = cart.map(i => `
        <div class="side-item">
            <h4>${i.name}</h4>
            <p>₱${i.price.toLocaleString()}</p>
        </div>`).join('') || '<p>Empty Bag.</p>';
}


function openCheckout() {
    if (cart.length === 0) return alert("Your bag is full!");
    closePanels();
    document.getElementById('checkoutModal').style.right = "0";
    document.getElementById('overlay').style.display = "block";
    calculateTotals();
}

function closeCheckout() {
    document.getElementById('checkoutModal').style.right = "-550px";
    document.getElementById('overlay').style.display = "none";
}

function calculateTotals() {
    let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    let finalTotal = subtotal;
    
    let summaryHTML = cart.map(item => `
        <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:8px;">
            <span>${item.name}</span>
            <span>₱${item.price.toLocaleString()}</span>
        </div>`).join('');

    if (isVoucherApplied) {
        let discount = subtotal * 0.10;
        finalTotal = subtotal - discount;
        summaryHTML += `
            <div style="display:flex; justify-content:space-between; color: green; font-weight: 700; margin-top: 10px; border-top: 1px dashed #eee; padding-top: 10px;">
                <span>Voucher Discount (10%)</span>
                <span>-₱${discount.toLocaleString()}</span>
            </div>`;
    }

    document.getElementById('checkoutItemsList').innerHTML = summaryHTML;
    document.getElementById('finalTotal').innerText = `₱${finalTotal.toLocaleString()}`;
}

function applyManualVoucher() {
    const code = document.getElementById('voucherInput').value.trim();
    const status = document.getElementById('voucherStatus');
    
    if (code === "SHENVYNEW10") {
        isVoucherApplied = true;
        status.innerText = "Voucher Applied! 10% Discount active.";
        status.style.color = "green";
        calculateTotals(); // Refresh payment amount
    } else {
        status.innerText = "Invalid Voucher Code.";
        status.style.color = "red";
    }
}

function selectPay(el) {
    document.querySelectorAll('.pay-option').forEach(opt => opt.classList.remove('active'));
    el.classList.add('active');
    el.querySelector('input').checked = true;
}

function placeOrder() {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const email = document.getElementById('custEmail').value.trim();
    const address = document.getElementById('custAddr').value.trim();

    if (!name || !phone || !email || !address) {
        alert("Palihog kompletoha ang imong details (Name, Phone, Email, ug Address)!");
        return;
    }

    alert("Salamat, " + name + "! Nadawat na namo imong order.");
    cart = [];
    updateUI();
    render();
    closeCheckout();
}


function openPanel(id) { 
    document.getElementById(id).classList.add('open'); 
    document.getElementById('overlay').style.display = 'block'; 
}
function closePanels() {
    
    document.querySelectorAll('.sidebar').forEach(s => {
        s.classList.remove('open');
        
        if(s.id !== 'loginModal') s.style.right = "-100%";
    });
    document.getElementById('loginModal').classList.remove('open');
    document.getElementById('overlay').style.display = 'none';
}
function showLogin() {
    closePanels(); 
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block'; 
    document.getElementById('overlay').style.display = 'block';
}
function closeLogin() { closePanels(); }
function closeAdmin() {
    document.getElementById('adminPanel').style.right = "-100%";
    document.getElementById('adminPanel').classList.remove('open');
    document.getElementById('overlay').style.display = 'none';
}

function checkLogin() {
    const u = document.getElementById('adminUser').value.trim();
    const p = document.getElementById('adminPass').value.trim();

    if (u === "admin" && p === "1234") {
        closePanels();
        setTimeout(() => {
            const panel = document.getElementById('adminPanel');
            panel.classList.add('open');
            panel.style.right = "0";
            document.getElementById('overlay').style.display = 'block';
            showTab('inventory', document.querySelector('.tab-btn'));
        }, 400);
    } else {
        alert("Incorrect credentials.");
        console.log("Attempted User:", u);
        console.log("Attempted Pass:", p);
    }
}

function filterItems(cat, btn) {
    document.querySelectorAll('.f-link').forEach(l => l.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = cat;
    render();
}

function showAbout(type) {
    const display = document.getElementById('aboutDisplay');
    display.style.display = 'block';
    const info = {
        company: "Shenvy Authentics nagsugod sa Cebu kaniadtong 2024...",
        products: "De-kalidad ug orihinal nga mga bags...",
        owner: "Gipanag-iya ni Jecjeckoh ug Ivy."
    };
    display.innerHTML = `<p>${info[type]}</p>`;
    display.scrollIntoView({ behavior: 'smooth' });
}

function footerMsg(title, msg) {
    const fbox = document.getElementById('footerDisplay');
    document.getElementById('footerMsgTitle').innerText = title;
    document.getElementById('footerMsgText').innerText = msg;
    fbox.style.display = 'block';
    fbox.scrollIntoView({ behavior: 'smooth' });
}

let storeData = [
    { name: "Maria C.", stars: 5, msg: "Legit items! Fast delivery here in Cebu.", date: "2026-04-01" },
    { name: "Juan D.", stars: 5, msg: "Shenvy is my go-to for authentic bags. 10/10!", date: "2026-04-05" },
    { name: "Liza G.", stars: 4, msg: "Nice packaging. Safe gyud ang item.", date: "2026-04-08" }
];

let itemData = [
    { name: "Bella S.", stars: 5, msg: "The Blue Vayot is stunning! High quality leather.", date: "2026-03-25" }
];

let activeReviewTab = 'store';


function renderReviews() {
    const grid = document.getElementById('reviewsGrid');
    if(!grid) return;

    const data = activeReviewTab === 'store' ? storeData : itemData;

    grid.innerHTML = data.map(r => `
        <div class="review-card-item">
            <div style="color:#000; margin-bottom:10px;">${"⭐".repeat(r.stars)}</div>
            <div style="font-weight:700; font-size:13px; text-transform:uppercase;">${r.name}</div>
            <p style="font-size:13px; color:#555; font-style:italic; margin-top:10px;">"${r.msg}"</p>
            <small style="display:block; margin-top:15px; color:#aaa; font-size:10px;">Verified — ${r.date}</small>
        </div>
    `).join('');
}

function switchRevTab(tab, btn) {
    document.querySelectorAll('.rev-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    activeReviewTab = tab;
    renderReviews();
}


window.onload = function() {
    render(); 
    renderReviews(); 
};

let storeReviews = [
    { name: "Maria C.", rating: 5, comment: "Legit items! Fast delivery here in Cebu.", date: "2026-04-01" },
    { name: "Juan D.", rating: 5, comment: "Shenvy is my go-to for authentic bags. 10/10!", date: "2026-04-05" },
    { name: "Liza G.", rating: 4, comment: "Nice packaging. Safe gyud ang item.", date: "2026-04-08" }
];

let itemReviews = [
    { name: "Bella S.", rating: 5, comment: "The Blue Vayot is stunning! High quality leather.", date: "2026-03-25" }
];

let activeTab = 'store';


function switchReviewTab(tab, btn) {
  
    document.querySelectorAll('.rev-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
 
    activeTab = tab;
    renderReviews();
}


function renderReviews() {
    const container = document.getElementById('reviewsGrid');
    if(!container) return;

    const currentData = activeTab === 'store' ? storeReviews : itemReviews;

    container.innerHTML = currentData.map(r => `
        <div class="review-card" style="padding:25px; border:1px solid #f2f2f2; background:#fff;">
            <div style="margin-bottom:10px; color:#000;">${"⭐".repeat(r.rating)}</div>
            <div style="font-weight:700; font-size:13px; text-transform:uppercase;">${r.name}</div>
            <div style="font-size:13px; color:#555; font-style:italic; margin-top:10px;">"${r.comment}"</div>
            <span style="font-size:10px; color:#999; margin-top:15px; display:block;">Verified — ${r.date}</span>
        </div>
    `).join('');
}


function openReviewModal() {
    document.getElementById('reviewModal').style.display = 'flex';
}

function closeReviewModal() {
    document.getElementById('reviewModal').style.display = 'none';
}

function submitReview() {
    const name = document.getElementById('revName').value;
    const rating = document.getElementById('revRating').value;
    const comment = document.getElementById('revComment').value;

    if(!name || !comment) return alert("Please complete the form");

    const newRev = {
        name: name,
        rating: parseInt(rating),
        comment: comment,
        date: new Date().toISOString().split('T')[0]
    };

  
    if(activeTab === 'store') storeReviews.unshift(newRev);
    else itemReviews.unshift(newRev);

    renderReviews();
    closeReviewModal();
    alert("Thankyou for your review");
    
  
    document.getElementById('revName').value = "";
    document.getElementById('revComment').value = "";
}
function showTab(tab, btn) {
  
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const view = document.getElementById('adminView');
    
    if (tab === 'inventory') {
        view.innerHTML = `
            <h3>Product Inventory</h3>
            <table class="admin-table" style="width:100%; margin-top:20px;">
                <tr style="text-align:left; border-bottom:2px solid #eee;">
                    <th>Product Name</th><th>Stock</th><th>Action</th>
                </tr>
                ${bags.map(b => `
                    <tr>
                        <td>${b.name}</td>
                        <td>${b.stock}</td>
                        <td><button onclick="addStock(${b.id})" style="padding:5px 10px;">+ Add Stock</button></td>
                    </tr>
                `).join('')}
            </table>`;
    } 
    else if (tab === 'tracking') {
        view.innerHTML = `<h3>Order Tracking</h3><div style="padding:20px; background:#f9f9f9; margin-top:20px;">
            <p><strong>ORD-1025:</strong> Jecjeckoh - <span style="color:orange;">Processing</span></p>
            <p><strong>ORD-1026:</strong> Ivy M. - <span style="color:green;">Shipped</span></p>
        </div>`;
    } 
    else if (tab === 'sales') {
        view.innerHTML = `<h3>Sales Summary</h3>
            <div style="display:flex; gap:20px; margin-top:20px;">
                <div style="padding:20px; background:#000; color:#fff; flex:1;"><h4>Total Sales</h4><h2>₱145,200</h2></div>
                <div style="padding:20px; background:#f2f2f2; flex:1;"><h4>Orders Today</h4><h2>12</h2></div>
            </div>`;
    }
}
function addStock(id) {
    const bag = bags.find(b => b.id === id);
    if(bag) {
        bag.stock += 5;
        alert("Added 5 stocks to " + bag.name);
        showTab('inventory', document.querySelector('.tab-btn.active')); 
        render(); 
    }
}

let wishlist = []; 

function render() {
    const grid = document.getElementById('grid');
    if(!grid) return;

   

    grid.innerHTML = filteredBags.map(item => {
      
        const isWishlisted = wishlist.some(w => w.id === item.id);
        
        return `
            <div class="product-card">
                <div class="product-image-wrapper">
                    <button class="wishlist-heart ${isWishlisted ? 'active' : ''}" 
                            onclick="toggleWishlist(${item.id})">
                        ${isWishlisted ? '❤️' : '🤍'}
                    </button>
                    
                    <img src="${item.img}" alt="${item.name}">
                    <div class="stock-tag">STOCK: ${item.stock}</div>
                </div>
                <div class="product-info">
                    <h3>${item.name}</h3>
                    <p class="price">₱${item.price.toLocaleString()}</p>
                    <button class="add-btn" onclick="addToCart(${item.id})">ADD TO BAG</button>
                </div>
            </div>
        `;
    }).join('');
}


function toggleWishlist(id) {
    const item = bags.find(b => b.id === id);
    const index = wishlist.findIndex(w => w.id === id);

    if (index === -1) {
        wishlist.push(item);
      
    } else {
        wishlist.splice(index, 1);
    }

    updateWishlistUI(); 
    render(); 
}

function updateWishlistUI() {
    const count = document.getElementById('wish-count');
    if(count) count.innerText = wishlist.length;
}

window.addEventListener('load', () => {
    // Check kon naka-claim na ba ang user (para dili sige'g pakita)
    const hasClaimed = localStorage.getItem('shenvy_claimed_50');
    
    if (!hasClaimed) {
     
        setTimeout(() => {
            const popup = document.getElementById('voucherPopup');
            if (popup) {
                popup.style.display = 'flex';
            }
        }, 3000);
    }
});

function claimVoucher() {
  
    localStorage.setItem('shenvy_claimed_50', 'true');
    
   
    navigator.clipboard.writeText("SHENVY50OFF").then(() => {
        alert("Voucher Claimed! 'SHENVY50OFF' has been copied to your clipboard. Use it at checkout!");
    });
    
    closeVoucher();
}

function closeVoucher() {
    const popup = document.getElementById('voucherPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

window.addEventListener('load', () => {
    // Check kon naka-claim na ba ang user (para dili sige'g pakita)
    const hasClaimed = localStorage.getItem('shenvy_claimed_50');
    
    if (!hasClaimed) {
     
        setTimeout(() => {
            const popup = document.getElementById('voucherPopup');
            if (popup) {
                popup.style.display = 'flex';
            }
        }, 3000);
    }
});

function claimVoucher() {

    localStorage.setItem('shenvy_claimed_50', 'true');
    
  
    navigator.clipboard.writeText("SHENVY50OFF").then(() => {
        alert("Voucher Claimed! 'SHENVY50OFF' has been copied to your clipboard. Use it at checkout!");
    });
    
    closeVoucher();
}

function closeVoucher() {
    const popup = document.getElementById('voucherPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}
