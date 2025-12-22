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

(function() {
	const hamburger = document.getElementById('hamburger');
	const navLinks = document.getElementById('navLinks');

	if (!hamburger || !navLinks) return;

	function closeMenu() {
		hamburger.classList.remove('open');
		navLinks.classList.remove('active');
		hamburger.setAttribute('aria-expanded', 'false');
		document.body.style.overflow = '';
	}

	function openMenu() {
		hamburger.classList.add('open');
		navLinks.classList.add('active');
		hamburger.setAttribute('aria-expanded', 'true');
		// prevent body scrolling when menu open on small screens
		document.body.style.overflow = 'hidden';
	}

	hamburger.addEventListener('click', function(e) {
		const expanded = hamburger.classList.contains('open');
		if (expanded) closeMenu();
		else openMenu();
	});

	// close when a link is clicked
	navLinks.addEventListener('click', function(e) {
		const target = e.target.closest('a');
		if (!target) return;
		// close the menu after navigation click (keeps behavior consistent)
		if (window.innerWidth <= 768) closeMenu();
	});

	// if resizing to desktop, ensure menu is closed
	window.addEventListener('resize', function() {
		if (window.innerWidth > 768) closeMenu();
	});
})();
