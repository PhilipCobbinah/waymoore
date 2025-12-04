const CartManager = {
    init() {
        this.updateCartUI();
        this.displayCartItems();
        this.setupCheckout();
    },

    addToCart(productId) {
        if (!AuthManager.isLoggedIn()) {
            alert('Please login to add items to cart!');
            window.location.href = 'login.html';
            return;
        }

        const user = AuthManager.getCurrentUser();
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            alert('Product not found!');
            return;
        }

        // Get user's cart
        const users = JSON.parse(localStorage.getItem('waymoreUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex === -1) return;

        // Check if product already in cart
        const cartItem = users[userIndex].cart.find(item => item.productId === productId);
        
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            users[userIndex].cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        // Update storage
        localStorage.setItem('waymoreUsers', JSON.stringify(users));
        localStorage.setItem('waymoreCurrentUser', JSON.stringify(users[userIndex]));

        alert(`${product.name} added to cart!`);
        this.updateCartUI();
        
        if (typeof closeModal === 'function') {
            closeModal();
        }
    },

    removeFromCart(productId) {
        if (!AuthManager.isLoggedIn()) return;

        if (!confirm('Remove this item from cart?')) return;

        const user = AuthManager.getCurrentUser();
        const users = JSON.parse(localStorage.getItem('waymoreUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex === -1) return;

        users[userIndex].cart = users[userIndex].cart.filter(item => item.productId !== productId);

        localStorage.setItem('waymoreUsers', JSON.stringify(users));
        localStorage.setItem('waymoreCurrentUser', JSON.stringify(users[userIndex]));

        this.updateCartUI();
        this.displayCartItems();
    },

    updateQuantity(productId, change) {
        if (!AuthManager.isLoggedIn()) return;

        const user = AuthManager.getCurrentUser();
        const users = JSON.parse(localStorage.getItem('waymoreUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex === -1) return;

        const cartItem = users[userIndex].cart.find(item => item.productId === productId);
        
        if (cartItem) {
            cartItem.quantity += change;
            
            if (cartItem.quantity <= 0) {
                this.removeFromCart(productId);
                return;
            }

            localStorage.setItem('waymoreUsers', JSON.stringify(users));
            localStorage.setItem('waymoreCurrentUser', JSON.stringify(users[userIndex]));

            this.updateCartUI();
            this.displayCartItems();
        }
    },

    getCartTotal() {
        if (!AuthManager.isLoggedIn()) return 0;

        const user = AuthManager.getCurrentUser();
        let total = 0;

        user.cart.forEach(item => {
            const price = parseFloat(item.price.replace('₵', ''));
            total += price * item.quantity;
        });

        return total;
    },

    getItemCount() {
        if (!AuthManager.isLoggedIn()) return 0;
        
        const user = AuthManager.getCurrentUser();
        return user.cart.reduce((sum, item) => sum + item.quantity, 0);
    },

    updateCartUI() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        if (AuthManager.isLoggedIn()) {
            const itemCount = this.getItemCount();
            
            cartCountElements.forEach(el => {
                el.textContent = itemCount;
                el.style.display = itemCount > 0 ? 'inline-flex' : 'none';
            });
        } else {
            cartCountElements.forEach(el => {
                el.textContent = '0';
                el.style.display = 'none';
            });
        }
    },

    displayCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        if (!cartItemsContainer) return;

        if (!AuthManager.isLoggedIn()) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #d1d5db; margin-bottom: 1rem;"></i>
                    <p>Please <a href="login.html">login</a> to view your cart.</p>
                </div>
            `;
            this.updateCartSummary();
            return;
        }

        const user = AuthManager.getCurrentUser();

        if (user.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #d1d5db; margin-bottom: 1rem;"></i>
                    <p>Your cart is empty.</p>
                    <a href="products.html" class="btn" style="margin-top: 1rem;">Start Shopping!</a>
                </div>
            `;
            this.updateCartSummary();
            return;
        }

        // Calculate totals for header
        const totalItems = user.cart.length;
        const totalQuantity = this.getItemCount();
        const subtotal = this.getCartTotal();

        cartItemsContainer.innerHTML = `
            <div class="cart-header">
                <div class="cart-header-left">
                    <h3><i class="fas fa-shopping-bag"></i> Your Cart Items</h3>
                    <p class="cart-stats">
                        <span class="stat-badge">${totalItems} ${totalItems === 1 ? 'Product' : 'Products'}</span>
                        <span class="stat-badge">${totalQuantity} ${totalQuantity === 1 ? 'Item' : 'Items'}</span>
                        <span class="stat-badge total">Total: ₵${subtotal.toFixed(2)}</span>
                    </p>
                </div>
            </div>
            
            <div class="cart-items-list">
                ${user.cart.map((item, index) => {
                    const itemPrice = parseFloat(item.price.replace('₵', ''));
                    const itemTotal = itemPrice * item.quantity;
                    
                    return `
                        <div class="cart-item">
                            <div class="cart-item-number">${index + 1}</div>
                            <img src="${item.image}" alt="${item.name}">
                            <div class="cart-item-details">
                                <h3>${item.name}</h3>
                                <p class="cart-item-category"><i class="fas fa-tag"></i> ${item.category || 'Product'}</p>
                                <p class="cart-item-price">
                                    <span class="price-label">Unit Price:</span> 
                                    <span class="price-value">${item.price}</span>
                                </p>
                            </div>
                            <div class="cart-item-quantity">
                                <label>Quantity:</label>
                                <div class="quantity-controls">
                                    <button class="qty-btn" onclick="CartManager.updateQuantity(${item.productId}, -1)" title="Decrease quantity">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <span class="quantity-display">${item.quantity}</span>
                                    <button class="qty-btn" onclick="CartManager.updateQuantity(${item.productId}, 1)" title="Increase quantity">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="cart-item-total">
                                <p class="item-total-label">Item Total</p>
                                <p class="item-total-price">₵${itemTotal.toFixed(2)}</p>
                                <p class="item-calculation">${item.quantity} × ₵${itemPrice.toFixed(2)}</p>
                            </div>
                            <button class="remove-btn" onclick="CartManager.removeFromCart(${item.productId})" title="Remove from cart">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        this.updateCartSummary();
    },

    updateCartSummary() {
        const subtotal = this.getCartTotal();
        const itemCount = this.getItemCount();
        const user = AuthManager.getCurrentUser();
        const uniqueProducts = user && user.cart ? user.cart.length : 0;
        const shipping = subtotal > 0 ? 10 : 0;
        const total = subtotal + shipping;

        const subtotalEl = document.getElementById('cart-subtotal');
        const shippingEl = document.getElementById('cart-shipping');
        const totalEl = document.getElementById('cart-total');

        if (subtotalEl) subtotalEl.textContent = `₵${subtotal.toFixed(2)}`;
        if (shippingEl) shippingEl.textContent = shipping > 0 ? `₵${shipping.toFixed(2)}` : 'FREE';
        if (totalEl) totalEl.textContent = `₵${total.toFixed(2)}`;

        // Update item count in summary
        const summaryItemCount = document.getElementById('summary-item-count');
        if (summaryItemCount) {
            summaryItemCount.innerHTML = `
                <i class="fas fa-shopping-bag"></i>
                <div>
                    <strong>${uniqueProducts}</strong> ${uniqueProducts === 1 ? 'Product' : 'Products'}<br>
                    <small>${itemCount} Total ${itemCount === 1 ? 'Item' : 'Items'}</small>
                </div>
            `;
        }

        // Update product list in summary
        const summaryProductList = document.getElementById('summary-product-list');
        if (summaryProductList && user && user.cart.length > 0) {
            summaryProductList.innerHTML = `
                <div class="summary-products">
                    <h3>Order Items:</h3>
                    ${user.cart.map((item, i) => {
                        const itemPrice = parseFloat(item.price.replace('₵', ''));
                        const itemTotal = itemPrice * item.quantity;
                        return `
                            <div class="summary-product-item">
                                <span class="item-num">${i + 1}.</span>
                                <span class="item-name">${item.name}</span>
                                <span class="item-qty">×${item.quantity}</span>
                                <span class="item-price">₵${itemTotal.toFixed(2)}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
    },

    setupCheckout() {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (!checkoutBtn) return;

        checkoutBtn.addEventListener('click', () => {
            if (!AuthManager.isLoggedIn()) {
                alert('Please login to checkout!');
                window.location.href = 'login.html';
                return;
            }

            const user = AuthManager.getCurrentUser();
            
            if (user.cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            // Redirect to checkout page
            window.location.href = 'checkout.html';
        });
    },

    createOrder(total) {
        const user = AuthManager.getCurrentUser();
        const users = JSON.parse(localStorage.getItem('waymoreUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex === -1) return;

        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: [...user.cart],
            subtotal: this.getCartTotal(),
            shipping: 10,
            total: total,
            status: 'Pending',
            itemCount: this.getItemCount()
        };

        users[userIndex].orders = users[userIndex].orders || [];
        users[userIndex].orders.push(order);
        users[userIndex].cart = [];

        localStorage.setItem('waymoreUsers', JSON.stringify(users));
        localStorage.setItem('waymoreCurrentUser', JSON.stringify(users[userIndex]));

        // Create detailed order message
        let orderDetails = `Order Placed Successfully!\n\n`;
        orderDetails += `Order ID: ${order.id}\n`;
        orderDetails += `Date: ${new Date(order.date).toLocaleString()}\n\n`;
        orderDetails += `Items Ordered:\n`;
        
        order.items.forEach(item => {
            const itemPrice = parseFloat(item.price.replace('₵', ''));
            const itemTotal = itemPrice * item.quantity;
            orderDetails += `• ${item.name} (×${item.quantity}): ₵${itemTotal.toFixed(2)}\n`;
        });
        
        orderDetails += `\nTotal Items: ${order.itemCount}\n`;
        orderDetails += `Total Amount: ₵${total.toFixed(2)}\n\n`;
        orderDetails += `We'll contact you shortly via WhatsApp (${user.phone || '0592805834'}) to confirm your order.\n\n`;
        orderDetails += `Thank you for choosing WAYMOORE!`;

        alert(orderDetails);
        
        this.updateCartUI();
        window.location.href = 'products.html';
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    CartManager.init();
});

// Make CartManager globally available
window.CartManager = CartManager;
