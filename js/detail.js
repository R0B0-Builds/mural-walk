// Get the mural ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const muralId = urlParams.get('id');

// Load and display mural details
fetch('./data/heerlen-murals.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Find the mural with the matching ID
        const mural = data.murals.find(m => m.id === muralId);
        
        if (!mural) {
            throw new Error('Mural not found');
        }

        // Update page title
        document.title = `${mural.title} - Mural Walk`;

        // Update content
        document.getElementById('mural-image').src = mural.image;
        document.getElementById('mural-image').alt = `Afbeelding van ${mural.title}`;
        document.getElementById('mural-title').textContent = mural.title;
        document.getElementById('mural-artist').textContent = `${mural.artist}, ${mural.year}`;
        document.getElementById('mural-address').textContent = mural.location.address;
        document.getElementById('mural-description').textContent = mural.description;
    })
    .catch(error => {
        console.error('Error loading mural details:', error);
        alert('Er is een fout opgetreden bij het laden van de mural details. Probeer de pagina te verversen.');
    }); 