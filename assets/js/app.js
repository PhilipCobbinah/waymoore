console.log('=== App.js Starting ===');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing app');
    
    // ===== HAMBURGER MENU INITIALIZATION =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
        
        // Close menu on Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
        
        console.log('✓ Hamburger menu initialized');
    } else {
        console.error('❌ Hamburger or navLinks element not found');
    }
    
    // ===== CART MANAGER INITIALIZATION =====
    // Initialize CartManager if it exists
    if (typeof CartManager !== 'undefined' && CartManager.init) {
        console.log('Initializing CartManager');
        CartManager.init();
    }
    
    // ===== CONTACT FORM HANDLING =====
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
            }
        });
    }
    
    // ===== HIGHLIGHT ACTIVE PAGE =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.borderBottom = '2px solid white';
            link.style.paddingBottom = '5px';
        }
    });
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
