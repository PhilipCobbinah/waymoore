document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('about-js');

    const animatedItems = document.querySelectorAll('.about-animate');
    const premiumImages = document.querySelectorAll('.premium-image');

    premiumImages.forEach(function(img) {
        const frame = img.closest('.premium-image-frame');

        function markLoaded() {
            img.classList.add('is-loaded');
            if (frame) frame.classList.add('is-loaded');
        }

        if (img.complete) {
            markLoaded();
        } else {
            img.addEventListener('load', markLoaded, { once: true });
            img.addEventListener('error', markLoaded, { once: true });
        }
    });

    animatedItems.forEach(function(item, index) {
        item.style.setProperty('--reveal-delay', `${Math.min(index * 70, 280)}ms`);
    });

    function isInViewport(item) {
        const rect = item.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    }

    animatedItems.forEach(function(item) {
        if (isInViewport(item)) {
            item.classList.add('is-visible');
        }
    });

    if (!('IntersectionObserver' in window)) {
        animatedItems.forEach(function(item) {
            item.classList.add('is-visible');
        });
        return;
    }

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px'
    });

    animatedItems.forEach(function(item) {
        revealObserver.observe(item);
    });
});
