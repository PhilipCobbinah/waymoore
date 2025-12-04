document.addEventListener('DOMContentLoaded', function() {
    if (!AuthManager.isLoggedIn()) {
        alert('Please login to view your orders!');
        window.location.href = 'login.html';
        return;
    }

    displayOrders();
});

function displayOrders() {
    const user = AuthManager.getCurrentUser();
    const ordersContainer = document.getElementById('orders-container');

    if (!ordersContainer) return;

    if (!user.orders || user.orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-box-open" style="font-size: 4rem; color: #d1d5db; margin-bottom: 1rem;"></i>
                <h3>No Orders Yet</h3>
                <p>You haven't placed any orders yet.</p>
                <a href="products.html" class="btn" style="margin-top: 1rem;">Start Shopping</a>
            </div>
        `;
        return;
    }

    ordersContainer.innerHTML = `
        <div class="orders-list">
            ${user.orders.reverse().map(order => {
                const orderDate = new Date(order.date);
                return `
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <h3><i class="fas fa-receipt"></i> Order #${order.id}</h3>
                                <p class="order-date">${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}</p>
                            </div>
                            <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
                        </div>
                        
                        <div class="order-items">
                            ${order.items.map((item, i) => {
                                const itemPrice = parseFloat(item.price.replace('₵', ''));
                                const itemTotal = itemPrice * item.quantity;
                                return `
                                    <div class="order-item">
                                        <span class="item-num">${i + 1}.</span>
                                        <span class="item-name">${item.name}</span>
                                        <span class="item-qty">×${item.quantity}</span>
                                        <span class="item-price">₵${itemTotal.toFixed(2)}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        
                        <div class="order-footer">
                            <div class="order-info">
                                <p><i class="fas fa-user"></i> ${order.deliveryInfo.fullName}</p>
                                <p><i class="fas fa-phone"></i> ${order.deliveryInfo.phone}</p>
                                <p><i class="fas fa-map-marker-alt"></i> ${order.deliveryInfo.address}, ${order.deliveryInfo.city}</p>
                                <p><i class="fas fa-credit-card"></i> ${getPaymentMethodName(order.paymentMethod)}</p>
                            </div>
                            <div class="order-total">
                                <p>Subtotal: ₵${order.subtotal.toFixed(2)}</p>
                                <p>Shipping: ₵${order.shipping.toFixed(2)}</p>
                                <p class="total"><strong>Total: ₵${order.total.toFixed(2)}</strong></p>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function getPaymentMethodName(method) {
    switch(method) {
        case 'momo': return 'Mobile Money';
        case 'card': return 'Card Payment';
        case 'cash': return 'Cash on Delivery';
        default: return method;
    }
}
