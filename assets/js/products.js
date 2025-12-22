const products = [
    {
        id: 1,
        name: "Waymoore Man Power",
        category: "Health & Wellness",
        price: "₵150",
        image: "assets/img/products/waymoore_man_power.jpg",
        description: "Supports male wellness, boosts energy and vitality."
    },
    // {
    //     id: 2,
    //     name: "Waymoore Everywoman Combo",
    //     category: "Health & Wellness",
    //     price: "₵180",
    //     image: "assets/img/products/Waymoore_Everywoman_Combo.jpg",
    //     description: "The wellness combo designed to support women's health."
    // },
    // {
    //     id: 3,
    //     name: "Waymoore Infection Cleanser",
    //     category: "Health & Wellness",
    //     price: "₵120",
    //     image: "assets/img/products/waymoore_logo.jpg",
    //     description: "Natural purifier that supports the body's immune system."
    // },
    // {
    //     id: 4,
    //     name: "Waymoore Slim Tea",
    //     category: "Tea & Nutrition",
    //     price: "₵70",
    //     image: "assets/img/products/waymoore_logo.jpg",
    //     description: "Herbal blend for weight management, digestion, and immunity."
    // },
    // {
    //     id: 5,
    //     name: "Plant Based Protein Mix (11)",
    //     category: "Tea & Nutrition",
    //     price: "₵85",
    //     image: "assets/img/products/waymoore_logo.jpg",
    //     description: "Whole grain + nuts meal replacement for all ages."
    // },
    {
        id: 6,
        name: "Plant Protein Mix Without Nuts (13)",
        category: "Tea & Nutrition",
        price: "₵80",
        image: "assets/img/products/waymore_protein_without_nuts.jpg",
        description: "Allergy friendly version of the plant-based protein mix."
    },
    // {
    //     id: 7,
    //     name: "Waymoore Sausage Roll",
    //     category: "Food",
    //     price: "₵20",
    //     image: "assets/img/products/waymoore_logo.jpg",
    //     description: "Healthy, delicious, protein-packed sausage roll."
    // },
    // {
    //     id: 8,
    //     name: "Butt, Hip & Breast Enhancement Oil",
    //     category: "Beauty",
    //     price: "₵160",
    //     image: "assets/img/products/waymoore_logo.jpg",
    //     description: "Nourishes skin and enhances curves naturally."
    // },
    // {
    //     id: 9,
    //     name: "Butt & Hip Syrup",
    //     category: "Beauty",
    //     price: "₵140",
    //     image: "assets/img/products/waymoore_logo.jpg",
    //     description: "Supports natural enhancement of curves from within."
    // },
    {
        id: 10,
        name: "Hair Growth Oil",
        category: "Hair Care",
        price: "₵75",
        image: "assets/img/products/waymoore_organic_stimulating_hair_growth.jpg",
        description: "Stimulates scalp and boosts hair growth."
    },
    {
        id: 11,
        name: "Leave-In Conditioner",
        category: "Hair Care",
        price: "₵50",
        image: "assets/img/products/waymoore_leave_in_conditioner.jpg",
        description: "Hydrates, detangles, and protects hair all day."
    },
    // {
    //     id: 12,
    //     name: "Waymoore Conditioner",
    //     category: "Hair Care",
    //     price: "₵50",
    //     image: "assets/img/products/waymoore_logo.jpg",
    //     description: "Deep conditioning formula for repair and shine."
    // },
    {
        id: 13,
        name: "African Black Shampoo",
        category: "Hair Care",
        price: "₵60",
        image: "assets/img/products/waymoore_black_soap.jpg",
        description: "Detoxifying shampoo made with African black soap."
    },
    // {
    //     id: 14,
    //     name: "Hair Mask",
    //     category: "Hair Care",
    //     price: "₵65",
    //     image: "assets/img/products/waymoore_logo.jpg",
    //     description: "Intensive moisture and repair treatment."
    // },
    {
        id: 15,
        name: "Glycerin Anti-Aging Soap",
        category: "Body Care",
        price: "₵35",
        image: "assets/img/products/waymore_Glysolin soap.jpg",
        description: "Hydrating soap that reduces fine lines and smooths skin."
    },
    // {
    //     id: 16,
    //     name: "Goat Milk Soap",
    //     category: "Body Care",
    //     price: "₵30",
    //     image: "assets/img/products/waymoore_logo.jpg",
    //     description: "Gentle cleansing for sensitive skin."
    // },
    // {
    //     id: 17,
    //     name: "Feminine Wash",
    //     category: "Body Care",
    //     price: "₵40",
    //     image: "assets/img/products/waymoore_logo.jpg",
    //     description: "pH-balanced wash for intimate care."
    // },
    {
        id: 18,
        name: "Waymoore Shower Gel",
        category: "Body Care",
        price: "₵45",
        image: "assets/img/products/waymoore_body_butter_cream.jpg",
        description: "Refreshing, chemical-free, luxurious shower experience."
    },
    {
        id: 19,
        name: "Waymoore Hand Wash",
        category: "Body Care",
        price: "₵30",
        image: "assets/img/products/waymoore_hand_wash(liquid soap).jpg",
        description: "Moisturizing and gentle germ-removing hand wash."
    },
    {
        id: 20,
        name: "Dishwasher Liquid",
        category: "Household",
        price: "₵25",
        image: "assets/img/products/waymoore_dishwasher.jpg",
        description: "Plant-based grease-cutting dish cleaning liquid."
    },
    {
        id: 21,
        name: "Heavy Duty Car Wash",
        category: "Household",
        price: "₵35",
        image: "assets/img/products/waymoore_autowash.jpg",
        description: "Strong yet safe formula for sparkling clean cars."
    }
];

