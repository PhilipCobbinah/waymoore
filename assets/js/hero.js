document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('home-js');

    initHeroVideoCarousel();
    initHomeScrollReveals();
});

function initHeroVideoCarousel() {
    const carousel = document.querySelector('[data-hero-video-carousel]');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    const progress = document.querySelector('.hero-progress');
    const slideDuration = 20000;
    const posterDelay = 2000;
    let current = 0;
    let timer = null;
    let posterTimer = null;

    function resetProgress() {
        if (!progress) return;
        progress.classList.remove('is-running');
        const bar = progress.querySelector('span');
        if (bar) {
            bar.style.animation = 'none';
            bar.offsetHeight;
            bar.style.animation = '';
        }
        requestAnimationFrame(function() {
            progress.classList.add('is-running');
        });
    }

    function pauseAllVideos() {
        slides.forEach(function(slide) {
            const video = slide.querySelector('video');
            if (video) video.pause();
        });
    }

    function clearPosterTimer() {
        if (posterTimer) {
            window.clearTimeout(posterTimer);
            posterTimer = null;
        }
    }

    function playCurrentVideo() {
        const activeVideo = slides[current] && slides[current].querySelector('video');
        if (!activeVideo || activeVideo.dataset.failed === 'true') return;

        clearPosterTimer();
        activeVideo.currentTime = 0;
        activeVideo.style.opacity = '1';

        posterTimer = window.setTimeout(function() {
            const playAttempt = activeVideo.play();
            if (playAttempt && typeof playAttempt.catch === 'function') {
                playAttempt.catch(function() {
                    activeVideo.dataset.failed = 'true';
                    activeVideo.style.display = 'none';
                });
            }
        }, posterDelay);
    }

    function showSlide(nextIndex) {
        const safeIndex = ((nextIndex % slides.length) + slides.length) % slides.length;
        if (safeIndex === current && slides[safeIndex].classList.contains('active')) {
            resetProgress();
            return;
        }

        slides[current].classList.remove('active');
        slides[current].classList.add('is-exiting');
        current = safeIndex;

        slides.forEach(function(slide, index) {
            const active = index === current;
            slide.classList.toggle('active', active);
            const video = slide.querySelector('video');
            if (!active && video) {
                video.pause();
                video.currentTime = 0;
            }
        });

        dots.forEach(function(dot, index) {
            dot.classList.toggle('active', index === current);
        });

        window.setTimeout(function() {
            slides.forEach(function(slide) {
                slide.classList.remove('is-exiting');
            });
        }, 1000);

        playCurrentVideo();
        resetProgress();
    }

    function startCarousel() {
        stopCarousel();
        playCurrentVideo();
        resetProgress();
        timer = window.setInterval(function() {
            showSlide(current + 1);
        }, slideDuration);
    }

    function stopCarousel() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
        clearPosterTimer();
        pauseAllVideos();
        if (progress) progress.classList.remove('is-running');
    }

    slides.forEach(function(slide) {
        const video = slide.querySelector('video');
        const source = video && video.querySelector('source');

        if (!video) return;

        video.muted = true;
        video.playsInline = true;
        video.loop = true;

        function markFailed() {
            video.dataset.failed = 'true';
            video.style.display = 'none';
        }

        video.addEventListener('error', markFailed);
        if (source) source.addEventListener('error', markFailed);
    });

    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            const index = Number(dot.dataset.heroDot);
            showSlide(index);
            startCarousel();
        });
    });

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopCarousel();
        } else {
            startCarousel();
        }
    });

    startCarousel();
}

function initHomeScrollReveals() {
    const revealItems = Array.from(document.querySelectorAll('[data-home-reveal], .home-card-reveal'));
    if (!revealItems.length) return;

    revealItems.forEach(function(item, index) {
        item.style.setProperty('--home-delay', `${Math.min(index * 80, 320)}ms`);
    });

    function isInViewport(item) {
        const rect = item.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    }

    revealItems.forEach(function(item) {
        if (isInViewport(item)) item.classList.add('is-visible');
    });

    if (!('IntersectionObserver' in window)) {
        revealItems.forEach(function(item) {
            item.classList.add('is-visible');
        });
        return;
    }

    const observer = new IntersectionObserver(function(entries, instance) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            instance.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px'
    });

    revealItems.forEach(function(item) {
        observer.observe(item);
    });
}
