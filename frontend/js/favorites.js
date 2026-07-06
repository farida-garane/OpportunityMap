/**
 * favorites.js
 * Handles fetching, displaying, and removing favorite opportunities for the logged-in user.
 */

document.addEventListener('DOMContentLoaded', () => {
  const listContainer = document.getElementById('favorites-list');
  const emptyState = document.getElementById('empty-state');
  const resultsCount = document.getElementById('results-count');

  async function loadFavorites() {
    if (!window.isAuthenticated()) {
      window.location.href = 'login.html';
      return;
    }

    try {
      const response = await window.api.favorites.getAll();
      const favorites = response.data ? response.data.favorites || response.data : response;

      if (!favorites || favorites.length === 0) {
        showEmptyState();
      } else {
        renderFavorites(favorites);
      }
    } catch (error) {
      console.error(error);
      listContainer.innerHTML = `<p style="color: var(--color-error); text-align: center;">Erreur lors du chargement des favoris.</p>`;
    }
  }

  function showEmptyState() {
    listContainer.innerHTML = '';
    listContainer.style.display = 'none';
    emptyState.style.display = 'block';
    resultsCount.textContent = '0 opportunité sauvegardée';
  }

  function renderFavorites(favorites) {
    emptyState.style.display = 'none';
    listContainer.style.display = 'grid'; // .cards-grid is a grid
    listContainer.innerHTML = '';

    const count = favorites.length;
    resultsCount.textContent = `${count} opportunité${count > 1 ? 's' : ''} sauvegardée${count > 1 ? 's' : ''}`;

    favorites.forEach(fav => {
      // Depending on backend structure, fav might be the Favorite object including the Opportunity,
      // or directly the Opportunity. Let's assume the API returns the Opportunity data.
      // If it returns { id, opportunity: { title, ... } } we adjust.
      const opp = fav.opportunity || fav; 
      // The favorite ID vs Opportunity ID might differ.
      const oppId = opp.id || opp._id || fav.opportunity_id;

      const card = document.createElement('div');
      card.className = 'opportunity-card';
      
      const badgeClass = `badge-${opp.type || 'event'}`;
      
      card.innerHTML = `
        <span class="badge ${badgeClass}">${window.formatType(opp.type || 'Autre')}</span>
        <h3><a href="opportunities.html?id=${oppId}">${opp.title}</a></h3>
        <p class="meta">
          <i class="fa-solid fa-location-dot"></i> ${opp.city || 'Non spécifié'} 
          &bull; 
          <i class="fa-solid fa-layer-group"></i> ${opp.field || 'Général'}
        </p>
        <p class="description">${opp.description ? opp.description.substring(0, 100) + '...' : ''}</p>
        <p class="deadline" style="color: var(--color-secondary); font-size: 0.85rem; margin-top: 10px;">
          <i class="fa-regular fa-clock"></i> Limite : ${opp.deadline ? window.formatDate(opp.deadline) : 'Non spécifiée'}
        </p>
        <div class="card-actions" style="margin-top: 16px; border-top: 1px solid var(--color-border); padding-top: 16px;">
          <a href="opportunities.html?id=${oppId}" class="btn btn-outline btn-sm">Détails</a>
          <button type="button" class="btn btn-secondary btn-sm remove-favorite" data-id="${oppId}" title="Retirer des favoris">
            <i class="fa-solid fa-trash"></i> Retirer
          </button>
        </div>
      `;
      
      listContainer.appendChild(card);
    });

    // Add remove listeners
    document.querySelectorAll('.remove-favorite').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        e.currentTarget.disabled = true;
        e.currentTarget.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        
        try {
          await window.api.favorites.remove(id);
          // Reload list
          loadFavorites();
        } catch (err) {
          alert('Erreur lors de la suppression : ' + err.message);
          e.currentTarget.disabled = false;
        }
      });
    });
  }

  // Load initially
  loadFavorites();
});
