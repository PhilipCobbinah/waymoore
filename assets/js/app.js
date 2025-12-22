console.log('=== App.js Starting ===');

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    // Handle hamburger menu
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
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
    }
    
    // Handle mobile menu toggle (for pages using the old structure)
    if (mobileMenuToggle) {
        const navDiv = document.querySelector('nav > div');
        if (navDiv) {
            mobileMenuToggle.addEventListener('click', function() {
                navDiv.classList.toggle('active');
            });
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing app');
    
    // Initialize CartManager if it exists
    if (typeof CartManager !== 'undefined' && CartManager.init) {
        console.log('Initializing CartManager');
        CartManager.init();
    }
    
    // Initialize mobile menu IMMEDIATELY
    setTimeout(() => {
        initializeMobileMenu();
    }, 100);
    
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
            }
        });
    }
    
    // Highlight active page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.borderBottom = '2px solid white';
            link.style.paddingBottom = '5px';
        }
    });
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

function initializeMobileMenu() {
    console.log('Initializing Mobile Menu...');
    
    const nav = document.querySelector('nav');
    if (!nav) {
        console.error('❌ Nav element not found');
        return;
    }
    console.log('✓ Nav element found');
    
    const navDiv = nav.querySelector('div');
    if (!navDiv) {
        console.error('❌ Nav div not found');
        return;
    }
    console.log('✓ Nav div found');
    
    // Remove existing toggle if any
    const existingToggle = nav.querySelector('.mobile-menu-toggle');
    if (existingToggle) {
        console.log('Removing existing toggle');
        existingToggle.remove();
    }
    
    // Create hamburger button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'mobile-menu-toggle';
    toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
    toggleButton.setAttribute('aria-label', 'Menu');
    toggleButton.setAttribute('type', 'button');
    toggleButton.style.cssText = `
        display: none;
        position: relative;
        z-index: 1001;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 8px;
    `;
    
    // Add media query for mobile
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 968px) {
            .mobile-menu-toggle {
                display: block !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Insert before nav div
    nav.insertBefore(toggleButton, navDiv);
    console.log('✓ Toggle button created and inserted');
    
    // Click handler
    toggleButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = navDiv.classList.contains('active');
        console.log('Toggle clicked, currently active:', isActive);
        
        if (!isActive) {
            navDiv.classList.add('active');
            toggleButton.querySelector('i').className = 'fas fa-times';
            document.body.style.overflow = 'hidden';
            console.log('✓ Menu opened');
        } else {
            navDiv.classList.remove('active');
            toggleButton.querySelector('i').className = 'fas fa-bars';
            document.body.style.overflow = '';
            console.log('✓ Menu closed');
        }
    });
    
    // Close on link click
    navDiv.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            console.log('Link clicked, closing menu');
            navDiv.classList.remove('active');
            toggleButton.querySelector('i').className = 'fas fa-bars';
            document.body.style.overflow = '';
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && navDiv.classList.contains('active')) {
            console.log('Outside click, closing menu');
            navDiv.classList.remove('active');
            toggleButton.querySelector('i').className = 'fas fa-bars';
            document.body.style.overflow = '';
        }
    });
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navDiv.classList.contains('active')) {
            console.log('Escape pressed, closing menu');
            navDiv.classList.remove('active');
            toggleButton.querySelector('i').className = 'fas fa-bars';
            document.body.style.overflow = '';
        }
    });
    
    console.log('✅ Mobile menu fully initialized!');
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
