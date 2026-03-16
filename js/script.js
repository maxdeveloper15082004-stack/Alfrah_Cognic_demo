document.addEventListener('DOMContentLoaded', () => {
    /* ====================================
       Form Submission & Validation
       ==================================== */
    const form = document.getElementById('enrollmentForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation check (HTML5 validation does most of the heavy lifting)
            if (form.checkValidity()) {

                // Get the button to show loading state
                const submitBtn = form.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;

                // Simulate processing
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.8';

                setTimeout(() => {
                    // Success state
                    submitBtn.classList.remove('pulse-anim'); // Remove pulse if it had one
                    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)'; // Green gradient
                    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Redirecting...';

                    // Google Sheet Integration
                    const scriptURL = "https://script.google.com/macros/s/AKfycbx5PR6gHf73j8S_4ZXx3Qzl7NJpPTFGmx1TIkAVflOCniNuUBynYbT-TUS6BewTu_bd/exec";
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData);

                    fetch(scriptURL, {
                        method: "POST",
                        body: JSON.stringify(data)
                    })
                        .then(res => {
                            // After successful Google Sheet save, redirect to Razorpay
                            setTimeout(() => {
                                const courseSelect = document.getElementById('course');
                                const domainSelect = document.getElementById('domain');
                                const fullNameInput = document.getElementById('fullName');
                                
                                const selectedCourse = courseSelect ? courseSelect.value : (domainSelect ? domainSelect.value : null);
                                if (selectedCourse) {
                                    localStorage.setItem('selectedCourse', selectedCourse);
                                    localStorage.removeItem('domainCompleted'); // Reset on new submission
                                }
                                
                                if (fullNameInput && fullNameInput.value) {
                                    localStorage.setItem('userName', fullNameInput.value);
                                }
                                
                                
                                if (domainSelect) {
                                    let redirectUrl = "cognix-ai.html";
                                    if (fullNameInput && fullNameInput.value) {
                                        redirectUrl += "?name=" + encodeURIComponent(fullNameInput.value);
                                        if (domainSelect && domainSelect.value) {
                                            redirectUrl += "&domain=" + encodeURIComponent(domainSelect.value);
                                        }
                                    } else if (domainSelect && domainSelect.value) {
                                        redirectUrl += "?domain=" + encodeURIComponent(domainSelect.value);
                                    }
                                    window.location.href = redirectUrl;
                                } else {
                                    window.location.href = "https://rzp.io/rzp/alfrahdemo";
                                }
                            }, 500);
                        })
                        .catch(err => {
                            console.error("Error saving to Google Sheets", err);
                            // Still redirect on error so user can pay
                            setTimeout(() => {
                                const courseSelect = document.getElementById('course');
                                const domainSelect = document.getElementById('domain');
                                const fullNameInput = document.getElementById('fullName');
                                
                                const selectedCourse = courseSelect ? courseSelect.value : (domainSelect ? domainSelect.value : null);
                                if (selectedCourse) {
                                    localStorage.setItem('selectedCourse', selectedCourse);
                                    localStorage.removeItem('domainCompleted'); // Reset on new submission
                                }
                                
                                if (fullNameInput && fullNameInput.value) {
                                    localStorage.setItem('userName', fullNameInput.value);
                                }

                                if (domainSelect) {
                                    let redirectUrl = "cognix-ai.html";
                                    if (fullNameInput && fullNameInput.value) {
                                        redirectUrl += "?name=" + encodeURIComponent(fullNameInput.value);
                                        if (domainSelect && domainSelect.value) {
                                            redirectUrl += "&domain=" + encodeURIComponent(domainSelect.value);
                                        }
                                    } else if (domainSelect && domainSelect.value) {
                                        redirectUrl += "?domain=" + encodeURIComponent(domainSelect.value);
                                    }
                                    window.location.href = redirectUrl;
                                } else {
                                    window.location.href = "https://rzp.io/rzp/alfrahdemo";
                                }
                            }, 500);
                        });

                }, 1000);
            }
        });
    }

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

        // Close dropdown when clicking anywhere else on the page
        document.addEventListener('click', function (e) {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
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

        // Show Completion Section
        function showCompletionSection() {
            // Only proceed if GSAP is available
            if (typeof gsap === 'undefined') {
                console.warn('GSAP not available for completion animations');
                return;
            }

            const options = document.getElementById('options');
            const completionSection = document.getElementById('completion-section');
            const exploreSiteBtn = document.getElementById('explore-cognix-site-btn');
            const socialContainer = document.querySelector('.social-container');
            const socialTitle = document.querySelector('.social-title');
            const socialIcons = document.querySelectorAll('.social-icon');
            
            if (!options || !completionSection) return;
            
            // STEP 1: Fade out buttons
            gsap.to(options, {
                duration: 0.5,
                                scale: 1,
                                ease: "back.out(1.7)",
                                onComplete: () => {
                                    // STEP 4: After button animation, fade in "Social Media" title (0.4s)
                                    gsap.to(socialContainer, {
                                        duration: 0.4,
                                        opacity: 1,
                                        onComplete: () => {
                                            // STEP 5: After title appears, stagger animate social icons
                                            gsap.to(socialIcons, {
                                                duration: 0.5,
                                                opacity: 1,
                                                y: 0,
                                                stagger: 0.15,
                                                ease: "back.out(1.7)"
                                            });
                                        }
                                    });
                                }
                            });
                        }
        }

        const options = document.getElementById('options');
        const completionSection = document.getElementById('completion-section');
        const exploreSiteBtn = document.getElementById('explore-cognix-site-btn');
        const socialContainer = document.querySelector('.social-container');
        const socialTitle = document.querySelector('.social-title');
        const socialIcons = document.querySelectorAll('.social-icon');
        
        if (!options || !completionSection) return;
        
        // STEP 1: Fade out buttons
        gsap.to(options, {
            duration: 0.5,
            scale: 1,
            ease: "back.out(1.7)",
            onComplete: () => {
                // STEP 4: After button animation, fade in "Social Media" title (0.4s)
                gsap.to(socialContainer, {
                    duration: 0.4,
                    opacity: 1,
                    onComplete: () => {
                        // STEP 5: After title appears, stagger animate social icons
                        gsap.to(socialIcons, {
                            duration: 0.5,
                            opacity: 1,
                            y: 0,
                            stagger: 0.15,
                            ease: "back.out(1.7)"
                        });
                    }
                });
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