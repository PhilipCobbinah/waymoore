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
        const action = confirm('View Orders (OK) or Logout (Cancel)?');
        if (action) {
            window.location.href = 'orders.html';
        } else {
            if (confirm('Are you sure you want to logout?')) {
                this.logout();
            }
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.init();
});

// Make AuthManager globally available
window.AuthManager = AuthManager;
