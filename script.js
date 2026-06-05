/**
 * Navaneeth K Portfolio - Core JavaScript
 * Premium, interactive single-page UX logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. DOM Elements
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const cursorGlow = document.getElementById('cursor-glow');
    const contactForm = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');
    const detailsButtons = document.querySelectorAll('.btn-details-toggle');
    const demoButtons = document.querySelectorAll('.btn-project-demo');

    // 2. Mobile Menu Navigation
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            // Toggle hamburger / close icon
            menuToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                if (menuToggle) {
                    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            }
        });
    });

    // 3. Glassmorphic Header Scroll Effect
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case page starts scrolled

    // 4. ScrollSpy: Highlight active menu item based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const scrollSpy = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120; // offset for navbar height
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.getElementById(`link-${sectionId}`);
            
            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    };
    window.addEventListener('scroll', scrollSpy);

    // 5. Desktop Cursor Glow Effect
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (cursorGlow && !isTouchDevice) {
        cursorGlow.style.display = 'block';
        
        window.addEventListener('mousemove', (e) => {
            // Smooth mouse follow using CSS variables or direct positioning
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });

        // Hover expansions for interactive elements
        const hoverables = document.querySelectorAll('a, button, .skill-pill, .project-card, .highlight-box, input, textarea');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorGlow.style.width = '450px';
                cursorGlow.style.height = '450px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%)';
            });
            el.addEventListener('mouseleave', () => {
                cursorGlow.style.width = '350px';
                cursorGlow.style.height = '350px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(0, 242, 254, 0.08) 0%, transparent 70%)';
            });
        });
    }

    // 6. Section Scroll Reveal Observer
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Once revealed, we don't need to observe it anymore
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        const revealElements = document.querySelectorAll('.scroll-reveal');
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        const revealElements = document.querySelectorAll('.scroll-reveal');
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // 7. Dynamic Collapsible Project Details with Height Calculation
    detailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetDetails = document.getElementById(targetId);
            
            if (targetDetails) {
                const isCollapsed = targetDetails.classList.contains('collapsed');
                
                // Toggle state
                if (isCollapsed) {
                    targetDetails.classList.remove('collapsed');
                    targetDetails.classList.add('expanded');
                    // Calculate exact scroll height for smooth transition
                    targetDetails.style.maxHeight = `${targetDetails.scrollHeight}px`;
                    button.classList.add('active');
                    
                    // Show a quick tooltip toast
                    showToast('Info', 'Showing project technical specifications.', 'info');
                } else {
                    targetDetails.style.maxHeight = '0';
                    targetDetails.classList.remove('expanded');
                    targetDetails.classList.add('collapsed');
                    button.classList.remove('active');
                }
            }
        });
    });

    // 8. Custom Toast Notification System
    const showToast = (title, message, type = 'info') => {
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Pick icon based on toast type
        let iconName = 'info';
        if (type === 'success') iconName = 'check-circle';
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i data-lucide="${iconName}"></i>
            </div>
            <div class="toast-body">
                <div class="toast-title">${title}</div>
                <div class="toast-msg">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">
                <i data-lucide="x"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Re-init icons for the new elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Setup close button listener
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn?.addEventListener('click', () => {
            toast.style.transform = 'translateY(20px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        });
        
        // Auto remove toast after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.transform = 'translateY(20px)';
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    };

    // 9. Interactive Feedback for Projects
    demoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const project = button.getAttribute('data-project');
            if (project) {
                showToast('Opening Google Drive', `Redirecting to files for: ${project}.`, 'success');
            }
        });
    });

    // 10. Contact Form Submission Handling
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('form-submit-btn');
            const originalContent = submitBtn.innerHTML;
            
            // Show sending state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending Message...</span> <i data-lucide="loader" class="animate-spin"></i>`;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Add spin animation class to the loader icon
            const spinner = submitBtn.querySelector('[data-lucide="loader"]');
            if (spinner) {
                spinner.style.animation = 'spin 1s linear infinite';
            }
            
            // Collect form data and submit to Web3Forms
            const formData = new FormData(contactForm);
            const accessKey = formData.get('access_key');
            
            // Fallback simulation if key isn't configured yet
            if (accessKey === 'YOUR_ACCESS_KEY_HERE' || !accessKey) {
                setTimeout(() => {
                    showToast(
                        'Simulation Success!', 
                        `Form functions properly. Please paste your Web3Forms Access Key in index.html to receive actual messages!`, 
                        'info'
                    );
                    
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }, 1500);
                return;
            }

            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                const res = await response.json();
                if (response.status === 200) {
                    showToast(
                        'Message Sent!', 
                        `Thank you, ${document.getElementById('name').value}. Your message has been sent successfully to Navaneeth!`, 
                        'success'
                    );
                    contactForm.reset();
                } else {
                    showToast('Submission Failed', res.message || 'Error sending message.', 'error');
                }
            })
            .catch(error => {
                console.error(error);
                showToast('Network Error', 'Could not reach server. Please check your internet connection.', 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });
    }

    // CSS Keyframe styles for form sending spinner
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});
