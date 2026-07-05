const storefrontSeedProducts = [
    {
        id: 1,
        name: "Waymoore Man Power",
        category: "Health & Wellness",
        price: "₦150",
        image: "assets/img/products/waymoore_man_power.jpg",
        description: "Supports male wellness, boosts energy and vitality."
    },
    {
        id: 6,
        name: "Plant Protein Mix Without Nuts (13)",
        category: "Health & Wellness",
        price: "₦80",
        image: "assets/img/products/waymore_protein_without_nuts1.jpeg",
        description: "Allergy friendly version of the plant-based protein mix."
    },
    {
        id: 10,
        name: "Hair Growth Oil",
        category: "Hair Care",
        price: "₦75",
        image: "assets/img/products/hair-care1.jpeg",
        description: "Stimulates scalp and boosts hair growth."
    },
    {
        id: 11,
        name: "Leave-In Conditioner",
        category: "Hair Care",
        price: "₦6,000",
        image: "assets/img/products/waymoore_leave_in_conditioner.jpeg",
        description: "Hydrates, detangles, and protects hair all day."
    },
    {
        id: 13,
        name: "African Black Shampoo",
        category: "Hair Care",
        price: "₦60",
        image: "assets/img/products/waymore_repair_black_soap.jpeg",
        description: "Detoxifying shampoo made with African black soap."
    },
    {
        id: 24,
        name: "Organic Stimulating Hair Growth Butter",
        category: "Hair Care",
        price: "₦6,000",
        image: "assets/img/products/ayurvedic_hair_growth_butter.jpeg",
        detailUrl: "product-hair-butter.html",
        showGridPrice: true,
        description: "A rich herbal hair treatment specially formulated with powerful Ayurvedic herbs, natural butters, and nourishing oils that help strengthen hair from roots to tips."
    },
    {
        id: 25,
        name: "Organic Stimulating Hair Pomade",
        category: "Hair Care",
        price: "₦6,000",
        image: "assets/img/products/hair-care.jpg",
        description: "A nourishing pomade that supports hair strength and scalp comfort."
    },
    {
        id: 15,
        name: "Anti-Aging Glyceric Soap",
        category: "Skin Care",
        price: "₦35,000",
        image: "assets/img/products/waymore_Glysolin soap.jpg",
        description: "Hydrating soap that reduces fine lines and smooths skin."
    },
    {
        id: 18,
        name: "Waymoore Shower Gel",
        category: "Skin Care",
        price: "₦45",
        image: "assets/img/products/shower_gel.jpeg",
        description: "Refreshing, chemical-free, luxurious shower experience."
    },
    {
        id: 19,
        name: "Waymoore Hand Wash",
        category: "Skin Care",
        price: "₦30",
        image: "assets/img/products/waymoore_hand_wash(liquid soap).jpeg",
        description: "Moisturizing and gentle germ-removing hand wash."
    },
    {
        id: 22,
        name: "Body Butter",
        tagline: "Restore. Nourish. Glow.",
        category: "Skin Care",
        price: "₦10,000",
        image: "assets/img/products/repair_brightening_body_butter.jpeg",
        detailUrl: "product-body-butter.html",
        description: "A luxurious, deeply moisturizing skincare treatment specially formulated to repair dry, damaged skin while promoting a brighter, smoother, and more radiant complexion."
    },
    {
        id: 23,
        name: "Waymoore Repair Black Soap",
        category: "Skin Care",
        price: "₦35,000",
        image: "assets/img/products/waymore_repair_black_soap.jpeg",
        detailUrl: "product-black-soap.html",
        showGridPrice: true,
        description: "A powerful herbal cleansing soap specially crafted to help repair damaged skin, deeply cleanse impurities, and restore healthy-looking skin naturally. Enriched with African black soap and botanical ingredients."
    },
    {
        id: 26,
        name: "Vital Seed Blend",
        category: "Health & Wellness",
        price: "₦25,000",
        image: "assets/img/products/health-wellness2.jpeg",
        description: "A nutrient-rich blend designed to support overall wellness and vitality."
    },
    {
        id: 27,
        name: "Protein Mix Without Nuts (600g)",
        category: "Health & Wellness",
        price: "₦40,000",
        image: "assets/img/products/waymore_protein_without_nuts.jpg",
        description: "A 600g protein mix formulated without nuts for easy daily nutrition."
    },
    {
        id: 28,
        name: "Protein Mix Without Nuts (250g)",
        category: "Health & Wellness",
        price: "₦15,000",
        image: "assets/img/products/waymore_protein_without_nuts.jpg",
        description: "A 250g protein mix formulated without nuts for easy daily nutrition."
    },
    {
        id: 29,
        name: "Protein Mix Without Nuts (1kg)",
        category: "Health & Wellness",
        price: "₦50,000",
        image: "assets/img/products/waymore_protein_without_nuts.jpg",
        description: "A 1kg protein mix formulated without nuts for easy daily nutrition."
    },
    {
        id: 30,
        name: "Herbal Drink",
        category: "Health & Wellness",
        price: "₦20,000",
        image: "assets/img/products/health-wellness.jpg",
        description: "A natural herbal drink made for everyday wellness support."
    },
    {
        id: 31,
        name: "Harmony Bloom",
        category: "Health & Wellness",
        price: "₦25,000",
        image: "assets/img/products/health-wellness1.jpeg",
        description: "A wellness blend created to promote balance, calm, and vitality."
    },
    {
        id: 20,
        name: "Dishwasher Liquid",
        category: "Household",
        price: "₦25",
        image: "assets/img/products/dish_wash.png",
        description: "Plant-based grease-cutting dish cleaning liquid."
    },
    {
        id: 21,
        name: "Heavy Duty Car Wash",
        category: "Household",
        price: "₦35",
        image: "assets/img/products/car_wash.jpeg",
        description: "Strong yet safe formula for sparkling clean cars."
    }

];

