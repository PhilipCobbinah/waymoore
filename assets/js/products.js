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

document.addEventListener('DOMContentLoaded', function() {
    const productGrid = document.getElementById('product-grid');
    const productList = document.querySelector('.product-list');
    const sliderContainer = document.querySelector('.slider-container');
    
    // Display featured products in slider (first 6 products, duplicated for infinite scroll)
    if (sliderContainer) {
        const featuredProducts = products.slice(0, 6);
        // Duplicate products for seamless loop
        const allSliderProducts = [...featuredProducts, ...featuredProducts];
        
        allSliderProducts.forEach((product, i) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22250%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2220%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
                <h3>${product.name}</h3>
                <p class="cat">${product.category}</p>
                <p class="price">${product.price}</p>
                <button onclick="openProduct(${product.id - 1})">View Details</button>
            `;
            sliderContainer.appendChild(productCard);
        });
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
                <button onclick="openProduct(${i})">View Details</button>
            `;
            container.appendChild(productCard);
        });
    }
});

function toggleAllProducts() {
    const productList = document.querySelector('.product-list');
    const featuredSection = document.querySelector('.featured-products');
    const button = document.querySelector('.view-all-btn');
    
    if (productList.style.display === 'none') {
        productList.style.display = 'grid';
        featuredSection.style.display = 'none';
        button.textContent = 'Show Featured Products';
        button.onclick = function() {
            productList.style.display = 'none';
            featuredSection.style.display = 'block';
            button.textContent = 'View All Products';
            button.onclick = toggleAllProducts;
        };
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    alert(`${product.name} added to cart!`);
}
