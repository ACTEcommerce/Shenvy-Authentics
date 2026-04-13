// 1. PRODUCT DATA
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

    // --- INITIAL LOAD & POPUP ---
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

// --- STORE LOGIC ---
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

// --- CHECKOUT LOGIC ---
function openCheckout() {
    if (cart.length === 0) return alert("Puno sa imong bag, bai!");
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

// --- SYSTEM HELPERS ---
function openPanel(id) { 
    document.getElementById(id).classList.add('open'); 
    document.getElementById('overlay').style.display = 'block'; 
}
function closePanels() {
    // Sirhan tanang modal/sidebar
    document.querySelectorAll('.sidebar').forEach(s => {
        s.classList.remove('open');
        // Para sa mga sidebars nga naay inline style:
        if(s.id !== 'loginModal') s.style.right = "-100%";
    });
    document.getElementById('loginModal').classList.remove('open');
    document.getElementById('overlay').style.display = 'none';
}
function showLogin() {
    closePanels(); // Siguroha nga sirado ang uban
    const login = document.getElementById('loginModal');
    login.classList.add('open');
    document.getElementById('overlay').style.display = 'block';
}
function closeLogin() { closePanels(); }
function closeAdmin() {
    document.getElementById('adminPanel').style.right = "-100%";
    document.getElementById('adminPanel').classList.remove('open');
    document.getElementById('overlay').style.display = 'none';
}

function checkLogin() {
    const u = document.getElementById('adminUser').value;
    const p = document.getElementById('adminPass').value;

    if (u === "admin" && p === "1234") {
        closePanels(); // Sirhan ang login
        
        setTimeout(() => {
            const panel = document.getElementById('adminPanel'); // Siguroha nga match ang ID sa HTML
            if(panel) {
                panel.classList.add('open');
                panel.style.right = "0"; // Force slide
                document.getElementById('overlay').style.display = 'block';
                
                // I-load dayon ang inventory
                showTab('inventory', document.querySelector('.nav-block'));
            } else {
                console.error("Dili makit-an ang adminPanel nga ID, bai!");
            }
        }, 400);
    } else {
        alert("Sayop ang credentials, bai!");
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
// Reviews Data
let storeData = [
    { name: "Maria C.", stars: 5, msg: "Legit items! Fast delivery here in Cebu.", date: "2026-04-01" },
    { name: "Juan D.", stars: 5, msg: "Shenvy is my go-to for authentic bags. 10/10!", date: "2026-04-05" },
    { name: "Liza G.", stars: 4, msg: "Nice packaging. Safe gyud ang item.", date: "2026-04-08" }
];

let itemData = [
    { name: "Bella S.", stars: 5, msg: "The Blue Vayot is stunning! High quality leather.", date: "2026-03-25" }
];

let activeReviewTab = 'store';

// Patawagon ni inig load sa website
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

// SIGUROHA NGA NAA NI SA 
window.onload = function() {
    render(); // imong products grid
    renderReviews(); // i-load ang reviews
};
// 1. DATA (Dapat naa ni sa gawas)
let storeReviews = [
    { name: "Maria C.", rating: 5, comment: "Legit items! Fast delivery here in Cebu.", date: "2026-04-01" },
    { name: "Juan D.", rating: 5, comment: "Shenvy is my go-to for authentic bags. 10/10!", date: "2026-04-05" },
    { name: "Liza G.", rating: 4, comment: "Nice packaging. Safe gyud ang item.", date: "2026-04-08" }
];

let itemReviews = [
    { name: "Bella S.", rating: 5, comment: "The Blue Vayot is stunning! High quality leather.", date: "2026-03-25" }
];

let activeTab = 'store';

// 2. SWITCH TAB FUNCTION
function switchReviewTab(tab, btn) {
    // UI Change sa buttons
    document.querySelectorAll('.rev-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Logic change
    activeTab = tab;
    renderReviews();
}

// 3. RENDER FUNCTION
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

// 4. MODAL & SUBMISSION
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

    if(!name || !comment) return alert("Palihog kompletoha ang porma, bai!");

    const newRev = {
        name: name,
        rating: parseInt(rating),
        comment: comment,
        date: new Date().toISOString().split('T')[0]
    };

    // I-add sa saktong array depende sa active tab
    if(activeTab === 'store') storeReviews.unshift(newRev);
    else itemReviews.unshift(newRev);

    renderReviews();
    closeReviewModal();
    alert("Salamat sa imong review, bai!");
    
    // Reset form
    document.getElementById('revName').value = "";
    document.getElementById('revComment').value = "";
}
function strictAddStock(id) {
    const bag = bags.find(b => b.id === id);
    if (!bag) return;

    // Stricto nga check
    const pass = prompt(`ADMIN AUTHENTICATION: Pila ka stock imong i-add sa ${bag.name}?`);
    
    if (pass === null || pass === "") return; // Gi-cancel

    const amount = parseInt(pass);

    if (isNaN(amount) || amount <= 0) {
        alert("Sayop nga input, bai! Kinahanglan numero ug dako sa zero.");
    } else {
        // Confirmation password (optional, pwede nimo tangtangon)
        const confirmPass = prompt("Enter Admin Password to confirm:");
        if (confirmPass === "1234") {
            bag.stock += amount;
            alert(`SUCCESS: Added ${amount} units to ${bag.name}. Bag-ong stock: ${bag.stock}`);
            
            // I-refresh ang inventory view para makita ang update
            const activeBtn = document.querySelector('.nav-block.active');
            showTab('inventory', activeBtn);
            
            // I-refresh sab ang main store grid
            render(); 
        } else {
            alert("WRONG PASSWORD. Action Denied.");
        }
    }
}
function showTab(tab, btn) {
    // 1. Highlight sa button
    document.querySelectorAll('.nav-block').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');

    const view = document.getElementById('adminView');
    if(!view) return;

    view.innerHTML = ""; // Limpyohan ang view

    if (tab === 'sales') {
        view.innerHTML = `
            <div class="admin-summary-grid">
                <div class="summary-box"><p>TOTAL SYSTEM ORDERS</p><h2>15,842</h2></div>
                <div class="summary-box"><p>TOTAL SYSTEM SALES</p><h2>₱4,850,000</h2></div>
            </div>
            <div class="chart-card"><canvas id="yearlyChart"></canvas></div>
            <div class="chart-card" style="margin-top:20px;"><canvas id="monthlyChart"></canvas></div>
        `;
        if (typeof renderSalesCharts === "function") renderSalesCharts();
    } 
    
    else if (tab === 'inventory') {
        const criticalItems = bags.filter(b => b.stock < 10);
        
        view.innerHTML = `
            <h3 style="margin-bottom:20px;">PRODUCT INVENTORY</h3>
            ${criticalItems.length > 0 ? `<div style="background:#fff0f0; border-left:5px solid red; padding:15px; margin-bottom:20px; color:red;"><strong>⚠️ ALERT:</strong> ${criticalItems.length} items hapit na mahurot!</div>` : ''}
            <table class="admin-table">
                <thead>
                    <tr style="background:#000; color:#fff;">
                        <th>ITEM</th><th>STOCK</th><th>STATUS</th><th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    ${bags.map(b => `
                        <tr>
                            <td>${b.name}</td>
                            <td style="color:${b.stock < 10 ? 'red' : 'black'}; font-weight:700;">${b.stock}</td>
                            <td>${b.stock < 10 ? 'CRITICAL' : 'OK'}</td>
                            <td><button onclick="strictAddStock(${b.id})" class="add-stock-btn">+ ADD</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    else if (tab === 'tracking') {
        view.innerHTML = `
            <div style="margin-bottom:20px;">
                <h3 style="font-weight:800;">ORDER TRACKING</h3>
                <p style="font-size: 12px; color: #666;">Monitor and update customer delivery status.</p>
            </div>
            
            <table class="admin-table">
                <thead>
                    <tr style="background:#000; color:#fff;">
                        <th>ORDER ID</th>
                        <th>CUSTOMER</th>
                        <th>LOCATION</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#ORD-9928</td>
                        <td style="font-weight:700;">Jullian Tampus</td>
                        <td>Cebu City</td>
                        <td><span style="background: #fff3cd; color: #856404; padding: 4px 8px; font-size: 10px; font-weight:700;">PREPARING</span></td>
                        <td><button class="add-stock-btn" style="background:#000;" onclick="alert('Updating Status...')">UPDATE</button></td>
                    </tr>
                    <tr>
                        <td>#ORD-9927</td>
                        <td style="font-weight:700;">Ivy Marie</td>
                        <td>Mandaue City</td>
                        <td><span style="background: #d4edda; color: #155724; padding: 4px 8px; font-size: 10px; font-weight:700;">SHIPPED</span></td>
                        <td><button class="add-stock-btn" style="background:#000;" onclick="alert('Updating Status...')">UPDATE</button></td>
                    </tr>
                    <tr>
                        <td>#ORD-9926</td>
                        <td style="font-weight:700;">Maria Clara</td>
                        <td>Lapu-Lapu City</td>
                        <td><span style="background: #f8d7da; color: #721c24; padding: 4px 8px; font-size: 10px; font-weight:700;">PENDING</span></td>
                        <td><button class="add-stock-btn" style="background:#000;" onclick="alert('Updating Status...')">UPDATE</button></td>
                    </tr>
                </tbody>
            </table>
        `;
    }
    else if (tab === 'tracking') {
        view.innerHTML = `
            <div style="margin-bottom:20px;">
                <h3 style="font-weight:800;">LIVE ORDER TRACKER</h3>
                <p style="font-size: 12px; color: #666;">Monitoring delivery status in Cebu City.</p>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px; padding: 25px; background: #fafafa; border: 1px solid #eee; position: relative;">
                <div style="text-align:center; flex:1;">
                    <span style="color:black; font-size:15px;">●</span><br>
                    <small style="font-weight:700; font-size:9px;">ORDERED</small>
                </div>
                <div style="text-align:center; flex:1;">
                    <span style="color:black; font-size:15px;">●</span><br>
                    <small style="font-weight:700; font-size:9px;">TO SHIP</small>
                </div>
                <div style="text-align:center; flex:1;">
                    <span style="color:#ccc; font-size:15px;">○</span><br>
                    <small style="font-weight:700; font-size:9px; color:#999;">IN TRANSIT</small>
                </div>
                <div style="text-align:center; flex:1;">
                    <span style="color:#ccc; font-size:15px;">○</span><br>
                    <small style="font-weight:700; font-size:9px; color:#999;">DELIVERED</small>
                </div>
            </div>

            <div style="display: flex; gap: 20px;">
                <div style="flex: 1.2;">
                    <table class="admin-table">
                        <thead>
                            <tr style="background:#000; color:#fff;">
                                <th>ORDER ID</th><th>CUSTOMER</th><th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr onclick="updateTracker('Jullian Tampus', 'To Ship')" style="cursor:pointer;">
                                <td>#9928</td><td>Jullian Tampus</td><td><span style="color:orange; font-weight:700;">TO SHIP</span></td>
                            </tr>
                            <tr onclick="updateTracker('Ivy Marie', 'In Transit')" style="cursor:pointer;">
                                <td>#9927</td><td>Ivy Marie</td><td><span style="color:blue; font-weight:700;">IN TRANSIT</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="flex: 1; height: 250px; background: #e5e5e5; border: 2px solid #000; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
                    <div style="text-align: center;">
                        <span style="font-size: 40px; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.2));">📍</span><br>
                        <strong id="trackName" style="font-family: 'Playfair Display'; font-size: 1.2rem;">Jullian Tampus</strong><br>
                        <p id="trackStatus" style="font-size: 11px; color: #555; margin-top: 5px;">Hapit na maabot sa Brgy. Basak...</p>
                    </div>
                    <div style="position: absolute; bottom: 10px; right: 10px; background: #000; color: #fff; padding: 5px 10px; font-size: 9px; font-weight: 700;">
                        LIVE FEED: CEBU CITY
                    </div>
                </div>
            </div>
        `;
    }
}

// PARA MO-LOAD DAYON ANG SALES INIG OPEN
// Ayaw na paggamit og window.onload = function kay basin naay lain window.onload
function initAdmin() {
    const firstBtn = document.querySelector('.nav-block');
    if(firstBtn) showTab('sales', firstBtn);
}
// Tawagon ni inig click nimo sa trigger nga mo-abli sa admin
function addStock(id) {
    const bag = bags.find(b => b.id === id);
    if(bag) {
        bag.stock += 5;
        alert("Added 5 stocks to " + bag.name);
        showTab('inventory', document.querySelector('.tab-btn.active')); // Refresh table
        render(); // Refresh main store grid
    }
}


function renderSalesCharts() {
    // Yearly Line Chart
    const ctxYear = document.getElementById('yearlyChart').getContext('2d');
    new Chart(ctxYear, {
        type: 'line',
        data: {
            labels: ['2011', '2014', '2017', '2020', '2023', '2026'],
            datasets: [{
                label: 'Yearly Sales (₱)',
                data: [50000, 150000, 300000, 600000, 900000, 1450000],
                borderColor: '#000',
                backgroundColor: 'rgba(0,0,0,0.05)',
                fill: true,
                tension: 0.4
            }]
        }
    });

    // Monthly Bar Chart
    const ctxMonth = document.getElementById('monthlyChart').getContext('2d');
    new Chart(ctxMonth, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly Sales for 2026 (₱)',
                data: [125000, 120000, 158000, 138000, 148000, 155000, 98000, 78000, 168000, 132000, 72000, 108000],
                backgroundColor: '#FF4500' // Orange-Red color base sa imong pic
            }]
        }
    });
}
function renderSalesCharts() {
    // Yearly Line Chart
    const ctxYear = document.getElementById('yearlyChart').getContext('2d');
    new Chart(ctxYear, {
        type: 'line',
        data: {
            labels: ['2011', '2014', '2017', '2020', '2023', '2026'],
            datasets: [{
                label: 'Yearly Sales (₱)',
                data: [50000, 150000, 300000, 600000, 900000, 1450000],
                borderColor: '#000',
                backgroundColor: 'rgba(0,0,0,0.05)',
                fill: true,
                tension: 0.4
            }]
        }
    });

    // Monthly Bar Chart
    const ctxMonth = document.getElementById('monthlyChart').getContext('2d');
    new Chart(ctxMonth, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly Sales for 2026 (₱)',
                data: [125000, 120000, 158000, 138000, 148000, 155000, 98000, 78000, 168000, 132000, 72000, 108000],
                backgroundColor: '#FF4500' // Orange-Red color base sa imong pic
            }]
        }
    });
}
function updateTracker(name, status) {
    const nameEl = document.getElementById('trackName');
    const statusEl = document.getElementById('trackStatus');
    
    if(nameEl && statusEl) {
        nameEl.innerText = name;
        statusEl.innerText = (status === 'In Transit') 
            ? "Otw na ang courier sa inyong area, bai!" 
            : "Gi-pack pa ang item sa Shenvy Cebu Warehouse.";
        
        console.log("Tracking updated for:", name);
    }
}
