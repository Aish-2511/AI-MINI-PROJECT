// Toast Notification System
const Toast = {
  show: function(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    
    let icon = 'fa-circle-info';
    let bg = 'var(--primary-color)';
    if (type === 'success') { icon = 'fa-circle-check'; bg = 'var(--accent-mint)'; }
    if (type === 'warning') { icon = 'fa-triangle-exclamation'; bg = 'var(--accent-yellow)'; }
    if (type === 'error') { icon = 'fa-circle-xmark'; bg = 'var(--accent-pink)'; }

    toast.style.cssText = `
      background: var(--bg-card);
      color: var(--text-main);
      padding: 14px 20px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      border-left: 5px solid ${bg};
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      font-size: 0.9rem;
      pointer-events: auto;
      animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: ${bg}; font-size: 1.1rem;"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};
