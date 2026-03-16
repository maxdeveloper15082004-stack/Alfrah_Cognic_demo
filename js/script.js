document.addEventListener('DOMContentLoaded', () => {
    // Form submission handled by inline scripts in HTML files

    /* ====================================
       Custom Select Dropdown Logic
       ==================================== */
    const customSelects = document.querySelectorAll('.custom-select');

    customSelects.forEach(customSelect => {
        const trigger = customSelect.querySelector('.custom-select-trigger');
        const options = customSelect.querySelectorAll('.custom-option');
        const textElement = customSelect.querySelector('.custom-select-text');
        const hiddenNativeSelect = customSelect.parentElement.querySelector('.hidden-select');

        // Toggle dropdown open/close
        if (trigger) {
            trigger.addEventListener('click', function (e) {
                e.stopPropagation(); // Prevent document click from closing it immediately
                
                // Close other open selects
                document.querySelectorAll('.custom-select.open').forEach(openSelect => {
                    if (openSelect !== customSelect) openSelect.classList.remove('open');
                });
                
                customSelect.classList.toggle('open');
            });
        }

        // Handle option selection
        if (options && options.length > 0) {
            options.forEach(option => {
                option.addEventListener('click', function () {
                    // Remove selected class from all options
                    options.forEach(opt => opt.classList.remove('selected'));

                    // Add selected class to chosen option
                    this.classList.add('selected');

                    // Update trigger text to match selected option (ignoring the icon)
                    const optionText = this.querySelector('span').textContent;
                    textElement.textContent = optionText;

                    // Add has-value class for styling
                    customSelect.classList.add('has-value');

                    // Update the hidden native select value
                    const value = this.getAttribute('data-value');
                    if (hiddenNativeSelect) {
                        hiddenNativeSelect.value = value;
                    }

                    // Close dropdown
                    customSelect.classList.remove('open');
                });
            });
        }
    });

    // Close dropdowns when clicking anywhere else on the page
    document.addEventListener('click', function (e) {
        document.querySelectorAll('.custom-select.open').forEach(openSelect => {
            if (!openSelect.contains(e.target)) {
                openSelect.classList.remove('open');
            }
        });
    });

    /* ====================================
       Parallax Background Effect
       ==================================== */
    // Add subtle parallax effect to orbs on mousemove
    const orbs = document.querySelectorAll('.glow-orb');

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        orbs.forEach((orb, index) => {
            const factor = index === 0 ? 30 : -40; // Different direction/speed
            const moveX = (x - 0.5) * factor;
            const moveY = (y - 0.5) * factor;

            orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    /* ====================================
       Cognix AI Dashboard Completion Logic
       ==================================== */
    
    // Only run completion logic on dashboard page
    if (window.location.pathname.includes('cognix-ai.html')) {
        
        // Completion Check Function
        function checkCompletionStatus() {
            const isDomainCompleted = localStorage.getItem('domainCompleted') === 'true';
            const isCognixCompleted = localStorage.getItem('cognixCompleted') === 'true';
            const isPacksCompleted = localStorage.getItem('packsCompleted') === 'true';
            
            return isDomainCompleted && isCognixCompleted && isPacksCompleted;
        }

        // Show Completion Section - Fixed version
        function showCompletionSection() {
            const options = document.getElementById('options');
            const completionSection = document.getElementById('completion-section');
            
            if (!options || !completionSection || typeof gsap === 'undefined') return;
            
            gsap.to(options, {
                duration: 0.5,
                opacity: 0,
                onComplete: () => {
                    options.style.display = 'none';
                    completionSection.style.display = 'flex';
                    completionSection.classList.add('show');
                }
            });
        }

        // Add click handler for Explore Cognix Site button
        const exploreSiteBtn = document.getElementById('explore-cognix-site-btn');
        if (exploreSiteBtn) {
            exploreSiteBtn.addEventListener('click', () => {
                window.open('https://cognix.ai', '_blank');
            });
        }
    }
});