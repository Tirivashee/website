// WhatsApp Notification Modal
// Shows a notification when user adds items to cart, directing them to WhatsApp for orders

class WhatsAppNotification {
  constructor() {
    this.catalogueUrl = 'https://wa.me/c/263781457106';
    this.orderPhoneNumber = '263781457106';
    this.init();
  }

  init() {
    // Create modal if it doesn't exist
    if (!document.getElementById('whatsappNotificationModal')) {
      this.createModal();
    }
  }

  createModal() {
    const modalHTML = `
      <div class="whatsapp-notification-modal" id="whatsappNotificationModal">
        <div class="whatsapp-notification-content">
          <button class="modal-close" onclick="window.whatsappNotification?.closeModal()" aria-label="Close">×</button>
          
          <div class="notification-header">
            <img src="assets/images/whatsapplogo.jpg" alt="WhatsApp" class="whatsapp-logo-img">
          </div>

          <h2 id="whatsappModalHeading">Order via WhatsApp</h2>

          <p class="main-message" id="whatsappModalMessage">
            Adding to cart will help you organize items. For <strong>faster and better order processing</strong>, please use our WhatsApp Catalogue where our team can assist you directly.
          </p>

          <div class="notification-features">
            <div class="feature">
              <span class="feature-icon">✓</span>
              <span>Direct Support</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✓</span>
              <span>Instant Confirmation</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✓</span>
              <span>Real-time Chat</span>
            </div>
            <div class="feature">
              <span class="feature-icon">✓</span>
              <span>Custom Orders</span>
            </div>
          </div>

          <div class="notification-actions">
            <a href="${this.catalogueUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp" id="whatsappModalCta">
              OPEN WHATSAPP CATALOGUE
            </a>
            <button class="btn-secondary" onclick="window.whatsappNotification?.closeModal()">
              CONTINUE SHOPPING
            </button>
          </div>

          <p class="notification-footer" id="whatsappModalFooter">
            Your items have been added to your cart. Access them anytime, or reach out via WhatsApp for immediate assistance.
          </p>
        </div>
      </div>
    `;

    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    document.body.appendChild(modalElement.firstElementChild);
  }

  // Pass an order summary (e.g. built from the cart) to turn this into a
  // checkout CTA that links straight into a chat pre-filled with the order,
  // instead of the generic catalogue link shown after "Add to Cart".
  showModal(orderMessage) {
    const modal = document.getElementById('whatsappNotificationModal');
    if (!modal) return;

    const cta = document.getElementById('whatsappModalCta');
    const heading = document.getElementById('whatsappModalHeading');
    const message = document.getElementById('whatsappModalMessage');
    const footer = document.getElementById('whatsappModalFooter');

    if (orderMessage) {
      if (cta) {
        cta.href = `https://wa.me/${this.orderPhoneNumber}?text=${encodeURIComponent(orderMessage)}`;
        cta.textContent = 'SEND ORDER ON WHATSAPP';
      }
      if (heading) heading.textContent = 'Complete Your Order via WhatsApp';
      if (message) {
        message.innerHTML = 'Tap below to send your order details straight to our team on WhatsApp for <strong>faster and better order processing</strong>.';
      }
      if (footer) {
        footer.textContent = "We'll confirm availability, pricing, and delivery details with you directly on WhatsApp.";
      }
    } else {
      if (cta) {
        cta.href = this.catalogueUrl;
        cta.textContent = 'OPEN WHATSAPP CATALOGUE';
      }
      if (heading) heading.textContent = 'Order via WhatsApp';
      if (message) {
        message.innerHTML = 'Adding to cart will help you organize items. For <strong>faster and better order processing</strong>, please use our WhatsApp Catalogue where our team can assist you directly.';
      }
      if (footer) {
        footer.textContent = 'Your items have been added to your cart. Access them anytime, or reach out via WhatsApp for immediate assistance.';
      }
    }

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modal = document.getElementById('whatsappNotificationModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.whatsappNotification = new WhatsAppNotification();
  });
} else {
  window.whatsappNotification = new WhatsAppNotification();
}
