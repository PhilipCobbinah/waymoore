document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    createMobileMenu();
    
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                alert(`Thank you, ${name}!\n\nYour message has been received. We will get back to you soon at ${email}.`);
                contactForm.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
    
    // Highlight active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.borderBottom = '2px solid white';
            link.style.paddingBottom = '5px';
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

function createMobileMenu() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    const navDiv = nav.querySelector('div');
    if (!navDiv) return;
    
    // Check if toggle button already exists
    if (nav.querySelector('.mobile-menu-toggle')) return;
    
    // Create mobile menu toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'mobile-menu-toggle';
    toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
    toggleButton.setAttribute('aria-label', 'Toggle menu');
    toggleButton.setAttribute('type', 'button');
    
    // Insert toggle button before nav div
    nav.insertBefore(toggleButton, navDiv);
    
    // Toggle menu on button click
    toggleButton.addEventListener('click', function(e) {
        e.stopPropagation();
        navDiv.classList.toggle('active');
        
        // Change icon
        const icon = toggleButton.querySelector('i');
        if (navDiv.classList.contains('active')) {
            icon.className = 'fas fa-times';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            icon.className = 'fas fa-bars';
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Close menu when clicking a link
    const navLinks = navDiv.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navDiv.classList.remove('active');
            toggleButton.querySelector('i').className = 'fas fa-bars';
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && navDiv.classList.contains('active')) {
            navDiv.classList.remove('active');
            toggleButton.querySelector('i').className = 'fas fa-bars';
            document.body.style.overflow = '';
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navDiv.classList.contains('active')) {
            navDiv.classList.remove('active');
            toggleButton.querySelector('i').className = 'fas fa-bars';
            document.body.style.overflow = '';
        }
    });
}

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
