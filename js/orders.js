// Order Management System
// Handles order submission and management

class OrderManager {
  constructor() {
    this.currentOrder = null;
  }

  async createOrder(orderData) {
    try {
      const userId = window.authManager?.getUserId();
      
      if (!userId) {
        throw new Error('User must be authenticated to place an order');
      }

      // Prepare order data
      const order = {
        user_id: userId,
        user_email: window.authManager.getUserEmail(),
        user_name: orderData.full_name,
        phone: orderData.phone,
        address_line1: orderData.address_line1,
        address_line2: orderData.address_line2 || null,
        city: orderData.city,
        postal_code: orderData.postal_code || null,
        country: orderData.country || 'Zimbabwe',
        order_items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping || 0,
        total: orderData.total,
        status: 'pending',
        notes: orderData.notes || null,
        created_at: new Date().toISOString()
      };

      // Insert order into database
      const { data, error } = await supabaseClient
        .from('orders')
        .insert([order])
        .select();

      if (error) throw error;

      this.currentOrder = data[0];

      // Insert order items
      if (data[0] && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          order_id: data[0].id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          price: item.price,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null
        }));

        const { error: itemsError } = await supabaseClient
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // Clear cart after successful order
      if (window.cartManager) {
        await window.cartManager.clearCart();
      }

      return { success: true, order: data[0] };
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, error: error.message };
    }
  }

  async getOrderById(orderId) {
    try {
      const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return { success: true, order: data };
    } catch (error) {
      console.error('Error fetching order:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserOrders() {
    try {
      const userId = window.authManager?.getUserId();
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, orders: data };
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return { success: false, error: error.message };
    }
  }

  async getAllOrders() {
    // Admin only - fetch all orders
    try {
      const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, orders: data };
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return { success: false, error: error.message };
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const { data, error } = await supabaseClient
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select();

      if (error) throw error;
      return { success: true, order: data[0] };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }
  }

  formatOrderStatus(status) {
    const statusMap = {
      'pending': 'Pending Review',
      'confirmed': 'Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status) {
    const colorMap = {
      'pending': '#FF9800',
      'confirmed': '#2196F3',
      'processing': '#9C27B0',
      'shipped': '#00BCD4',
      'delivered': '#4CAF50',
      'cancelled': '#F44336'
    };
    return colorMap[status] || '#666';
  }
}

// Initialize Order Manager
if (typeof window !== 'undefined') {
  window.orderManager = new OrderManager();
}
