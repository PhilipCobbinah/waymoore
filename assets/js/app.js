document.addEventListener('DOMContentLoaded', function () {
    console.log('App.js loaded');

    // Mobile menu toggle - ALWAYS create it
    createMobileMenu();

    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
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

    // Log page info for debugging
    console.log('Current page:', currentPage);
    console.log('User logged in:', AuthManager ? AuthManager.isLoggedIn() : false);
    if (AuthManager && AuthManager.isLoggedIn()) {
        const user = AuthManager.getCurrentUser();
        console.log('User cart items:', user.cart ? user.cart.length : 0);
    }
});

function createMobileMenu() {
    const nav = document.querySelector('nav');
    if (!nav) {
        console.error('Nav element not found');
        return;
    }

    const navDiv = nav.querySelector('div');
    if (!navDiv) {
        console.error('Nav div not found');
        return;
    }

    // Check if toggle button already exists
    let toggleButton = nav.querySelector('.mobile-menu-toggle');

    if (!toggleButton) {
        // Create mobile menu toggle button
        toggleButton = document.createElement('button');
        toggleButton.className = 'mobile-menu-toggle';
        toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
        toggleButton.setAttribute('aria-label', 'Toggle menu');
        toggleButton.setAttribute('type', 'button');

        // Insert toggle button before nav div
        nav.insertBefore(toggleButton, navDiv);
        console.log('Mobile menu button created');
    }

    // Toggle menu on button click
    toggleButton.addEventListener('click', function (e) {
        e.stopPropagation();
        const isActive = navDiv.classList.toggle('active');

        console.log('Menu toggled:', isActive);

        // Change icon
        const icon = toggleButton.querySelector('i');
        if (isActive) {
            icon.className = 'fas fa-times';
            document.body.style.overflow = 'hidden'; // Prevent scrolling

            // Add entrance animation to links
            const links = navDiv.querySelectorAll('a');
            links.forEach((link, index) => {
                link.style.opacity = '0';
                link.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    link.style.transition = 'all 0.3s ease';
                    link.style.opacity = '1';
                    link.style.transform = 'translateX(0)';
                }, 100 * index);
            });
        } else {
            icon.className = 'fas fa-bars';
            document.body.style.overflow = ''; // Restore scrolling
        }
    });

    // Close menu when clicking a link
    const navLinks = navDiv.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navDiv.classList.remove('active');
            const icon = toggleButton.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target) && navDiv.classList.contains('active')) {
            navDiv.classList.remove('active');
            const icon = toggleButton.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
            document.body.style.overflow = '';
        }
    });

    // Handle escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navDiv.classList.contains('active')) {
            navDiv.classList.remove('active');
            const icon = toggleButton.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
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
