// --- 1. DATA SOURCE ---
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
let wishlist = [];
let currentFilter = 'all';
let isVoucherApplied = false;

// --- 2. INITIALIZATION ---
window.onload = function() {
    render();
    renderReviews();
    
    // Voucher Popup
    const hasClaimed = localStorage.getItem('shenvy_voucher_claimed');
    if (!hasClaimed) {
        setTimeout(() => {
            const popup = document.getElementById('voucherPopup');
            if(popup) popup.style.display = 'flex';
        }, 2000);
    }
};

// --- 3. MAIN RENDER FUNCTION ---
function render() {
    const grid = document.getElementById('grid');
    if (!grid) return;

    const searchInput = document.getElementById('searchInput');
    const search = searchInput ? searchInput.value.toLowerCase() : "";
    
    const sortSelect = document.getElementById('priceSort');
    const sort = sortSelect ? sortSelect.value : "default";

    // Filtering
    let filtered = currentFilter === 'all' ? [...bags] : bags.filter(b => b.cat === currentFilter);
    if (search) filtered = filtered.filter(b => b.name.toLowerCase().includes(search));

    // Sorting
    if (sort === 'low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'high') filtered.sort((a, b) => b.price - a.price);

    // Output HTML
    grid.innerHTML = filtered.map(item => {
        const isWishlisted = wishlist.some(w => w.id === item.id);
        return `
            <div class="item-tile">
                <div class="img-holder">
                    <button class="wishlist-heart ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${item.id})">
                        ${isWishlisted ? '❤️' : '🤍'}
                    </button>
                    <img src="images/${item.img}" onerror="this.src='https://via.placeholder.com/400x500?text=${item.name}'">
                    <div style="position:absolute; top:10px; left:10px; background:rgba(255,255,255,0.8); padding:5px; font-size:10px; font-weight:700;">STOCK: ${item.stock}</div>
                </div>
                <h2 class="item-name">${item.name}</h2>
                <span class="item-price">₱${item.price.toLocaleString()}</span><br><br>
                <button class="add-btn" onclick="addToBag(${item.id})" ${item.stock <= 0 ? 'disabled' : ''}>
                    ${item.stock <= 0 ? 'OUT OF STOCK' : 'ADD TO BAG'}
                </button>
            </div>`;
    }).join('');

    updateUI();
    updateWishlistUI();
}

// --- 4. CART & WISHLIST LOGIC ---
function addToBag(id) {
    const item = bags.find(b => b.id === id);
    if(item && item.stock > 0) {
        cart.push({...item});
        item.stock--;
        render();
        updateUI();
        openPanel('bagSidebar');
    }
}

function toggleWishlist(id) {
    const item = bags.find(b => b.id === id);
    const index = wishlist.findIndex(w => w.id === id);
    if (index === -1) wishlist.push(item);
    else wishlist.splice(index, 1);
    render();
    updateWishlistUI();
}

function updateUI() {
    const count = document.getElementById('cart-count');
    if(count) count.innerText = cart.length;

    let total = cart.reduce((sum, i) => sum + i.price, 0);
    const totalDisplay = document.getElementById('bagTotal');
    if(totalDisplay) totalDisplay.innerText = `₱${total.toLocaleString()}`;

    const bagItems = document.getElementById('bagItems');
    if(bagItems) {
        bagItems.innerHTML = cart.map(i => `
            <div class="side-item">
                <h4>${i.name}</h4>
                <p>₱${i.price.toLocaleString()}</p>
            </div>`).join('') || '<p>Empty Bag.</p>';
    }
}

function updateWishlistUI() {
    const count = document.getElementById('wish-count');
    if(count) count.innerText = wishlist.length;
}

// --- 5. PANEL CONTROLS ---
function openPanel(id) {
    const panel = document.getElementById(id);
    if(panel) {
        panel.classList.add('open');
        document.getElementById('overlay').style.display = 'block';
    }
}

function closePanels() {
    document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('open'));
    const login = document.getElementById('loginModal');
    if(login) login.style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// --- 6. ADMIN & LOGIN ---
function showLogin() {
    closePanels();
    const modal = document.getElementById('loginModal');
    if(modal) {
        modal.style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    }
}

function checkLogin() {
    const u = document.getElementById('adminUser').value.trim();
    const p = document.getElementById('adminPass').value.trim();
    if (u === "admin" && p === "admin") {
        closePanels();
        const panel = document.getElementById('adminPanel');
        panel.classList.add('open');
        panel.style.right = "0";
        document.getElementById('overlay').style.display = 'block';
        showTab('inventory', document.querySelector('.tab-btn'));
    } else {
        alert("Incorrect credentials.");
    }
}

// --- 7. REVIEWS LOGIC ---
let storeReviews = [
    { name: "Maria C.", rating: 5, comment: "Legit items! Fast delivery here in Cebu.", date: "2026-04-01" },
    { name: "Juan D.", rating: 5, comment: "Shenvy is my go-to for authentic bags.", date: "2026-04-05" }
];
let activeTab = 'store';

function renderReviews() {
    const container = document.getElementById('reviewsGrid');
    if(!container) return;
    const currentData = activeTab === 'store' ? storeReviews : [];
    container.innerHTML = currentData.map(r => `
        <div class="review-card">
            <div style="color:#000;">${"⭐".repeat(r.rating)}</div>
            <div style="font-weight:700; font-size:13px;">${r.name}</div>
            <div style="font-style:italic; font-size:13px;">"${r.comment}"</div>
        </div>`).join('');
}

function filterItems(cat, btn) {
    document.querySelectorAll('.f-link').forEach(l => l.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = cat;
    render();
}
function closeVoucher() {
    const popup = document.getElementById('voucherPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// Mao ni ang i-replace nimo sa karaan nga claimVoucher
function claimVoucher() {
    // I-save sa computer para dili na sige'g pakita ang popup
    localStorage.setItem('shenvy_claimed_50', 'true');
    
    // I-copy ang code sa clipboard
    const code = "SHENVY50OFF";
    navigator.clipboard.writeText(code).then(() => {
        alert("Voucher Claimed! '" + code + "' has been copied. Use it at checkout!");
        closeVoucher();
    }).catch(err => {
        alert("Voucher Claimed! Use code: " + code);
        closeVoucher();
    });
}
