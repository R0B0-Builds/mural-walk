// Add transition overlay to body
$('body').append('<div class="page-transition"></div>');

// Add transition styles
$('<style>')
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

        .inhoud {
            opacity: 1;
            transition: opacity 0.3s ease-in-out;
        }

        .inhoud.fade-out {
            opacity: 0;
        }
    `)
    .appendTo('head');

// Handle all internal links
$(document).on('click', 'a[href^="/"], a[href^="./"]', function(e) {
    // Don't handle if it's a direct link to an image or external link
    if ($(this).attr('href').match(/\.(jpg|jpeg|png|gif)$/i) || 
        $(this).attr('target') === '_blank') {
        return;
    }

    e.preventDefault();
    const href = $(this).attr('href');

    // Fade out content
    $('.inhoud').addClass('fade-out');

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
$(document).ready(function() {
    // Hide transition overlay
    $('.page-transition').removeClass('active');
    
    // Fade in content
    setTimeout(() => {
        $('.inhoud').removeClass('fade-out');
    }, 100);
}); 