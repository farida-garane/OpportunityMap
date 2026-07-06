/**
 * dashboard.js
 * Fetches dashboard summary and user's published opportunities.
 */

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('.data-table tbody');

  async function loadDashboard() {
    if (!window.isAuthenticated()) {
      window.location.href = 'login.html';
      return;
    }

    try {
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">Chargement des données...</td></tr>';
      
      const response = await window.api.dashboard.getSummary();
      const data = response.data || response;
      
      // Update tabs count (assuming data contains counts)
      const counts = data.counts || { approved: 0, pending: 0, expired: 0 };
      const tabCounts = document.querySelectorAll('.tab-count');
      if (tabCounts.length >= 3) {
        tabCounts[0].textContent = counts.approved || 0;
        tabCounts[1].textContent = counts.pending || 0;
        tabCounts[2].textContent = counts.expired || 0;
      }

      // Render table (assuming data contains opportunities array)
      const opportunities = data.opportunities || [];
      renderTable(opportunities);

    } catch (error) {
      console.error('Erreur dashboard:', error);
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--color-error); padding: 30px;">Erreur : ${error.message}</td></tr>`;
    }
  }

  function renderTable(opportunities) {
    if (!opportunities || opportunities.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--color-text-muted);">Vous n\'avez publié aucune opportunité.</td></tr>';
      return;
    }

    tableBody.innerHTML = '';
    
    opportunities.forEach((opp, index) => {
      const tr = document.createElement('tr');
      
      // Select an icon and color based on type
      let icon = 'fa-briefcase';
      let color = 'var(--color-primary)';
      if (opp.type === 'internship') { icon = 'fa-laptop-code'; color = '#2563eb'; }
      else if (opp.type === 'competition') { icon = 'fa-trophy'; color = '#d97706'; }
      else if (opp.type === 'training') { icon = 'fa-chalkboard-user'; color = '#16a34a'; }
      
      // Mock status logic (assuming status exists, or randomly assigned for demo if missing)
      const status = opp.status || 'active';
      let statusHtml = '';
      if (status === 'active') statusHtml = '<span class="status-badge status-active">Active</span>';
      else if (status === 'pending') statusHtml = '<span class="status-badge status-suspended">En attente</span>';
      else statusHtml = '<span class="status-badge status-inactive">Expirée</span>';

      const dateStr = window.formatDate(opp.created_at || opp.createdAt || new Date());

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>
          <div class="item-name">
            <div class="item-icon"><i class="fa-solid ${icon}" style="color: ${color};"></i></div>
            <div>
              ${opp.title}
              <span class="item-subtext">${opp.city || 'Lieu non défini'}</span>
            </div>
          </div>
        </td>
        <td>
          Moi
          <span class="item-subtext">Auteur</span>
        </td>
        <td>${dateStr}</td>
        <td>${window.formatType(opp.type)}<span class="item-subtext">${opp.field || ''}</span></td>
        <td>${statusHtml}</td>
        <td><button class="action-btn"><i class="fa-solid fa-ellipsis"></i></button></td>
      `;
      tableBody.appendChild(tr);
    });
  }

  loadDashboard();
});
