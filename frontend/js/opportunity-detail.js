/**
 * opportunity-detail.js
 * Handles fetching and displaying a single opportunity in the detail view.
 */

document.addEventListener('DOMContentLoaded', () => {
  const browseList = document.getElementById('browse-list');
  const browseDetail = document.getElementById('browse-detail');
  const detailContainer = document.getElementById('opportunity-detail');
  const backBtn = document.getElementById('back-to-list-btn');
  let detailMapInstance = null;

  // Listen for the custom event emitted from opportunities.js or map.js
  window.addEventListener('viewOpportunityDetail', async (e) => {
    const oppId = e.detail;
    
    // Switch views
    browseList.classList.add('hidden');
    browseDetail.classList.remove('hidden');
    
    // Show loading
    detailContainer.innerHTML = '<p class="loading" style="text-align: center; padding: 40px; color: var(--color-text-muted);">Loading details...</p>';

    try {
      const data = await window.api.opportunities.getById(oppId);
      // Backend may wrap in data object depending on implementation
      const opp = data.data ? data.data.opportunity || data.data : data;
      renderDetail(opp);
    } catch (error) {
      detailContainer.innerHTML = `<p style="color: var(--color-error); text-align: center;">Error: ${error.message}</p>`;
    }
  });

  // Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      browseDetail.classList.add('hidden');
      browseList.classList.remove('hidden');
    });
  }

  function renderDetail(opp) {
    if (!opp) {
      detailContainer.innerHTML = '<p>Opportunity not found.</p>';
      return;
    }

    const badgeClass = `badge-${opp.type}`;
    const deadlineText = opp.deadline ? window.formatDate(opp.deadline) : 'Not specified';

    detailContainer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
        <div>
          <span class="badge ${badgeClass}">${window.formatType(opp.type)}</span>
          <h2>${opp.title}</h2>
          <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 24px;">
            <i class="fa-solid fa-location-dot"></i> ${window.formatCity(opp.city)} &nbsp;&bull;&nbsp; 
            <i class="fa-solid fa-layer-group"></i> ${opp.field}
          </p>
        </div>
        
        <div style="display: flex; gap: 12px;">
          ${window.isAuthenticated() ? `
            <button class="btn btn-secondary add-favorite" data-id="${opp.id}">
              <i class="fa-regular fa-bookmark"></i> Save
            </button>
          ` : ''}
          ${opp.link ? `
            <a href="${opp.link}" target="_blank" class="btn btn-primary">
              Apply / Visit site <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          ` : ''}
        </div>
      </div>

      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--color-border);">
        <h3 style="font-size: 1.1rem; margin-bottom: 12px;">Description</h3>
        <p style="white-space: pre-wrap; color: var(--color-text); line-height: 1.7;">${opp.description}</p>
      </div>

      <div style="margin-top: 32px; background: var(--color-bg); padding: 16px 24px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
        <p style="margin: 0; color: var(--color-primary-dark); font-weight: 600;">
          <i class="fa-regular fa-clock"></i> Application deadline: ${deadlineText}
        </p>
      </div>

      <div style="margin-top: 24px;">
        <h3 style="font-size: 1.1rem; margin-bottom: 12px;">Localisation (Ville)</h3>
        <div id="detail-map" style="height: 250px; width: 100%; border-radius: var(--radius-md); background: #f1f5f9;"></div>
      </div>
    `;

    // Add favorite logic if button exists
    const favBtn = detailContainer.querySelector('.add-favorite');
    if (favBtn) {
      favBtn.addEventListener('click', async () => {
        try {
          // Change icon to solid while waiting
          favBtn.innerHTML = '<i class="fa-solid fa-bookmark"></i> Adding...';
          await window.api.favorites.add(opp.id);
          favBtn.innerHTML = '<i class="fa-solid fa-bookmark" style="color: var(--color-secondary);"></i> Saved';
          favBtn.disabled = true;
          alert('Added to favorites!');
        } catch (err) {
          favBtn.innerHTML = '<i class="fa-regular fa-bookmark"></i> Save';
          alert(err.message);
        }
      });
    }

    // Initialize map
    if (detailMapInstance) {
      detailMapInstance.remove();
      detailMapInstance = null;
    }

    const cityKey = opp.city ? opp.city.toLowerCase().trim() : '';
    let coords = window.cityCoords && window.cityCoords[cityKey];
    
    // Fuzzy match if exact is not found (e.g. "Ouagadougou - Dassasgho")
    if (!coords && window.cityCoords && cityKey) {
      for (const key of Object.keys(window.cityCoords)) {
        if (cityKey.includes(key)) {
          coords = window.cityCoords[key];
          break;
        }
      }
    }
    
    if (coords) {
      detailMapInstance = L.map('detail-map', {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false
      }).setView(coords, 6);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap & CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(detailMapInstance);

      // Custom marker icon
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: '<div class="marker-pulse"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      L.marker(coords, { icon: customIcon }).addTo(detailMapInstance)
        .bindPopup(`<b>${window.formatCity(opp.city)}</b><br><span style="font-size: 0.8rem; color: #64748b;">City location (demo data)</span>`)
        .openPopup();
    } else {
      const mapDiv = document.getElementById('detail-map');
      if (mapDiv) {
        mapDiv.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--color-text-muted);">Map not available for this city.</p>';
      }
    }
  }
});
