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
            alert('Please login to continue with checkout!');
            window.location.href = 'login.html';
            return;
        }

        const user = AuthManager.getCurrentUser();
        if (!user.cart || user.cart.length === 0) {
            alert('Your cart is empty!');
            window.location.href = 'products.html';
            return;
        }
    },

    displayOrderSummary() {
        const user = AuthManager.getCurrentUser();
        const itemsContainer = document.getElementById('checkout-items');
        
        if (!itemsContainer) return;

        itemsContainer.innerHTML = user.cart.map(item => {
            const itemPrice = parseFloat(item.price.replace('₵', ''));
            const itemTotal = itemPrice * item.quantity;
            
            return `
                <div class="checkout-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="checkout-item-info">
                        <h4>${item.name}</h4>
                        <p>Qty: ${item.quantity} × ${item.price}</p>
                    </div>
                    <div class="checkout-item-price">₵${itemTotal.toFixed(2)}</div>
                </div>
            `;
        }).join('');

        this.updateTotals();
    },

    updateTotals() {
        const subtotal = CartManager.getCartTotal();
        const shipping = 10;
        const total = subtotal + shipping;

        document.getElementById('checkout-subtotal').textContent = `₵${subtotal.toFixed(2)}`;
        document.getElementById('checkout-shipping').textContent = `₵${shipping.toFixed(2)}`;
        document.getElementById('checkout-total').textContent = `₵${total.toFixed(2)}`;
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
            alert('Please fill in all required fields!');
            return;
        }

        // Confirm order
        const subtotal = CartManager.getCartTotal();
        const shipping = 10;
        const total = subtotal + shipping;
        const itemCount = CartManager.getItemCount();

        let paymentMethodName = '';
        switch(orderData.paymentMethod) {
            case 'momo': paymentMethodName = 'Mobile Money (MoMo)'; break;
            case 'card': paymentMethodName = 'Credit/Debit Card'; break;
            case 'cash': paymentMethodName = 'Cash on Delivery'; break;
        }

        const confirmMessage = `Confirm Your Order:\n\n` +
            `Name: ${orderData.fullName}\n` +
            `Phone: ${orderData.phone}\n` +
            `Address: ${orderData.address}, ${orderData.city}\n\n` +
            `Items: ${user.cart.length} (${itemCount} total quantity)\n` +
            `Total: ₵${total.toFixed(2)}\n\n` +
            `Payment Method: ${paymentMethodName}\n\n` +
            `Place this order?`;

        if (!confirm(confirmMessage)) return;

        this.createOrder(orderData, total);
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

        // Create success message
        let paymentInstructions = '';
        if (orderData.paymentMethod === 'momo') {
            paymentInstructions = `\n\nMoMo Payment Instructions:\n` +
                `1. Send ₵${total.toFixed(2)} to: 0592805834\n` +
                `2. Use reference: ORDER-${order.id}\n` +
                `3. Screenshot and send via WhatsApp\n\n`;
        } else if (orderData.paymentMethod === 'card') {
            paymentInstructions = `\n\nCard Payment:\nWe will contact you with card payment details shortly.\n\n`;
        } else {
            paymentInstructions = `\n\nCash on Delivery:\nPrepare exact amount of ₵${total.toFixed(2)} for delivery.\n\n`;
        }

        const successMessage = `✅ Order Placed Successfully!\n\n` +
            `Order ID: ${order.id}\n` +
            `Date: ${new Date(order.date).toLocaleString()}\n\n` +
            `Delivery To:\n${orderData.fullName}\n` +
            `${orderData.address}, ${orderData.city}\n` +
            `Phone: ${orderData.phone}\n\n` +
            `Total Amount: ₵${total.toFixed(2)}\n` +
            paymentInstructions +
            `We'll contact you via WhatsApp (${orderData.phone}) to confirm your order.\n\n` +
            `Thank you for choosing WAYMOORE! 🌿`;

        alert(successMessage);
        
        CartManager.updateCartUI();
        window.location.href = 'products.html';
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    CheckoutManager.init();
});
