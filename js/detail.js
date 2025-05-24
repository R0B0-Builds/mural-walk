// Haal de mural ID uit de URL
const urlParams = new URLSearchParams(window.location.search);
const muralId = urlParams.get('id');

// Laad de mural details
fetch('data/heerlen-murals.json')
    .then(response => response.json())
    .then(data => {
        const mural = data.murals.find(m => m.id === muralId);
        if (mural) {
            // Update de pagina titel
            document.title = `${mural.title} - Ontdek het Verhaal`;
            
            // Update de afbeeldingen
            document.getElementById('mural-image').src = mural.image;
            document.getElementById('mural-image').alt = `Mural foto van ${mural.title}`;
            
            // Update de tweede afbeelding
            const image2 = document.getElementById('mural-image2');
            if (mural.image2) {
                image2.src = mural.image2;
                image2.alt = `Extra foto van ${mural.title}`;
                image2.style.display = 'block';
            } else {
                image2.style.display = 'none';
            }
            
            // Update de andere informatie
            document.getElementById('mural-title').textContent = mural.title;
            document.getElementById('mural-artist').textContent = `Door: ${mural.artist}`;
            document.getElementById('mural-address').textContent = mural.location.address;
            document.getElementById('mural-description').textContent = mural.description;
        }
    })
    .catch(error => console.error('Error:', error)); 