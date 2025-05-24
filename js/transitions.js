$(document).ready(function() {
    // Voeg transitie stijlen toe
    if (!$('#transition-styles').length) {
        $('<style id="transition-styles">')
            .text(`
                body {
                    opacity: 1;
                    transition: opacity 0.5s ease-in-out;
                    background-color: #f5f5f5;
                }

                body.fade-out {
                    opacity: 0;
                    background-color: #8c8c8c;
                }

                body.fade-in {
                    opacity: 1;
                    background-color: #f5f5f5;
                }
            `)
            .appendTo('head');
    }

    // Behandel alle interne links
    $(document).on('click', 'a[href^="/"], a[href^="./"], a[href^="route.html"], a[href^="index.html"], a[href^="detail.html"]', function(e) {
        // Negeer directe links naar afbeeldingen of externe links
        if ($(this).attr('href').match(/\.(jpg|jpeg|png|gif)$/i) || 
            $(this).attr('target') === '_blank') {
            return;
        }

        e.preventDefault();
        const href = $(this).attr('href');

        // Fade uit
        $('body').addClass('fade-out');

        // Navigeer naar nieuwe pagina na fade
        setTimeout(() => {
            window.location.href = href;
        }, 500);
    });

    // Behandel terug-knop kliks
    $(document).on('click', '.terug-knop', function(e) {
        e.preventDefault();
        const href = $(this).attr('onclick').match(/'([^']+)'/)[1];
        
        // Fade uit
        $('body').addClass('fade-out');

        // Navigeer naar nieuwe pagina na fade
        setTimeout(() => {
            window.location.href = href;
        }, 500);
    });

    // Fade in bij het laden van de pagina
    // Wacht tot de pagina volledig geladen is voordat de fade-in start
    $(window).on('load', function() {
        // Wacht even tot alles geladen is
        setTimeout(() => {
            $('body').addClass('fade-in');
        }, 1000);
    });
}); 