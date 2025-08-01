document.addEventListener('DOMContentLoaded', () => {
    // Check if the map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Use dynamic coordinates if available, else default
    const defaultCoords = [51.505, -0.09];
    const coords = (typeof listingCoordinates !== 'undefined' && listingCoordinates) ? [listingCoordinates.lat, listingCoordinates.lng] : defaultCoords;

    // Initialize the map and set its view to the coordinates and zoom level
    const map = L.map('map').setView(coords, 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker at the coordinates
    L.marker(coords).addTo(map)
        .bindPopup('Listing location.')
        .openPopup();
});
