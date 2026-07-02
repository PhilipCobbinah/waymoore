console.log('=== App.js Starting ===');

function initGlobalDialogs() {
    if (document.getElementById('global-dialog')) return;

    const dialog = document.createElement('div');
    dialog.id = 'global-dialog';
    dialog.className = 'modal';
    dialog.style.display = 'none';
    dialog.innerHTML = `
        <div class="modal-content global-dialog-content">
            <button class="close" type="button" id="dialog-close">&times;</button>
            <h2 id="dialog-title"></h2>
            <div id="dialog-body" class="dialog-body"></div>
            <div id="dialog-actions" class="dialog-actions"></div>
        </div>
    `;
    document.body.appendChild(dialog);

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) closeGlobalDialog();
    });

    document.getElementById('dialog-close')?.addEventListener('click', closeGlobalDialog);
}

function closeGlobalDialog() {
    const dialog = document.getElementById('global-dialog');
    if (!dialog) return;

    dialog.style.display = 'none';
    const titleEl = document.getElementById('dialog-title');
    const bodyEl = document.getElementById('dialog-body');
    const actionsEl = document.getElementById('dialog-actions');
    if (titleEl) titleEl.textContent = '';
    if (bodyEl) bodyEl.textContent = '';
    if (actionsEl) actionsEl.innerHTML = '';
}

function showDialog(title, message, buttons = []) {
    initGlobalDialogs();

    const dialog = document.getElementById('global-dialog');
    const titleEl = document.getElementById('dialog-title');
    const bodyEl = document.getElementById('dialog-body');
    const actionsEl = document.getElementById('dialog-actions');
    if (!dialog || !titleEl || !bodyEl || !actionsEl) return;

    titleEl.textContent = title;
    bodyEl.textContent = message;
    actionsEl.innerHTML = '';

    buttons.forEach((buttonConfig) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = buttonConfig.text;
        button.className = buttonConfig.className || 'btn';
        button.addEventListener('click', () => {
            if (buttonConfig.onClick) buttonConfig.onClick();
            closeGlobalDialog();
        });
        actionsEl.appendChild(button);
    });

    dialog.style.display = 'grid';
}

function showConfirmationDialog(message, onConfirm, onCancel, options = {}) {
    showDialog(
        options.title || 'Confirm action',
        message,
        [
            {
                text: options.cancelText || 'Cancel',
                className: 'btn btn-secondary',
                onClick: onCancel,
            },
            {
                text: options.confirmText || 'Confirm',
                className: 'btn btn-primary',
                onClick: onConfirm,
            },
        ]
    );
}

function showMessageDialog(title, message, onClose, confirmText = 'OK') {
    showDialog(
        title,
        message,
        [
            {
                text: confirmText,
                className: 'btn btn-primary',
                onClick: onClose,
            },
        ]
    );
}

function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2800);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing app');
    
    // ===== HAMBURGER MENU INITIALIZATION =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    const nav = document.querySelector('nav');

    if (nav) {
        const updateNavShadow = () => {
            nav.classList.toggle('scrolled', window.scrollY > 8);
        };

        updateNavShadow();
        window.addEventListener('scroll', updateNavShadow, { passive: true });
    }

    if (hamburger && navLinks) {
        const setMenuState = (open) => {
            navLinks.classList.toggle('active', open);
            navLinks.classList.toggle('nav-open', open);
            if (nav) nav.classList.toggle('nav-open', open);
            hamburger.classList.toggle('active', open);
            hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (navOverlay) navOverlay.classList.toggle('active', open);
            document.body.style.overflow = open ? 'hidden' : '';
        };

        // Toggle menu on button click
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            setMenuState(!navLinks.classList.contains('active'));
        });

        // Close when a link inside nav is clicked
        navLinks.addEventListener('click', function(e) {
            if (e.target.closest('a')) setMenuState(false);
        });

        // Close when clicking on the overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', function() {
                setMenuState(false);
            });
        }

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
                showToast(`Thank you, ${name}! Your message has been received. We will get back to you soon at ${email}.`, 'success');
                contactForm.reset();
            }
        });
    }

    
    // ===== HIGHLIGHT ACTIVE PAGE =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.borderBottom = '2px solid white';
            link.style.paddingBottom = '5px';
        }
    });
});
