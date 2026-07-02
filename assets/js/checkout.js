const CheckoutManager = {
    init() {
        this.checkAuth();
        this.displayOrderSummary();
        this.setupPaymentToggle();
        this.setupCheckoutForm();
        this.prefillUserInfo();
    },

    checkAuth() {
        if (!AuthManager.isLoggedIn()) {
            showToast('Please login to continue with checkout!', 'error');
            window.location.href = 'login.html';
            return;
        }

        const user = AuthManager.getCurrentUser();
        if (!user.cart || user.cart.length === 0) {
            showToast('Your cart is empty! Please add items to your cart first.', 'error');
            window.location.href = 'products.html';
            return;
        }
    },

    displayOrderSummary() {
        const user = AuthManager.getCurrentUser();
        const itemsContainer = document.getElementById('checkout-items');
        
        if (!itemsContainer) return;

        if (!user.cart || user.cart.length === 0) {
            itemsContainer.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No items in cart</p>';
            return;
        }

        let summaryHTML = '<div class="checkout-items-list">';
        
        user.cart.forEach((item, index) => {
            const itemPrice = parseFloat(item.price.replace('₦', ''));
            const itemTotal = itemPrice * item.quantity;
            
            summaryHTML += `
                <div class="checkout-item">
                    <div class="checkout-item-number">${index + 1}</div>
                    <img src="${item.image}" alt="${item.name}">
                    <div class="checkout-item-info">
                        <h4>${item.name}</h4>
                        <p class="checkout-item-meta">
                            <span class="item-category">${item.category || 'Product'}</span>
                        </p>
                        <p class="checkout-item-pricing">
                            <span>${item.price} × ${item.quantity}</span>
                        </p>
                    </div>
                    <div class="checkout-item-price">₦${itemTotal.toFixed(2)}</div>
                </div>
            `;
        });
        
        summaryHTML += '</div>';
        itemsContainer.innerHTML = summaryHTML;

        this.updateTotals();
    },

    updateTotals() {
        const subtotal = CartManager.getCartTotal();
        const shipping = 10;
        const total = subtotal + shipping;
        const itemCount = CartManager.getItemCount();

        document.getElementById('checkout-subtotal').textContent = `₦${subtotal.toFixed(2)}`;
        document.getElementById('checkout-shipping').textContent = `₦${shipping.toFixed(2)}`;
        document.getElementById('checkout-total').textContent = `₦${total.toFixed(2)}`;
        
        // Update item count display
        const itemCountEl = document.querySelector('.checkout-item-count');
        if (itemCountEl) {
            itemCountEl.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
        }
    },

    setupPaymentToggle() {
        const paymentInputs = document.querySelectorAll('input[name="payment"]');
        
        paymentInputs.forEach(input => {
            input.addEventListener('change', function() {
                // Hide all payment details
                document.querySelectorAll('.payment-details').forEach(detail => {
                    detail.style.display = 'none';
                });
                
                // Show selected payment details
                const selectedDetails = document.getElementById(`${this.value}-details`);
                if (selectedDetails) {
                    selectedDetails.style.display = 'block';
                }
            });
        });
    },

    prefillUserInfo() {
        const user = AuthManager.getCurrentUser();
        if (!user) return;

        document.getElementById('full-name').value = user.name || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('email').value = user.email || '';
    },

    setupCheckoutForm() {
        const form = document.getElementById('checkout-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processOrder();
        });
    },

    processOrder() {
        const user = AuthManager.getCurrentUser();
        
        // Get form data
        const orderData = {
            fullName: document.getElementById('full-name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            notes: document.getElementById('notes').value,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value
        };

        // Validate
        if (!orderData.fullName || !orderData.phone || !orderData.address || !orderData.city) {
            showToast('Please fill in all required fields marked with *', 'error');
            return;
        }

        // Phone validation
        if (orderData.phone.length < 10) {
            showToast('Please enter a valid phone number', 'error');
            return;
        }

        // Confirm order
        const subtotal = CartManager.getCartTotal();
        const shipping = 10;
        const total = subtotal + shipping;
        const itemCount = CartManager.getItemCount();

        let paymentMethodName = '';
        let paymentIcon = '';
        switch(orderData.paymentMethod) {
            case 'momo': 
                paymentMethodName = 'Mobile Money (MoMo)'; 
                paymentIcon = '📱';
                break;
            case 'card': 
                paymentMethodName = 'Credit/Debit Card'; 
                paymentIcon = '💳';
                break;
            case 'cash': 
                paymentMethodName = 'Cash on Delivery'; 
                paymentIcon = '💵';
                break;
        }

        const confirmMessage = 
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `📦 CONFIRM YOUR ORDER\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `👤 Customer Details:\n` +
            `Name: ${orderData.fullName}\n` +
            `Phone: ${orderData.phone}\n` +
            `Email: ${orderData.email || 'Not provided'}\n\n` +
            `📍 Delivery Address:\n` +
            `${orderData.address}\n` +
            `${orderData.city}\n\n` +
            `🛍️ Order Summary:\n` +
            `Products: ${user.cart.length}\n` +
            `Total Items: ${itemCount}\n` +
            `Subtotal: ₦${subtotal.toFixed(2)}\n` +
            `Shipping: ₦${shipping.toFixed(2)}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `TOTAL: ₦${total.toFixed(2)}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `${paymentIcon} Payment: ${paymentMethodName}\n\n` +
            (orderData.notes ? `📝 Notes: ${orderData.notes}\n\n` : '') +
            `Place this order?`;

        showConfirmationDialog(
            confirmMessage,
            () => this.createOrder(orderData, total),
            () => showToast('Order confirmation cancelled', 'error'),
            { title: 'Confirm Order', confirmText: 'Place Order', cancelText: 'Cancel' }
        );
    },

    createOrder(orderData, total) {
        const user = AuthManager.getCurrentUser();
        const users = JSON.parse(localStorage.getItem('waymoreUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex === -1) return;

        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: [...user.cart],
            subtotal: CartManager.getCartTotal(),
            shipping: 10,
            total: total,
            status: 'Pending',
            itemCount: CartManager.getItemCount(),
            deliveryInfo: orderData,
            paymentMethod: orderData.paymentMethod
        };

        users[userIndex].orders = users[userIndex].orders || [];
        users[userIndex].orders.push(order);
        users[userIndex].cart = [];

        localStorage.setItem('waymoreUsers', JSON.stringify(users));
        localStorage.setItem('waymoreCurrentUser', JSON.stringify(users[userIndex]));

        // Create detailed success message
        let paymentInstructions = '';
        if (orderData.paymentMethod === 'momo') {
            paymentInstructions = 
                `\n━━━━━━━━━━━━━━━━━━━━━━\n` +
                `📱 MOMO PAYMENT INSTRUCTIONS\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `1. Send ₦${total.toFixed(2)} to:\n` +
                `   📞 0592805834\n\n` +
                `2. Reference Number:\n` +
                `   ORDER-${order.id}\n\n` +
                `3. Screenshot payment\n` +
                `4. Send via WhatsApp\n`;
        } else if (orderData.paymentMethod === 'card') {
            paymentInstructions = 
                `\n━━━━━━━━━━━━━━━━━━━━━━\n` +
                `💳 CARD PAYMENT\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `We will contact you shortly\n` +
                `with card payment details.\n`;
        } else {
            paymentInstructions = 
                `\n━━━━━━━━━━━━━━━━━━━━━━\n` +
                `💵 CASH ON DELIVERY\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `Prepare exact amount:\n` +
                `₦${total.toFixed(2)}\n` +
                `Payment upon delivery.\n`;
        }

        const successMessage = 
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `✅ ORDER PLACED SUCCESSFULLY!\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `📋 Order Details:\n` +
            `Order ID: ${order.id}\n` +
            `Date: ${new Date(order.date).toLocaleString()}\n\n` +
            `📦 Delivery To:\n` +
            `${orderData.fullName}\n` +
            `${orderData.address}\n` +
            `${orderData.city}\n` +
            `📞 ${orderData.phone}\n\n` +
            `💰 Total Amount: ₦${total.toFixed(2)}\n` +
            paymentInstructions +
            `\n━━━━━━━━━━━━━━━━━━━━━━\n` +
            `We'll contact you via:\n` +
            `📱 WhatsApp: ${orderData.phone}\n\n` +
            `Thank you for choosing\n` +
            `WAYMOORE! 🌿\n` +
            `━━━━━━━━━━━━━━━━━━━━━━`;

        showMessageDialog('Order placed successfully', successMessage, () => {
            sessionStorage.removeItem('checkoutData');
            CartManager.updateCartUI();
            window.location.href = 'products.html';
        }, 'Close');
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    CheckoutManager.init();
});
