/**
 * notifications.js
 * Handles fetching, displaying, and marking notifications as read.
 */

document.addEventListener('DOMContentLoaded', () => {
  const listContainer = document.getElementById('notifications-list');
  const emptyState = document.getElementById('empty-state');
  const markAllBtn = document.getElementById('mark-all-read');

  async function loadNotifications() {
    if (!window.isAuthenticated()) {
      window.location.href = 'login.html';
      return;
    }

    try {
      const response = await window.api.notifications.getAll();
      const notifications = response.data || response;

      if (!notifications || notifications.length === 0) {
        showEmptyState();
      } else {
        renderNotifications(notifications);
      }
    } catch (error) {
      console.error(error);
      listContainer.innerHTML = `<p style="color: var(--color-error); text-align: center;">Erreur lors du chargement des notifications.</p>`;
    }
  }

  function showEmptyState() {
    listContainer.innerHTML = '';
    listContainer.style.display = 'none';
    emptyState.style.display = 'block';
    if (markAllBtn) markAllBtn.style.display = 'none';
  }

  function renderNotifications(notifications) {
    emptyState.style.display = 'none';
    listContainer.style.display = 'flex'; // it's a flex column
    listContainer.innerHTML = '';
    if (markAllBtn) markAllBtn.style.display = 'inline-block';

    notifications.forEach(notif => {
      const item = document.createElement('div');
      item.className = `notification-item ${notif.is_read ? '' : 'unread'}`;
      
      // Icon mapping based on notification type
      let iconHtml = '<i class="fa-solid fa-bell" style="margin-right: 0.5rem; color: var(--color-text-muted);"></i>';
      if (notif.type === 'opportunity_approved') {
        iconHtml = '<i class="fa-solid fa-check-circle" style="margin-right: 0.5rem; color: var(--color-success);"></i>';
      } else if (notif.type === 'new_match') {
        iconHtml = '<i class="fa-solid fa-briefcase" style="margin-right: 0.5rem; color: var(--color-primary);"></i>';
      } else if (notif.type === 'system') {
        iconHtml = '<i class="fa-solid fa-hand-wave" style="margin-right: 0.5rem; color: var(--color-accent);"></i>';
      }

      const dateStr = window.formatDate(notif.created_at || notif.createdAt || new Date());

      item.innerHTML = `
        <p>${iconHtml} ${notif.message}</p>
        <time>${dateStr}</time>
      `;

      // If unread, click to mark as read
      if (!notif.is_read) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', async () => {
          try {
            await window.api.notifications.markAsRead(notif.id);
            item.classList.remove('unread');
            item.style.cursor = 'default';
          } catch (err) {
            console.error('Impossible de marquer comme lu', err);
          }
        });
      }

      listContainer.appendChild(item);
    });
  }

  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      // Logic to mark all as read would be a specific API endpoint, e.g. /api/notifications/read-all
      // For now, let's just visually mark them in the UI if there is no endpoint
      document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
      });
      alert('Toutes les notifications ont été marquées comme lues.');
    });
  }

  loadNotifications();
});
