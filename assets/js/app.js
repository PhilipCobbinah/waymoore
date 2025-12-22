console.log('=== App.js Starting ===');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing app');
    
    // ===== HAMBURGER MENU INITIALIZATION =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        const setMenuState = (open) => {
            navLinks.classList.toggle('active', open);
            hamburger.classList.toggle('open', open);
            hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
        };

        // Toggle menu on button click (first click shows menu)
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            setMenuState(!navLinks.classList.contains('active'));
        });
        
        // Close when a link inside nav is clicked
        navLinks.addEventListener('click', function(e) {
            if (e.target.closest('a')) setMenuState(false);
        });
        
        // Close when clicking outside nav or on Escape
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) setMenuState(false);
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') setMenuState(false);
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
