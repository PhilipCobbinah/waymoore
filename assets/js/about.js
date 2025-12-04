document.addEventListener('DOMContentLoaded', function() {
    const showcaseImg = document.getElementById('showcase-img');
    
    if (showcaseImg && typeof products !== 'undefined') {
        let currentIndex = 0;
        
        // Function to update showcase image
        function updateShowcase() {
            showcaseImg.style.opacity = '0';
            
            setTimeout(() => {
                showcaseImg.src = products[currentIndex].image;
                showcaseImg.alt = products[currentIndex].name;
                showcaseImg.style.opacity = '1';
                
                currentIndex = (currentIndex + 1) % products.length;
            }, 500);
        }
        
        // Initial display
        updateShowcase();
        
        // Change image every 3 seconds
        setInterval(updateShowcase, 3000);
    }
});
