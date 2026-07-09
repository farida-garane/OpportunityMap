/**
 * profile.js
 * Fetches and displays the logged-in user's profile information.
 */

document.addEventListener('DOMContentLoaded', () => {
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');
  const profileCity = document.getElementById('profile-city');
  const profileField = document.getElementById('profile-field');
  const profileDate = document.getElementById('profile-date');
  const myOpportunities = document.getElementById('my-opportunities');

  async function loadProfile() {
    if (!window.isAuthenticated()) {
      window.location.href = 'login.html';
      return;
    }

    try {
      const response = await window.api.auth.getProfile();
      const user = response.data || response.user || response; // Depends on your backend shape
      
      if (profileName) profileName.textContent = user.name || 'Not provided';
      if (profileEmail) profileEmail.textContent = user.email || 'Not provided';
      if (profileCity) profileCity.textContent = user.city || 'Not provided';
      if (profileField) profileField.textContent = user.field || 'Not provided';
      if (profileDate) {
        profileDate.textContent = user.created_at || user.createdAt ? window.formatDate(user.created_at || user.createdAt) : 'Not available';
      }

      // Also load their opportunities if the dashboard endpoint can be reused
      // or if there is a specific /api/users/me/opportunities endpoint.
      // For now, let's fetch dashboard summary to get their opportunities.
      const dashResp = await window.api.dashboard.getSummary();
      const dashData = dashResp.data || dashResp;
      renderMyOpportunities(dashData.opportunities || []);

    } catch (error) {
      console.error(error);
      if (profileName) profileName.textContent = 'Loading error';
    }
  }

  function renderMyOpportunities(opportunities) {
    if (!myOpportunities) return;
    
    if (!opportunities || opportunities.length === 0) {
      myOpportunities.innerHTML = '<p class="empty-state">You have not published any opportunities.</p>';
      return;
    }

    myOpportunities.innerHTML = '';
    myOpportunities.classList.add('cards-grid');

    opportunities.forEach(opp => {
      const card = document.createElement('div');
      card.className = 'opportunity-card';
      const badgeClass = `badge-${opp.type || 'event'}`;
      
      card.innerHTML = `
        <span class="badge ${badgeClass}">${window.formatType(opp.type)}</span>
        <h3><a href="opportunities.html?id=${opp.id || opp._id}">${opp.title}</a></h3>
        <p class="meta">
          <i class="fa-solid fa-location-dot"></i> ${opp.city || 'Not specified'}
        </p>
        <p class="deadline" style="color: var(--color-secondary); font-size: 0.85rem; margin-top: 10px;">
          <i class="fa-regular fa-clock"></i> Deadline: ${opp.deadline ? window.formatDate(opp.deadline) : 'Not specified'}
        </p>
      `;
      myOpportunities.appendChild(card);
    });
  }

  loadProfile();

  // Handle Edit Profile button click (Demo behavior)
  const editBtn = document.getElementById('btn-edit-profile');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      alert("Profile modification is not yet available in this demo version.");
    });
  }
});
