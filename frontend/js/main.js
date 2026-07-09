/**
 * main.js — Global Scripts for OpportuniMap
 * Handles Navbar UI state based on authentication.
 */

document.addEventListener('DOMContentLoaded', async () => {
  
  // 1. Check Authentication State
  const isLoggedIn = window.isAuthenticated();
  
  // Elements
  const authOnlyElements = document.querySelectorAll('.auth-only');
  const guestOnlyElements = document.querySelectorAll('.guest-only');
  const logoutBtn = document.getElementById('logout-btn');

  // Update UI based on auth state
  if (isLoggedIn) {
    // Show auth-only, hide guest-only
    authOnlyElements.forEach(el => el.classList.remove('hidden'));
    guestOnlyElements.forEach(el => el.classList.add('hidden'));
    
    // Verify token is still valid by fetching profile silently
    try {
      await window.api.auth.getProfile();
      
      // Mettre à jour les badges du menu
      const summaryRes = await window.api.dashboard.getSummary();
      const summary = summaryRes.data || summaryRes;
      
      // Le badge "Tableau de bord" peut représenter le total des opportunités publiées
      const dashboardLinks = document.querySelectorAll('a[href="dashboard.html"] .menu-badge');
      dashboardLinks.forEach(badge => badge.textContent = summary.myOpportunitiesCount || 0);
      
      // Le badge "Favoris"
      const favLinks = document.querySelectorAll('a[href="favorites.html"] .menu-badge');
      favLinks.forEach(badge => badge.textContent = summary.favoritesCount || 0);

      // Si vous avez un badge de notifications
      const notifLinks = document.querySelectorAll('a[href="notifications.html"] .menu-badge');
      notifLinks.forEach(badge => badge.textContent = summary.unreadNotificationsCount || 0);

    } catch (err) {
      // If token is invalid/expired, log out automatically
      console.warn("Session expirée ou invalide.");
      window.api.auth.logout();
    }
  } else {
    // Show guest-only, hide auth-only
    authOnlyElements.forEach(el => el.classList.add('hidden'));
    guestOnlyElements.forEach(el => el.classList.remove('hidden'));
  }

  // 2. Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.api.auth.logout();
    });
  }

  // 3. Navbar background blur on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
      } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
      }
    });
  }
});

/**
 * Utility function to format dates
 */
window.formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Utility function to get human-readable opportunity type
 */
window.formatType = (type) => {
  if (!type) return 'Other';
  const types = {
    internship: 'Internship',
    competition: 'Competition',
    training: 'Training',
    event: 'Event'
  };
  return types[type] || type;
};

/**
 * Utility function to format city (strip neighborhood info for demo)
 */
window.formatCity = (cityString) => {
  if (!cityString) return 'Unknown';
  // Extracts "Ouagadougou" from "Ouagadougou - Dassasgho"
  return cityString.split('-')[0].trim();
};
