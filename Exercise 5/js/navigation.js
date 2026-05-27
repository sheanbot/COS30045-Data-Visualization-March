document.addEventListener('DOMContentLoaded', () => {

    // Prevent default anchor jumps from nav links (capture phase)
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(a => a.addEventListener('click', (e) => {
        e.preventDefault();
    }, true));

    // Core showPage implementation (keeps behaviour consistent with existing inline callers)
    function activatePage(pageId) {
        const pages = document.querySelectorAll('.page');
        let found = false;
        pages.forEach(p => {
            if (p.id === pageId) {
                p.classList.add('active');
                found = true;
            } else {
                p.classList.remove('active');
            }
        });

        // Update URL hash without causing browser auto-scroll
        if (found) {
            history.replaceState(null, '', `#${pageId}`);
        }
    }

    // Expose global function used by inline onclick handlers
    window.showPage = function(pageId) {
        if (!pageId) return;
        if (document.getElementById(pageId)) {
            activatePage(pageId);
        }
    };

    // On load: respect existing location.hash if valid; otherwise preserve current .active or default to 'home'
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(initialHash)) {
        activatePage(initialHash);
    } else if (!document.querySelector('.page.active')) {
        activatePage('home');
    }

    // Keep in sync with back/forward navigation
    window.addEventListener('hashchange', () => {
        const h = window.location.hash.replace('#', '');
        if (h && document.getElementById(h)) activatePage(h);
    });

});