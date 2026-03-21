const bags = [
    { id: 1, name: "Hannah Montana bag", cat: "Hand Bag", price: 8500, img: "veloura.png" },
    { id: 2, name: "Blue Vayot", cat: "Hand Bag", price: 15800, img: "obsidian.png" },
    { id: 3, name: "Aurelio Leather", cat: "Shoulder Bag", price: 9200, img: "aurelio.png" },
    { id: 4, name: "Vanté Bags", cat: "Wallet", price: 18500, img: "vante.png" },
    { id: 5, name: "Valentina Wo", cat: "Hand Bag", price: 7400, img: "solenne.png" },
    { id: 6, name: "Marquina Bags", cat: "Shoulder Bag", price: 11200, img: "marquina.png" },
    { id: 7, name: "Elvaré Leather", cat: "Wallet", price: 13900, img: "elvare.png" },
    { id: 8, name: "Calyx & Hide", cat: "Hand Bag", price: 8800, img: "calyx.png" },
    { id: 9, name: "Rovelle Leather", cat: "Shoulder Bag", price: 21000, img: "rovelle.png" },
    { id: 10, name: "Sorelle Hide Co.", cat: "Wallet", price: 6500, img: "sorelle.png" },
    { id: 11, name: "Rawgrain Leather", cat: "Hand Bag", price: 5800, img: "rawgrain.png" },
    { id: 12, name: "EarthTan Bags", cat: "Shoulder Bag", price: 10500, img: "earthtan.png" },
    { id: 13, name: "Oak & Hide", cat: "Wallet", price: 14700, img: "oak.png" },
    { id: 14, name: "Wildgrain Leather", cat: "Hand Bag", price: 9900, img: "wildgrain.png" },
    { id: 15, name: "TerraHide", cat: "Shoulder Bag", price: 12800, img: "terrahide.png" },
    { id: 16, name: "PureTan Co.", cat: "Wallet", price: 4500, img: "puretan.png" },
    { id: 17, name: "Roots & Hide", cat: "Shoulder Bag", price: 16200, img: "roots.png" },
    { id: 18, name: "Grainfolk Leather", cat: "Shoulder Bag", price: 8200, img: "grainfolk.png" },
    { id: 19, name: "NatureTanned Co", cat: "Wallet", price: 22500, img: "nature.png" }
];

let cart = [];
let wishlist = [];
let currentFilter = 'all';

function render() {
    const grid = document.getElementById('grid');
    const search = document.getElementById('searchInput').value.toLowerCase();
    const sort = document.getElementById('priceSort').value;

    let filtered = currentFilter === 'all' ? [...bags] : bags.filter(b => b.cat === currentFilter);
    if (search) filtered = filtered.filter(b => b.name.toLowerCase().includes(search));

    if (sort === 'low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'high') filtered.sort((a, b) => b.price - a.price);

    grid.innerHTML = filtered.map(bag => {
        const isWished = wishlist.some(item => item.id === bag.id) ? 'active' : '';
        return `
            <div class="item-tile">
                <div class="img-holder">
                    <button class="bookmark-btn ${isWished}" onclick="toggleBookmark(${bag.id})">♥</button>
                    <img src="images/${bag.img}" onerror="this.src='https://via.placeholder.com/400x500?text=${bag.name.split(' ')[0]}'">
                </div>
                <h2 class="item-name">${bag.name}</h2>
                <span class="item-price">₱${bag.price.toLocaleString()}</span>
                <button class="add-btn" onclick="addToBag(${bag.id})">ADD TO BAG</button>
            </div>
        `;
    }).join('');
    updateUI();
}

// Side Panel Controls
function openPanel(id) {
    document.getElementById(id).classList.add('open');
    document.getElementById('overlay').style.display = 'block';
}

function closePanels() {
    document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('open'));
    document.getElementById('overlay').style.display = 'none';
}

// Functionality
function addToBag(id) {
    cart.push(bags.find(b => b.id === id));
    updateUI();
    openPanel('bagSidebar');
}

function removeFromBag(idx) {
    cart.splice(idx, 1);
    updateUI();
}

function toggleBookmark(id) {
    const idx = wishlist.findIndex(b => b.id === id);
    if (idx > -1) wishlist.splice(idx, 1);
    else wishlist.push(bags.find(b => b.id === id));
    render();
}

// Update UI (Inside the sidebars)
function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('wish-count').innerText = wishlist.length;

    // Bag List
    const bagList = document.getElementById('bagItems');
    let total = 0;
    if (cart.length === 0) {
        bagList.innerHTML = '<p style="text-align:center; color:#999; padding-top:20px;">Empty bag.</p>';
    } else {
        bagList.innerHTML = cart.map((item, idx) => {
            total += item.price;
            return `
                <div class="side-item">
                    <img src="images/${item.img}" onerror="this.src='https://via.placeholder.com/60x75?text=Bag'">
                    <div style="flex:1;">
                        <h4 style="font-size:0.9rem;">${item.name}</h4>
                        <p style="font-size:0.8rem; color:var(--accent);">₱${item.price.toLocaleString()}</p>
                        <button onclick="removeFromBag(${idx})" style="color:red; border:none; background:none; cursor:pointer; font-size:10px;">Remove</button>
                    </div>
                </div>`;
        }).join('');
    }
    document.getElementById('bagTotal').innerText = `₱${total.toLocaleString()}`;

    // Wishlist List
    const wishList = document.getElementById('wishItems');
    if (wishlist.length === 0) {
        wishList.innerHTML = '<p style="text-align:center; color:#999; padding-top:20px;">No bookmarks.</p>';
    } else {
        wishList.innerHTML = wishlist.map(item => `
            <div class="side-item">
                <img src="images/${item.img}" onerror="this.src='https://via.placeholder.com/60x75?text=Bag'">
                <div style="flex:1;">
                    <h4 style="font-size:0.9rem;">${item.name}</h4>
                    <button onclick="addToBag(${item.id})" style="background:#111; color:white; border:none; padding:5px 10px; font-size:9px; cursor:pointer;">MOVE TO BAG</button>
                </div>
            </div>`).join('');
    }
}

function filterItems(cat, btn) {
    document.querySelectorAll('.f-link').forEach(l => l.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = cat;
    render();
}

window.onload = render;