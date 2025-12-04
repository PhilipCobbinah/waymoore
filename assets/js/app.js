document.addEventListener('DOMContentLoaded', function() {
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            alert(`Thank you, ${name}! Your message has been received.`);
            contactForm.reset();
        });
    }
    
    // Highlight active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.color = '#4CAF50';
        }
    });

    // Product display functionality
    const productContainer = document.querySelector(".product-list");

    if (productContainer && typeof products !== 'undefined') {
        productContainer.innerHTML = products.map((p, i) => `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22250%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2220%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
                <h3>${p.name}</h3>
                <p class="cat">${p.category}</p>
                <p class="price">${p.price}</p>
                <button onclick="openProduct(${i})">View Details</button>
            </div>
        `).join("");
    }
});

function openProduct(i) {
    const p = products[i];
    const modal = document.querySelector(".modal");
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <img src="${p.image}" alt="${p.name}">
            <h2>${p.name}</h2>
            <p class="cat">${p.category}</p>
            <p>${p.description}</p>
            <p class="price">${p.price}</p>
            <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `;
    modal.style.display = "block";
}

function closeModal() {
    document.querySelector(".modal").style.display = "none";
}
