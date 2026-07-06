/**
 * opportunities.js
 * Handles fetching, filtering, and displaying opportunities,
 * as well as handling the publish form and tabs.
 */

document.addEventListener('DOMContentLoaded', () => {
  const listContainer = document.getElementById('opportunities-list');
  const filterType = document.getElementById('filter-type');
  const filterField = document.getElementById('filter-field');
  const filterCity = document.getElementById('filter-city');
  
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  const addForm = document.getElementById('add-opportunity-form');
  const formError = document.getElementById('form-error');

  // --- TABS LOGIC ---
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.add('hidden'));

      // Add active to clicked
      btn.classList.add('active');
      const targetId = `tab-${btn.getAttribute('data-tab')}`;
      document.getElementById(targetId).classList.remove('hidden');
    });
  });

  // --- FETCH & RENDER OPPORTUNITIES ---
  async function loadOpportunities() {
    listContainer.innerHTML = '<p class="empty-state">Chargement des opportunités…</p>';

    const filters = {
      type: filterType.value,
      field: filterField.value,
      city: filterCity.value
    };

    try {
      // Clean empty filters
      Object.keys(filters).forEach(k => {
        if (!filters[k]) delete filters[k];
      });

      const response = await window.api.opportunities.getAll(filters);
      // The API might return { status: 'success', data: { opportunities: [...] } } or just an array.
      // Adjusting to typical standard REST response:
      const opportunities = response.data ? response.data.opportunities || response.data : response;

      renderOpportunities(opportunities);
      
      // Dispatch event for map.js to update markers
      window.dispatchEvent(new CustomEvent('opportunitiesLoaded', { detail: opportunities }));

    } catch (error) {
      listContainer.innerHTML = `<p class="empty-state" style="color: var(--color-error)">Erreur lors du chargement : ${error.message}</p>`;
    }
  }

  function renderOpportunities(opportunities) {
    if (!opportunities || opportunities.length === 0) {
      listContainer.innerHTML = '<p class="empty-state">Aucune opportunité trouvée pour ces critères.</p>';
      return;
    }

    listContainer.innerHTML = '';
    
    opportunities.forEach(opp => {
      const card = document.createElement('article');
      const badgeClass = `badge-${opp.type}`;
      
      card.innerHTML = `
        <span class="badge ${badgeClass}">${window.formatType(opp.type)}</span>
        <h3><a href="#" class="view-detail" data-id="${opp.id}">${opp.title}</a></h3>
        <p class="meta">
          <i class="fa-solid fa-location-dot"></i> ${opp.city} 
          &bull; 
          <i class="fa-solid fa-layer-group"></i> ${opp.field}
        </p>
        <p class="description">${opp.description}</p>
        <p class="deadline" style="color: var(--color-secondary); font-size: 0.85rem; margin-top: 10px;">
          <i class="fa-regular fa-clock"></i> Date limite : ${window.formatDate(opp.deadline)}
        </p>
        <div class="card-actions" style="margin-top: 16px; border-top: 1px solid var(--color-border); padding-top: 16px; display: flex; gap: 8px; align-items: center;">
          <button type="button" class="btn btn-outline btn-sm view-detail" data-id="${opp.id}">Voir les détails</button>
          ${window.isAuthenticated() ? `
          <button type="button" class="btn btn-secondary btn-sm add-favorite" data-id="${opp.id}" title="Ajouter aux favoris">
            <i class="fa-regular fa-bookmark"></i>
          </button>
          ` : ''}
        </div>
      `;
      listContainer.appendChild(card);
    });

    // Add event listeners to view detail buttons
    document.querySelectorAll('.view-detail').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        window.dispatchEvent(new CustomEvent('viewOpportunityDetail', { detail: id }));
      });
    });

    // Add event listeners to favorite buttons
    document.querySelectorAll('.add-favorite').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        const icon = e.currentTarget.querySelector('i');
        
        try {
          icon.className = 'fa-solid fa-spinner fa-spin';
          await window.api.favorites.add(id);
          icon.className = 'fa-solid fa-bookmark';
          icon.style.color = 'var(--color-secondary)';
          e.currentTarget.disabled = true;
          alert('Ajouté aux favoris !');
        } catch (error) {
          icon.className = 'fa-regular fa-bookmark';
          alert(error.message || "Erreur lors de l'ajout aux favoris.");
        }
      });
    });
  }

  // --- FILTERS LOGIC ---
  let debounceTimeout;
  const triggerLoad = () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(loadOpportunities, 300);
  };

  filterType.addEventListener('change', triggerLoad);
  filterField.addEventListener('change', triggerLoad);
  filterCity.addEventListener('input', triggerLoad);


  // --- PUBLISH FORM LOGIC ---
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formError.textContent = '';
      
      const submitBtn = addForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Publication...';
      submitBtn.disabled = true;

      const data = {
        title: document.getElementById('title').value,
        type: document.getElementById('type').value,
        description: document.getElementById('description').value,
        field: document.getElementById('field').value,
        city: document.getElementById('city').value,
        deadline: document.getElementById('deadline').value,
        link: document.getElementById('link').value
      };

      try {
        await window.api.opportunities.create(data);
        alert('Votre opportunité a été publiée avec succès !');
        addForm.reset();
        
        // Switch back to browse tab and reload
        document.querySelector('.tab-btn[data-tab="browse"]').click();
        loadOpportunities();
        
      } catch (error) {
        formError.textContent = error.message;
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Initial load
  loadOpportunities();
});
