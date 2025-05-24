// Initialize map centered on Bernardinus College
const map = L.map('kaart', {
    zoomControl: false
}).setView([50.882036, 5.984278], 17);

// Add zoom control to bottom right
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: ' OpenStreetMap contributors'
}).addTo(map);

// Add user location functionality
let userLocationMarker = null;
let userLocationCircle = null;
let allMarkers = [];
let initialBoundsFit = false;

// Function to fit bounds of all markers including user location
function fitAllMarkers() {
    if (allMarkers.length === 0 || initialBoundsFit) return;

    const bounds = L.latLngBounds(allMarkers.map(marker => marker.getLatLng()));
    
    // Add user location to bounds if available
    if (userLocationMarker) {
        bounds.extend(userLocationMarker.getLatLng());
    }

    // Fit the map to the bounds with some padding
    map.fitBounds(bounds, {
        padding: [50, 50],  // Add 50 pixels padding on all sides
        maxZoom: 17         // Don't zoom in too far
    });

    // Mark that we've done the initial bounds fitting
    initialBoundsFit = true;
}

function onLocationFound(e) {
    const radius = e.accuracy / 2;

    // Remove previous location marker and circle if they exist
    if (userLocationMarker) {
        map.removeLayer(userLocationMarker);
        map.removeLayer(userLocationCircle);
    }

    // Add a marker for the user's location
    userLocationMarker = L.marker(e.latlng, {
        icon: L.icon({
            iconUrl: 'img/locatie.gif',
            iconSize: [40, 40],  // Aangepaste grootte voor de GIF
            iconAnchor: [20, 20] // Centreer het icoon
        })
    }).addTo(map);

    // Add a circle showing the accuracy radius
    userLocationCircle = L.circle(e.latlng, radius, {
        color: '#3ea2dd',      // Blauwe kleur die past bij de website
        fillColor: '#3ea2dd',
        fillOpacity: 0.2
    }).addTo(map);

    // Only fit bounds if this is the first time we're getting location
    fitAllMarkers();
}

function onLocationError(e) {
    console.error('Error finding location:', e);
    let errorMessage = 'Kon je locatie niet vinden. ';
    
    switch(e.code) {
        case 1: // PERMISSION_DENIED
            errorMessage += 'Geef toestemming voor locatietoegang in je browser.';
            break;
        case 2: // POSITION_UNAVAILABLE
            errorMessage += 'Je locatie is momenteel niet beschikbaar.';
            break;
        case 3: // TIMEOUT
            errorMessage += 'Het duurde te lang om je locatie te bepalen.';
            break;
        default:
            errorMessage += 'Controleer of je locatietoegang hebt ingeschakeld.';
    }

    // Toon een kleine notificatie bovenaan de kaart
    const notification = L.control({position: 'topleft'});
    notification.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'location-error-notification');
        div.innerHTML = `⚠️ ${errorMessage}`;
        div.style.backgroundColor = '#fff';
        div.style.padding = '10px';
        div.style.margin = '10px';
        div.style.borderRadius = '4px';
        div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        return div;
    };
    notification.addTo(map);

    // Verwijder de notificatie na 5 seconden
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// Start watching the user's location
map.locate({
    watch: true,           // Keep watching the user's location
    enableHighAccuracy: true,  // Try to get high accuracy
    timeout: 10000,        // Wait up to 10 seconds to get location
    maximumAge: 10000      // Accept a cached position up to 10 seconds old
});

// Load and display murals
fetch('./data/heerlen-murals.json')
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Loaded data:', data);
        // Add start location marker
        const startMarker = L.marker([data.startLocation.coordinates.lat, data.startLocation.coordinates.lng], {
            icon: L.icon({
                iconUrl: 'img/marker-icon-2x.png',
                shadowUrl: 'img/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map);

        const startPopupContent = `
            <div class="muurschildering-popup">
                <img src="${data.startLocation.thumbnail}" alt="Afbeelding van ${data.startLocation.name}">
                <h3>${data.startLocation.name}</h3>
                <p>${data.startLocation.address}</p>
                <p>${data.startLocation.description}</p>
            </div>
        `;
        startMarker.bindPopup(startPopupContent);
        allMarkers.push(startMarker);

        // Add mural markers
        data.murals.forEach(mural => {
            console.log('Processing mural:', mural);
            const marker = L.marker([mural.location.coordinates.lat, mural.location.coordinates.lng], {
                icon: L.icon({
                    iconUrl: 'img/marker-icon-2x-red.png',
                    shadowUrl: 'img/marker-shadow.png',
                    iconSize: [20, 33],     // Kleiner dan de gebruikerslocatie
                    iconAnchor: [10, 33],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                })
            }).addTo(map);
            allMarkers.push(marker);

            const popupContent = `
                <div class="muurschildering-popup">
                    <img src="${mural.thumbnail}" alt="Afbeelding van ${mural.title}">
                    <h3>${mural.title}</h3>
                    <p>${mural.artist}, ${mural.year}</p>
                    <p>${mural.description}</p>
                    <a href="detail.html?id=${mural.id}" class="aangepaste-knop">
                        <span>Meer info</span>
                        <img src="img/icons/pijltje-2.png" class="knop-icoon" alt="Pijl icoon">
                    </a>
                </div>
            `;

            marker.bindPopup(popupContent);
        });

        // Fit all markers after they are added
        fitAllMarkers();
    })
    .catch(error => {
        console.error('Error loading murals:', error);
        alert('Er is een fout opgetreden bij het laden van de murals. Probeer de pagina te verversen.');
    });