let currentSlideIndex = 0;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let sliderInterval;
let autoSlideInterval;

document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.getElementById('product-grid');
    const productList = document.querySelector('.product-list');
    const sliderContainer = document.querySelector('.slider-container');
    
    // Display featured products in slider
    if (sliderContainer) {
        products.forEach((product, i) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22250%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2220%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
                <h3>${product.name}</h3>
                <p class="cat">${product.category}</p>
                <p class="price">${product.price}</p>
                <button type="button" class="view-details-btn" data-index="${i}">View Details</button>
            `;
            sliderContainer.appendChild(productCard);
        });
        
        // Add event listeners to slider buttons
        document.querySelectorAll('.slider-container .view-details-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                openProduct(index);
            });
        });
        
        // Initialize slider controls
        initSliderControls();
    }
    
    // Display all products in grid (hidden initially)
    const container = productGrid || productList;
    
    if (container && container.classList.contains('product-list')) {
        products.forEach((product, i) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22250%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2220%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
                <h3>${product.name}</h3>
                <p class="cat">${product.category}</p>
                <p class="price">${product.price}</p>
                <button type="button" class="view-details-btn" data-index="${i}">View Details</button>
            `;
            container.appendChild(productCard);
        });
        
        // Add event listeners to grid buttons
        document.querySelectorAll('.product-list .view-details-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                openProduct(index);
            });
        });
    }
});

function initSliderControls() {
    const sliderContainer = document.querySelector('.slider-container');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (!sliderContainer || !prevBtn || !nextBtn) return;
    
    const cards = sliderContainer.querySelectorAll('.product-card');
    const cardWidth = 300; // card width + gap
    const visibleCards = getVisibleCards();
    const totalSlides = Math.ceil(products.length / visibleCards);
    
    // Create dots
    createDots(totalSlides, dotsContainer);
    
    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlider();
            resetAutoSlide();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentSlideIndex < totalSlides - 1) {
            currentSlideIndex++;
            updateSlider();
            resetAutoSlide();
        }
    });
    
    // Touch/Mouse drag support
    sliderContainer.addEventListener('mousedown', dragStart);
    sliderContainer.addEventListener('touchstart', dragStart);
    sliderContainer.addEventListener('mouseup', dragEnd);
    sliderContainer.addEventListener('touchend', dragEnd);
    sliderContainer.addEventListener('mouseleave', dragEnd);
    sliderContainer.addEventListener('mousemove', drag);
    sliderContainer.addEventListener('touchmove', drag);
    
    // Pause auto-slide on hover
    sliderContainer.addEventListener('mouseenter', () => {
        stopAutoSlide();
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlider();
            resetAutoSlide();
        } else if (e.key === 'ArrowRight' && currentSlideIndex < totalSlides - 1) {
            currentSlideIndex++;
            updateSlider();
            resetAutoSlide();
        }
    });
    
    // Update on resize
    window.addEventListener('resize', () => {
        updateSlider();
        resetAutoSlide();
    });
    
    updateSlider();
    startAutoSlide(); // Start automatic sliding
}

function startAutoSlide() {
    stopAutoSlide(); // Clear any existing interval
    
    autoSlideInterval = setInterval(() => {
        const visibleCards = getVisibleCards();
        const totalSlides = Math.ceil(products.length / visibleCards);
        
        currentSlideIndex++;
        
        // Loop back to start when reaching the end
        if (currentSlideIndex >= totalSlides) {
            currentSlideIndex = 0;
        }
        
        updateSlider();
    }, 3000); // Slide every 3 seconds
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

function getVisibleCards() {
    const width = window.innerWidth;
    if (width < 480) return 1;
    if (width < 768) return 2;
    if (width < 968) return 3;
    return 4;
}

function createDots(totalSlides, container) {
    if (!container) return;
    
    container.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            currentSlideIndex = i;
            updateSlider();
            resetAutoSlide(); // Reset auto-slide timer when user clicks a dot
        });
        
        container.appendChild(dot);
    }
}

function updateSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!sliderContainer) return;
    
    const visibleCards = getVisibleCards();
    const cardWidth = 300;
    const translateX = currentSlideIndex * cardWidth * visibleCards;
    
    sliderContainer.style.transform = `translateX(-${translateX}px)`;
    
    // Update button states
    if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
    if (nextBtn) {
        const totalSlides = Math.ceil(products.length / visibleCards);
        nextBtn.disabled = currentSlideIndex >= totalSlides - 1;
    }
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlideIndex);
    });
}

function dragStart(e) {
    isDragging = true;
    startPos = getPositionX(e);
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.classList.add('no-transition');
    stopAutoSlide(); // Stop auto-slide when user interacts
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const currentPosition = getPositionX(e);
    currentTranslate = prevTranslate + currentPosition - startPos;
    
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.style.transform = `translateX(${currentTranslate}px)`;
}

function dragEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.classList.remove('no-transition');
    
    const movedBy = currentTranslate - prevTranslate;
    const threshold = 50;
    
    if (movedBy < -threshold && currentSlideIndex < Math.ceil(products.length / getVisibleCards()) - 1) {
        currentSlideIndex++;
    } else if (movedBy > threshold && currentSlideIndex > 0) {
        currentSlideIndex--;
    }
    
    updateSlider();
    
    const visibleCards = getVisibleCards();
    const cardWidth = 300;
    prevTranslate = -currentSlideIndex * cardWidth * visibleCards;
    currentTranslate = prevTranslate;
    
    startAutoSlide(); // Resume auto-slide after user interaction
}

function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

function openProduct(i) {
    if (typeof products === 'undefined' || !products[i]) {
        console.error('Product not found at index:', i);
        return;
    }
    
    const p = products[i];
    const modal = document.querySelector(".modal");
    
    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <img src="${p.image}" alt="${p.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2220%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
            <h2>${p.name}</h2>
            <p class="cat">${p.category}</p>
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
    
    // Add event listener to the Add to Cart button
    const addToCartBtn = document.getElementById(`modal-add-to-cart-${p.id}`);
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Add to cart clicked for product:', p.id);
            
            // Check if CartManager exists
            if (typeof CartManager !== 'undefined' && CartManager.addToCart) {
                CartManager.addToCart(p.id);
            } else {
                console.error('CartManager not available');
                alert('Cart system not loaded. Please refresh the page and try again.');
            }
        });
    }
    
    // Add event listener to the Buy Now button
    const buyNowBtn = document.getElementById(`modal-buy-now-${p.id}`);
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Buy now clicked for product:', p.id);
            
            // Check if CartManager exists and add to cart
            if (typeof CartManager !== 'undefined' && CartManager.addToCart) {
                CartManager.addToCart(p.id);
                // Close modal and redirect to checkout
                closeModal();
                setTimeout(() => {
                    window.location.href = 'checkout.html';
                }, 500);
            } else {
                console.error('CartManager not available');
                alert('Cart system not loaded. Please refresh the page and try again.');
            }
        });
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector(".modal");
    if (modal) {
        modal.style.display = "none";
    }
}

function toggleAllProducts() {
    const productList = document.querySelector('.product-list');
    const featuredSection = document.querySelector('.featured-products');
    const button = document.querySelector('.view-all-btn');
    
    if (!productList || !featuredSection || !button) {
        console.error('Required elements not found');
        return;
    }
    
    if (productList.style.display === 'none' || productList.style.display === '') {
        productList.style.display = 'grid';
        featuredSection.style.display = 'none';
        button.textContent = 'Show Featured Products';
    } else {
        productList.style.display = 'none';
        featuredSection.style.display = 'block';
        button.textContent = 'View All Products';
        
        // Scroll to top of products section
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

function addToCart(productId) {
    console.log('addToCart function called with ID:', productId);
    
    if (typeof CartManager === 'undefined') {
        console.error('CartManager not loaded');
        alert('Cart system is not ready. Please refresh the page.');
        return;
    }
    
    CartManager.addToCart(productId);
}

// Make functions globally available
window.openProduct = openProduct;
window.closeModal = closeModal;
window.toggleAllProducts = toggleAllProducts;
window.addToCart = addToCart;
