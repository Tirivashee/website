// WhatsApp Notification Modal
// Shows a notification when user adds items to cart, directing them to WhatsApp for orders

class WhatsAppNotification {
  constructor() {
    this.whatsappUrl = 'https://wa.me/c/263781457106';
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

          <h2>Order via WhatsApp</h2>
          
          <p class="main-message">
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
            <a href="${this.whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp">
              OPEN WHATSAPP CATALOGUE
            </a>
            <button class="btn-secondary" onclick="window.whatsappNotification?.closeModal()">
              CONTINUE SHOPPING
            </button>
          </div>

          <p class="notification-footer">
            Your items have been added to your cart. Access them anytime, or reach out via WhatsApp for immediate assistance.
          </p>
        </div>
      </div>
    `;

    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    document.body.appendChild(modalElement.firstElementChild);
  }

  showModal() {
    const modal = document.getElementById('whatsappNotificationModal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
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
