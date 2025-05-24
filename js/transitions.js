// Voeg transitie stijlen toe
const style = document.createElement('style');
style.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
    }
    body.fade-out {
        opacity: 0;
    }
`;
document.head.appendChild(style);

// Behandel alle interne links
document.addEventListener('DOMContentLoaded', function() {
    // Behandel alle interne links
    document.querySelectorAll('a[href^="route.html"], a[href^="index.html"], a[href^="detail.html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Negeer directe links naar afbeeldingen of externe links
            if (this.href.match(/\.(jpg|jpeg|png|gif)$/i) || this.href.startsWith('http')) {
                return;
            }
            
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Fade uit
            document.body.classList.add('fade-out');
            
            // Navigeer naar nieuwe pagina na fade
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });

    // Behandel terug-knop kliks
    document.querySelectorAll('.terug-knop').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            
            // Fade uit
            document.body.classList.add('fade-out');
            
            // Navigeer naar nieuwe pagina na fade
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });

    // Fade in bij het laden van de pagina
    window.addEventListener('load', function() {
        // Wacht tot alle resources geladen zijn
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
}); 