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
  if (!dateString) return 'Non spécifiée';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Date invalide';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
};

/**
 * Utility function to get human-readable opportunity type
 */
window.formatType = (type) => {
  if (!type) return 'Autre';
  const types = {
    internship: 'Stage',
    competition: 'Concours',
    training: 'Formation',
    event: 'Événement'
  };
  return types[type] || type;
};