function resolveStorefrontAssetPath(imagePath) {
    if (!imagePath) {
        return 'assets/img/products/waymoore_logo.jpg';
    }

    const value = String(imagePath);
    if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
        return value;
    }

    const cleaned = value.replace(/^\.\//, '').replace(/^\.\.\//, '').replace(/^\/+/, '');
    return cleaned.startsWith('assets/') ? cleaned : `assets/${cleaned}`;
}

function resolveMediaUrl(image) {
    // If image is already a data URL, return it
    if (typeof image === 'string' && image.startsWith('data:')) {
        return image;
    }
    
    // If image is a media ID reference, try to load from media library
    if (typeof image === 'string' && image.startsWith('media-')) {
        try {
            const mediaLibrary = JSON.parse(localStorage.getItem('waymooreMediaLibrary') || '{}');
            if (mediaLibrary[image] && mediaLibrary[image].data) {
                return mediaLibrary[image].data;
            }
        } catch (e) {
            console.warn('Could not resolve media URL:', image);
        }
    }
    
    return image;
}

function formatStorefrontPrice(value) {
    const numericValue = parseFloat(String(value ?? '').replace(/[^\d.]/g, ''));
    if (Number.isNaN(numericValue)) {
        return '₦0';
    }

    return `₦${numericValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function normalizeStorefrontProduct(product) {
    let image = product.image || product.thumbnail || (Array.isArray(product.images) ? product.images[0] : '') || 'assets/img/products/waymoore_logo.jpg';
    
    // Resolve media library references
    image = resolveMediaUrl(image);
    
    const normalizedImage = String(image).replace(/^\.\//, '').replace(/^\.\.\//, '');
    return {
        ...product,
        id: Number(product.id || Date.now()),
        name: product.name || 'Untitled Product',
        category: product.category || 'Uncategorized',
        price: formatStorefrontPrice(product.price || product.discountPrice || '0'),
        image: resolveStorefrontAssetPath(normalizedImage),
        description: product.description || product.shortDescription || '',
        detailUrl: product.detailUrl || '',
        showGridPrice: Boolean(product.showGridPrice)
    };
}

function loadStorefrontProducts() {
    try {
        const catalogRaw = localStorage.getItem('waymooreProductsCatalog');
        if (catalogRaw) {
            const parsed = JSON.parse(catalogRaw);
            if (Array.isArray(parsed) && parsed.length) {
                const catalog = parsed.map((product) => normalizeStorefrontProduct(product));
                const byId = new Map(catalog.map((product) => [String(product.id), product]));

                storefrontSeedProducts.forEach((seedProduct) => {
                    const normalizedSeed = normalizeStorefrontProduct(seedProduct);
                    const seedKey = String(normalizedSeed.id);
                    if (byId.has(seedKey)) {
                        byId.set(seedKey, { ...byId.get(seedKey), ...normalizedSeed });
                    } else {
                        byId.set(seedKey, normalizedSeed);
                    }
                });

                return Array.from(byId.values());
            }
        }
    } catch (error) {
        console.warn('Unable to load storefront product catalog', error);
    }

    return storefrontSeedProducts.map((product) => normalizeStorefrontProduct(product));
}

let products = loadStorefrontProducts();
let activeProductCategory = "All";

const productImageFallback = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Segoe UI, sans-serif%22 font-size=%2220%22 fill=%22%236b7280%22%3ENo Image%3C/text%3E%3C/svg%3E";

function refreshStorefrontCatalog() {
    products = loadStorefrontProducts();
    const productGrid = document.getElementById('product-grid') || document.querySelector('.product-list');
    if (productGrid) {
        renderProducts(productGrid);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.getElementById('product-grid') || document.querySelector('.product-list');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (productGrid) {
        refreshStorefrontCatalog();
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', function() {
            activeProductCategory = this.dataset.category || "All";

            filterButtons.forEach((filterButton) => {
                filterButton.classList.toggle('active', filterButton === this);
                filterButton.setAttribute('aria-pressed', filterButton === this ? 'true' : 'false');
            });

            renderProducts(productGrid);
        });

        button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    });
});

function getFilteredProducts() {
    if (activeProductCategory === "All") {
        return products;
    }

    return products.filter((product) => product.category === activeProductCategory);
}

function renderProducts(container) {
    if (!container) return;

    const filteredProducts = getFilteredProducts();

    if (filteredProducts.length === 0) {
        container.innerHTML = `<p class="empty-products">No products found in this category.</p>`;
        return;
    }

    container.innerHTML = filteredProducts.map((product) => {
        const imageMarkup = product.image
            ? `<img src="${product.image}" alt="${product.name}" onerror="this.src='${productImageFallback}'">`
            : `<div class="product-image-placeholder product-card-placeholder">Product Image</div>`;
        const actionMarkup = product.detailUrl
            ? `<a class="view-details-btn product-detail-link" href="${product.detailUrl}">View Details</a>`
            : `<button type="button" class="add-to-cart-btn" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>`;
        const showPrice = !product.detailUrl || product.showGridPrice;
        const badgeClass = product.category === "Hair Care" ? "category-badge hair-care-badge" : "category-badge";

        return `
            <article class="product-card" data-product-id="${product.id}" tabindex="0">
                <div class="product-image-wrap">
                    ${imageMarkup}
                </div>
                <div class="product-card-body">
                    <h3>${product.name}</h3>
                    <span class="${badgeClass}">${product.category}</span>
                    ${showPrice ? `<p class="price">${product.price}</p>` : ''}
                    ${actionMarkup}
                </div>
            </article>
        `;
    }).join('');

    container.querySelectorAll('.add-to-cart-btn').forEach((button) => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            addToCart(Number(this.dataset.productId));
        });
    });

    container.querySelectorAll('.product-card').forEach((card) => {
        card.addEventListener('click', function(event) {
            if (event.target.closest('button, a')) return;
            openProductById(Number(this.dataset.productId));
        });

        card.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openProductById(Number(this.dataset.productId));
            }
        });
    });
}

function openProductById(productId) {
    const productIndex = products.findIndex((product) => product.id === productId);
    if (productIndex !== -1) {
        if (products[productIndex].detailUrl) {
            window.location.href = products[productIndex].detailUrl;
            return;
        }

        openProduct(productIndex);
    }
}

function openProduct(i) {
    if (typeof products === 'undefined' || !products[i]) {
        console.error('Product not found at index:', i);
        return;
    }

    const p = products[i];
    const modal = document.querySelector(".modal");

    if (!modal) {
        return;
    }

    modal.innerHTML = `
        <div class="modal-content">
            <button type="button" class="close" onclick="closeModal()" aria-label="Close product details">&times;</button>
            <img src="${p.image}" alt="${p.name}" onerror="this.src='${productImageFallback}'">
            <h2>${p.name}</h2>
            <span class="category-badge">${p.category}</span>
            <p>${p.description}</p>
            <p class="price">${p.price}</p>
            <div class="modal-buttons">
                <button type="button" class="btn add-to-cart-btn" id="modal-add-to-cart-${p.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button type="button" class="btn buy-now-btn" id="modal-buy-now-${p.id}">
                    <i class="fas fa-bolt"></i> Buy Now
                </button>
            </div>
        </div>
    `;
    modal.style.display = "block";

    const addToCartBtn = document.getElementById(`modal-add-to-cart-${p.id}`);
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            addToCart(p.id);
        });
    }

    const buyNowBtn = document.getElementById(`modal-buy-now-${p.id}`);
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (typeof CartManager !== 'undefined' && CartManager.addToCart) {
                if (typeof AuthManager !== 'undefined' && !AuthManager.isLoggedIn()) {
                    CartManager.addToCart(p.id);
                    return;
                }

                CartManager.addToCart(p.id);
                closeModal();
                setTimeout(() => {
                    window.location.href = 'checkout.html';
                }, 500);
            } else {
                alert('Cart system not loaded. Please refresh the page and try again.');
            }
        });
    }

    modal.addEventListener('click', closeModalFromBackdrop);
}

function closeModalFromBackdrop(event) {
    if (event.target === event.currentTarget) {
        closeModal();
    }
}

function closeModal() {
    const modal = document.querySelector(".modal");
    if (modal) {
        modal.style.display = "none";
        modal.removeEventListener('click', closeModalFromBackdrop);
    }
}

function toggleAllProducts() {
    activeProductCategory = "All";
    const productGrid = document.getElementById('product-grid') || document.querySelector('.product-list');
    document.querySelectorAll('.filter-btn').forEach((button) => {
        const isActive = button.dataset.category === "All";
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    renderProducts(productGrid);
}

function addToCart(productId) {
    if (typeof CartManager === 'undefined' || !CartManager.addToCart) {
        alert('Cart system is not ready. Please refresh the page.');
        return;
    }

    CartManager.addToCart(productId);
}

window.addEventListener('storage', function(event) {
    if (event.key === 'waymooreProductsCatalog') {
        refreshStorefrontCatalog();
    }
});
window.addEventListener('waymooreCatalogUpdated', refreshStorefrontCatalog);

window.openProduct = openProduct;
window.closeModal = closeModal;
window.toggleAllProducts = toggleAllProducts;
window.addToCart = addToCart;
