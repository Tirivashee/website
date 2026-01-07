// Notification System for BALLYLIKE
// Brutalist-themed notification display

class NotificationManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.className = 'notification-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('notification-container');
    }
  }

  show(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Create notification content
    const icon = this.getIcon(type);
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    const iconEl = document.createElement('div');
    iconEl.className = 'notification-icon';
    iconEl.innerHTML = icon;
    
    const messageEl = document.createElement('div');
    messageEl.className = 'notification-message';
    messageEl.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.onclick = () => this.hide(notification);
    
    content.appendChild(iconEl);
    content.appendChild(messageEl);
    notification.appendChild(content);
    notification.appendChild(closeBtn);
    
    // Add to container
    this.container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => this.hide(notification), duration);
    }
    
    return notification;
  }

  hide(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '!',
      info: 'i'
    };
    return icons[type] || icons.info;
  }

  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }

  // Show multiple messages at once
  showMultiple(messages, type = 'error', duration = 7000) {
    const message = Array.isArray(messages) ? messages.join('\n') : messages;
    return this.show(message, type, duration);
  }
}

// Initialize global notification manager
if (typeof window !== 'undefined') {
  window.notificationManager = new NotificationManager();
}
