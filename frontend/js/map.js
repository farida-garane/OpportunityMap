/**
 * map.js
 * Handles Leaflet map integration on the opportunities page.
 */

document.addEventListener('DOMContentLoaded', () => {
  const mapContainerId = 'map';
  
  // Create a placeholder div for the map inside the list or at the top of the container
  // We'll insert it dynamically above the filters if it doesn't exist
  let mapDiv = document.getElementById(mapContainerId);
  if (!mapDiv) {
    const listSection = document.getElementById('browse-list');
    if (listSection) {
      mapDiv = document.createElement('div');
      mapDiv.id = mapContainerId;
      // Insert right after the h1 or at the top of the browse section
      listSection.insertBefore(mapDiv, document.querySelector('.form-filters'));
    }
  }

  if (!mapDiv) return; // Exit if no map container

  // Initialize Map
  // Center on Ouagadougou, Burkina Faso
  const map = L.map(mapContainerId).setView([12.3714, -1.5197], 6);

  // Add CartoDB Positron tile layer (clean light map matching our luminous theme)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  const markersLayer = L.layerGroup().addTo(map);

  // Custom marker icon
  const customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: '<div class="marker-pulse"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  // Basic geocoding dictionary for demo purposes
  // A real app would use coordinates from the database or a geocoding API
  const cityCoords = {
    'ouagadougou': [12.3714, -1.5197],
    'bobo-dioulasso': [11.1771, -4.2979],
    'koudougou': [12.25, -2.3833],
    'ouahigouya': [13.5828, -2.4216],
    'kaya': [13.0917, -1.0844],
    'banfora': [10.6333, -4.7667],
    'dedougou': [12.4667, -3.4667],
    'tenkodogo': [11.78, -0.3697],
    'fada ngourma': [12.0622, 0.3578],
    'dori': [14.0354, -0.0345]
  };

  // Listen for the opportunities data loaded event from opportunities.js
  window.addEventListener('opportunitiesLoaded', (e) => {
    const opportunities = e.detail;
    
    // Clear existing markers
    markersLayer.clearLayers();

    if (!opportunities || opportunities.length === 0) return;

    const bounds = [];

    opportunities.forEach(opp => {
      if (!opp.city) return;
      
      const cityKey = opp.city.toLowerCase().trim();
      let coords = cityCoords[cityKey];
      
      // If city not found, add a bit of random offset to Ouagadougou center for display purposes
      if (!coords) {
        coords = [
          12.3714 + (Math.random() - 0.5) * 2,
          -1.5197 + (Math.random() - 0.5) * 2
        ];
      }

      // Add some random jitter if multiple items are in same city so markers don't overlap completely
      const jitterLat = coords[0] + (Math.random() - 0.5) * 0.02;
      const jitterLng = coords[1] + (Math.random() - 0.5) * 0.02;

      const marker = L.marker([jitterLat, jitterLng], { icon: customIcon })
        .bindPopup(`
          <div class="map-popup">
            <span class="badge badge-${opp.type}" style="font-size:0.65rem; padding: 2px 8px; margin-bottom: 6px; display:inline-block;">${window.formatType(opp.type)}</span>
            <h3 style="margin: 0 0 6px 0; font-size: 1rem;"><a href="#" onclick="window.dispatchEvent(new CustomEvent('viewOpportunityDetail', { detail: '${opp.id}' })); return false;">${opp.title}</a></h3>
            <p style="margin: 0; font-size: 0.85rem; color: #64748b;">${opp.field}</p>
          </div>
        `);
      
      markersLayer.addLayer(marker);
      bounds.push([jitterLat, jitterLng]);
    });

    // Fit map bounds to show all markers if any exist
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
    }
  });

});
