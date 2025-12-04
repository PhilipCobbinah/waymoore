// Authentication System
const AuthManager = {
    init() {
        this.setupAuthTabs();
        this.setupLoginForm();
        this.setupSignupForm();
        this.checkAuthStatus();
    },

    setupAuthTabs() {
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const tabName = this.getAttribute('data-tab');
                document.getElementById('login-form').style.display = tabName === 'login' ? 'block' : 'none';
                document.getElementById('signup-form').style.display = tabName === 'signup' ? 'block' : 'none';
            });
        });
    },

    setupLoginForm() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            this.login(email, password);
        });
    },

    setupSignupForm() {
        const form = document.getElementById('signupForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const phone = document.getElementById('signup-phone').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            this.signup(name, email, phone, password);
        });
    },

    login(email, password) {
        const users = JSON.parse(localStorage.getItem('waymoreUsers') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('waymoreCurrentUser', JSON.stringify(user));
            alert(`Welcome back, ${user.name}!`);
            window.location.href = 'products.html';
        } else {
            alert('Invalid email or password!');
        }
    },

    signup(name, email, phone, password) {
        const users = JSON.parse(localStorage.getItem('waymoreUsers') || '[]');
        
        if (users.find(u => u.email === email)) {
            alert('Email already registered!');
            return;
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            phone,
            password,
            cart: [],
            orders: []
        };

        users.push(newUser);
        localStorage.setItem('waymoreUsers', JSON.stringify(users));
        localStorage.setItem('waymoreCurrentUser', JSON.stringify(newUser));
        
        alert(`Account created successfully! Welcome, ${name}!`);
        window.location.href = 'products.html';
    },

    logout() {
        localStorage.removeItem('waymoreCurrentUser');
        window.location.href = 'index.html';
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('waymoreCurrentUser'));
    },

    isLoggedIn() {
        return !!this.getCurrentUser();
    },

    checkAuthStatus() {
        const userLink = document.getElementById('user-account-link');
        if (!userLink) return;

        if (this.isLoggedIn()) {
            const user = this.getCurrentUser();
            userLink.innerHTML = `<i class="fas fa-user-circle"></i> ${user.name.split(' ')[0]}`;
            userLink.href = '#';
            userLink.onclick = (e) => {
                e.preventDefault();
                this.showUserMenu();
            };
        } else {
            userLink.innerHTML = '<i class="fas fa-user"></i> Login';
            userLink.href = 'login.html';
        }
    },

    showUserMenu() {
        // Remove any existing menu
        const existingMenu = document.getElementById('user-menu-modal');
        if (existingMenu) {
            existingMenu.remove();
        }

        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'user-menu-modal';
        modal.className = 'account-menu-modal';
        
        const user = this.getCurrentUser();
        
        modal.innerHTML = `
            <div class="account-menu-content">
                <button class="menu-close" onclick="document.getElementById('user-menu-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="menu-header">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                </div>
                
                <div class="menu-options">
                    <button class="menu-btn view-orders-btn" onclick="AuthManager.goToOrders()">
                        <i class="fas fa-box"></i>
                        <span>View Orders</span>
                    </button>
                    
                    <button class="menu-btn logout-btn" onclick="AuthManager.confirmLogout()">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    },

    goToOrders() {
        document.getElementById('user-menu-modal').remove();
        window.location.href = 'orders.html';
    },

    confirmLogout() {
        // Close the account menu first
        document.getElementById('user-menu-modal').remove();
        
        // Create logout confirmation modal
        const modal = document.createElement('div');
        modal.id = 'logout-confirm-modal';
        modal.className = 'account-menu-modal';
        
        modal.innerHTML = `
            <div class="account-menu-content logout-confirm">
                <div class="confirm-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Confirm Logout</h3>
                <p>Are you sure you want to logout?</p>
                
                <div class="confirm-buttons">
                    <button class="btn btn-cancel" onclick="document.getElementById('logout-confirm-modal').remove()">
                        <i class="fas fa-times"></i> No, Stay
                    </button>
                    <button class="btn btn-confirm" onclick="AuthManager.performLogout()">
                        <i class="fas fa-check"></i> Yes, Logout
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    },

    performLogout() {
        document.getElementById('logout-confirm-modal').remove();
        this.logout();
    },

    logout() {
        localStorage.removeItem('waymoreCurrentUser');
        alert('You have been logged out successfully!');
        window.location.href = 'index.html';
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('waymoreCurrentUser'));
    },

    isLoggedIn() {
        return !!this.getCurrentUser();
    },

    checkAuthStatus() {
        const userLink = document.getElementById('user-account-link');
        if (!userLink) return;

        if (this.isLoggedIn()) {
            const user = this.getCurrentUser();
            userLink.innerHTML = `<i class="fas fa-user-circle"></i> ${user.name.split(' ')[0]}`;
            userLink.href = '#';
            userLink.onclick = (e) => {
                e.preventDefault();
                this.showUserMenu();
            };
        } else {
            userLink.innerHTML = '<i class="fas fa-user"></i> Login';
            userLink.href = 'login.html';
        }
    },

    showUserMenu() {
        // Remove any existing menu
        const existingMenu = document.getElementById('user-menu-modal');
        if (existingMenu) {
            existingMenu.remove();
        }

        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'user-menu-modal';
        modal.className = 'account-menu-modal';
        
        const user = this.getCurrentUser();
        
        modal.innerHTML = `
            <div class="account-menu-content">
                <button class="menu-close" onclick="document.getElementById('user-menu-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="menu-header">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                </div>
                
                <div class="menu-options">
                    <button class="menu-btn view-orders-btn" onclick="AuthManager.goToOrders()">
                        <i class="fas fa-box"></i>
                        <span>View Orders</span>
                    </button>
                    
                    <button class="menu-btn logout-btn" onclick="AuthManager.confirmLogout()">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    },

    goToOrders() {
        document.getElementById('user-menu-modal').remove();
        window.location.href = 'orders.html';
    },

    confirmLogout() {
        // Close the account menu first
        document.getElementById('user-menu-modal').remove();
        
        // Create logout confirmation modal
        const modal = document.createElement('div');
        modal.id = 'logout-confirm-modal';
        modal.className = 'account-menu-modal';
        
        modal.innerHTML = `
            <div class="account-menu-content logout-confirm">
                <div class="confirm-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Confirm Logout</h3>
                <p>Are you sure you want to logout?</p>
                
                <div class="confirm-buttons">
                    <button class="btn btn-cancel" onclick="document.getElementById('logout-confirm-modal').remove()">
                        <i class="fas fa-times"></i> No, Stay
                    </button>
                    <button class="btn btn-confirm" onclick="AuthManager.performLogout()">
                        <i class="fas fa-check"></i> Yes, Logout
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    },

    performLogout() {
        document.getElementById('logout-confirm-modal').remove();
        this.logout();
    },

    logout() {
        localStorage.removeItem('waymoreCurrentUser');
        alert('You have been logged out successfully!');
        window.location.href = 'index.html';
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.init();
});

// Make AuthManager globally available
window.AuthManager = AuthManager;
