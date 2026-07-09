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
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">Loading data...</td></tr>';
      
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

      // Render table (combine opportunities and favorites)
      const myOpportunities = data.myOpportunities || [];
      const myFavorites = data.myFavorites || [];
      
      const activities = [...myOpportunities, ...myFavorites].sort((a, b) => {
        const dateA = new Date(a.activity_type === 'favorited' ? a.favorited_at : a.created_at);
        const dateB = new Date(b.activity_type === 'favorited' ? b.favorited_at : b.created_at);
        return dateB - dateA; // Descending
      });
      
      // Store global activities for filtering
      window.dashboardActivities = activities;
      window.currentSortOrder = 'desc'; // default
      window.currentFilter = 'all'; // default
      window.currentTabStatus = 'approuvees'; // default tab
      
      applyFiltersAndSort();

    } catch (error) {
      console.error('Dashboard error:', error);
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--color-error); padding: 30px;">Error: ${error.message}</td></tr>`;
    }
  }

  function applyFiltersAndSort() {
    let filtered = [...(window.dashboardActivities || [])];
    
    // 1. Tab Status Filter (Approuvées, En attente, Expirées)
    // On considère que "Favoris" est toujours affiché, mais pour les "Publiées", on filtre selon l'onglet
    filtered = filtered.filter(item => {
      // Si ce n'est pas une publication (ex: favori), on peut choisir de l'afficher tout le temps
      // ou de l'associer à l'onglet "Approuvées" (actif par défaut). 
      // Faisons en sorte que les onglets filtrent le "statut" global de l'élément.
      const itemStatus = item.status || 'approved'; // Mock fallback si la BDD n'a pas de status
      
      if (window.currentTabStatus === 'approuvees') {
        return itemStatus === 'approved' || itemStatus === 'active';
      } else if (window.currentTabStatus === 'en attente') {
        return itemStatus === 'pending';
      } else if (window.currentTabStatus === 'expirees') {
        return itemStatus === 'expired' || itemStatus === 'inactive' || itemStatus === 'cancelled';
      }
      return true;
    });

    // 2. Search
    const searchTerm = (document.querySelector('.search-box input')?.value || '').toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(item => 
        (item.title && item.title.toLowerCase().includes(searchTerm)) || 
        (item.city && item.city.toLowerCase().includes(searchTerm))
      );
    }
    
    // 3. Type Filter (Bouton Filtrer)
    if (window.currentFilter !== 'all') {
      filtered = filtered.filter(item => item.activity_type === window.currentFilter);
    }
    
    // 4. Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.activity_type === 'favorited' ? a.favorited_at : a.created_at);
      const dateB = new Date(b.activity_type === 'favorited' ? b.favorited_at : b.created_at);
      return window.currentSortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    renderTable(filtered);
  }

  // Setup Event Listeners
  const searchInput = document.querySelector('.search-box input');
  if (searchInput) {
    searchInput.addEventListener('input', applyFiltersAndSort);
  }

  const sortBtn = document.querySelectorAll('.filter-btn')[1]; // Second button is Trier
  if (sortBtn) {
    sortBtn.addEventListener('click', () => {
      window.currentSortOrder = window.currentSortOrder === 'desc' ? 'asc' : 'desc';
      sortBtn.innerHTML = window.currentSortOrder === 'desc' ? '<i class="fa-solid fa-arrow-down-a-z"></i> Newest' : '<i class="fa-solid fa-arrow-up-a-z"></i> Oldest';
      applyFiltersAndSort();
    });
  }

  const filterBtn = document.querySelectorAll('.filter-btn')[0]; // First button is Filtrer
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      // Simple toggle between all, published, favorited
      if (window.currentFilter === 'all') {
        window.currentFilter = 'published';
        filterBtn.innerHTML = '<i class="fa-solid fa-upload"></i> Published';
      } else if (window.currentFilter === 'published') {
        window.currentFilter = 'favorited';
        filterBtn.innerHTML = '<i class="fa-solid fa-heart"></i> Favorites';
      } else {
        window.currentFilter = 'all';
        filterBtn.innerHTML = '<i class="fa-solid fa-filter"></i> All types';
      }
      applyFiltersAndSort();
    });
  }

  // Handle Tabs (Approuvées, En attente, Expirées)
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Remove active class from all
      tabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked
      tab.classList.add('active');
      
      // Update global tab status
      if (index === 0) window.currentTabStatus = 'approuvees';
      else if (index === 1) window.currentTabStatus = 'en attente';
      else if (index === 2) window.currentTabStatus = 'expirees';
      
      applyFiltersAndSort();
    });
  });

  function renderTable(activities) {
    if (!activities || activities.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: var(--color-text-muted);">No activity found.</td></tr>';
      return;
    }

    tableBody.innerHTML = '';
    
    activities.forEach((item, index) => {
      const tr = document.createElement('tr');
      
      // Select an icon and color based on type
      let icon = 'fa-briefcase';
      let color = 'var(--color-primary)';
      if (item.type === 'internship') { icon = 'fa-laptop-code'; color = '#2563eb'; }
      else if (item.type === 'competition') { icon = 'fa-trophy'; color = '#d97706'; }
      else if (item.type === 'training') { icon = 'fa-chalkboard-user'; color = '#16a34a'; }
      
      const isFavorite = item.activity_type === 'favorited';
      const actionText = isFavorite ? 'Favorited' : 'Published';
      const actionIcon = isFavorite ? '<i class="fa-solid fa-heart" style="color: #dc2626;"></i>' : '<i class="fa-solid fa-upload" style="color: #2563eb;"></i>';
      
      const dateStr = window.formatDate(isFavorite ? item.favorited_at : (item.created_at || item.createdAt || new Date()));

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>
          <div class="item-name">
            <div class="item-icon"><i class="fa-solid ${icon}" style="color: ${color};"></i></div>
            <div>
              ${item.title}
              <span class="item-subtext">${item.city || 'Location undefined'}</span>
            </div>
          </div>
        </td>
        <td>
          ${actionIcon} ${actionText}
        </td>
        <td>${dateStr}</td>
        <td>${window.formatType(item.type)}<span class="item-subtext">${item.field || ''}</span></td>
        <td><button class="action-btn"><i class="fa-solid fa-ellipsis"></i></button></td>
      `;
      tableBody.appendChild(tr);
    });
  }

  loadDashboard();
});
