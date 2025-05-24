$(document).ready(function() {
    // Add transition overlay to body if it doesn't exist
    if ($('.page-transition').length === 0) {
        $('body').append('<div class="page-transition"></div>');
    }

    // Add transition styles
    if (!$('#transition-styles').length) {
        $('<style id="transition-styles">')
            .text(`
                .page-transition {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: var(--primary-color);
                    z-index: 9999;
                    transform: translateY(100%);
                    transition: transform 0.5s ease-in-out;
                }
                
                .page-transition.active {
                    transform: translateY(0);
                }

                .inhoud, .detail-container, #kaart {
                    opacity: 1;
                    transition: opacity 0.3s ease-in-out;
                }

                .inhoud.fade-out, .detail-container.fade-out, #kaart.fade-out {
                    opacity: 0;
                }
            `)
            .appendTo('head');
    }

    // Handle all internal links
    $(document).on('click', 'a[href^="/"], a[href^="./"], a[href^="route.html"], a[href^="index.html"], a[href^="detail.html"]', function(e) {
        // Don't handle if it's a direct link to an image or external link
        if ($(this).attr('href').match(/\.(jpg|jpeg|png|gif)$/i) || 
            $(this).attr('target') === '_blank') {
            return;
        }

        e.preventDefault();
        const href = $(this).attr('href');

        // Fade out content
        $('.inhoud, .detail-container, #kaart').addClass('fade-out');

        // Show transition overlay
        setTimeout(() => {
            $('.page-transition').addClass('active');
            
            // Navigate to new page after transition
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        }, 300);
    });

    // Handle back button clicks
    $(document).on('click', '.terug-knop', function(e) {
        e.preventDefault();
        const href = $(this).attr('onclick').match(/'([^']+)'/)[1];
        
        // Fade out content
        $('.inhoud, .detail-container, #kaart').addClass('fade-out');

        // Show transition overlay
        setTimeout(() => {
            $('.page-transition').addClass('active');
            
            // Navigate to new page after transition
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        }, 300);
    });

    // Handle page load
    $('.page-transition').removeClass('active');
    
    // Fade in content
    setTimeout(() => {
        $('.inhoud, .detail-container, #kaart').removeClass('fade-out');
    }, 100);
}); 