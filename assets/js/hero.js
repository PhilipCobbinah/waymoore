document.addEventListener('DOMContentLoaded', function() {
    const heroTextContent = document.querySelector('.hero-text-content');
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    
    if (heroTextContent) {
        // Start animation after a brief delay
        setTimeout(() => {
            heroTextContent.classList.add('animate');
        }, 300);
    }
    
    if (slides.length > 0) {
        // Show first slide
        slides[0].classList.add('active');
        
        function showNextSlide() {
            // Remove active class from current slide
            slides[currentSlide].classList.remove('active');
            slides[currentSlide].classList.add('exit');
            
            // Move to next slide
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Add active class to next slide
            setTimeout(() => {
                slides.forEach(slide => slide.classList.remove('exit'));
                slides[currentSlide].classList.add('active');
            }, 800);
        }
        
        // Change slide every 8 seconds
        setInterval(showNextSlide, 8000);
    }
});
