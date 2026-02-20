// js/script.js

document.addEventListener('DOMContentLoaded', function() {
   
    
    const URLRouter = {
        // Map short codes to real pages
        routes: {
            '$30av': 'index.html',
            '&31ssfg': 'about.html',
            '%32kl': 'services.html',
            '!34nb': 'contact.html'
        },
        
        reverseRoutes: {},
        
        init() {
            // Build reverse mapping
            for (let [code, page] of Object.entries(this.routes)) {
                this.reverseRoutes[page] = code;
            }
            
            // Handle initial URL state
            this.handleInitialLoad();
            
            // Intercept all internal link clicks
            this.interceptLinks();
            
            // Handle hash changes
            window.addEventListener('hashchange', () => {
                this.handleHashChange();
            });
        },
        
        handleInitialLoad() {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const hash = window.location.hash;
            
            // If we have a hash, validate it
            if (hash) {
                const code = hash.replace('#/', '');
                const expectedPage = this.routes[code];
                
                // If hash points to different page, redirect
                if (expectedPage && expectedPage !== currentPage) {
                    window.location.href = expectedPage + hash;
                    return;
                }
            } else {
                // No hash - add one based on current page
                const code = this.reverseRoutes[currentPage];
                if (code) {
                    history.replaceState(null, '', '#' + code);
                }
            }
        },
        
        interceptLinks() {
            document.querySelectorAll('a[href$=".html"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    
                    // Skip external links
                    if (href.startsWith('http') || href.startsWith('#')) return;
                    
                    // Get code for this page
                    const code = this.reverseRoutes[href];
                    if (code) {
                        // Allow normal navigation, but set hash before leaving
                        // This ensures the URL shows the masked version during load
                        link.href = href + '#/' + code;
                    }
                });
            });
        },
        
        handleHashChange() {
            // Handle back/forward buttons
            const hash = window.location.hash.replace('#/', '');
            const targetPage = this.routes[hash];
            
            if (targetPage) {
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                if (targetPage !== currentPage) {
                    window.location.href = targetPage + '#/' + hash;
                }
            }
        },
        
        // Get display URL (for copy/paste sharing)
        getDisplayUrl() {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const code = this.reverseRoutes[currentPage];
            if (code) {
                const base = window.location.origin + window.location.pathname.replace(currentPage, '');
                return base + '#/' + code;
            }
            return window.location.href;
        }
    };
    // Add this to your existing DOMContentLoaded event in script.js

// Copy to Clipboard Functionality
const copyButtons = document.querySelectorAll('.copy-btn');
const toast = document.getElementById('toast');

copyButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const textToCopy = button.getAttribute('data-copy');
        
        try {
            await navigator.clipboard.writeText(textToCopy);
            
            // Show success state on button
            const originalContent = button.innerHTML;
            button.classList.add('copied');
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Copied!</span>
            `;
            
            // Show toast
            showToast('Copied to clipboard!');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = originalContent;
            }, 2000);
            
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            showToast('Copied to clipboard!');
        }
    });
});

function showToast(message) {
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
    // Initialize router
    URLRouter.init();

    // ================================
    // Loader
    // ================================
    const loader = document.getElementById('loader');
    
    // Ensure loader hides even if there are errors
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (loader) {
                loader.classList.add('hidden');
            }
        }, 500);
    });
    
    // Fallback: hide loader after 3 seconds max
    setTimeout(() => {
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }, 3000);

    // ================================
    // Navigation
    // ================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navbar on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            const spans = navToggle ? navToggle.querySelectorAll('span') : [];
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ================================
    // Particles Animation (Hero)
    // ================================
    const particlesContainer = document.getElementById('particles');
    
    if (particlesContainer) {
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random positioning and animation
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            particlesContainer.appendChild(particle);
        }
    }

    // ================================
    // Scroll Animations
    // ================================
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // ================================
    // Animated Counters
    // ================================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => countObserver.observe(stat));

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (target === 98 ? '%' : '+');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }

    // ================================
    // Testimonial Slider
    // ================================
    const testimonialSlider = document.getElementById('testimonialSlider');
    
    if (testimonialSlider) {
        const track = testimonialSlider.querySelector('.testimonial-track');
        const cards = testimonialSlider.querySelectorAll('.testimonial-card');
        const prevBtn = document.getElementById('prevTestimonial');
        const nextBtn = document.getElementById('nextTestimonial');
        const dotsContainer = document.getElementById('testimonialDots');
        
        if (!cards.length) return;
        
        let currentIndex = 0;
        
        // Create dots
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.dot');
        
        function goToSlide(index) {
            cards[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');
            
            currentIndex = index;
            
            if (currentIndex >= cards.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = cards.length - 1;
            
            cards[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }
        
        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        
        // Auto-play
        setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    // ================================
    // Back to Top Button
    // ================================
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ================================
    // Project Filtering
    // ================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterBtns.length && projectCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ================================
    // Project Modal
    // ================================
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const projectViewBtns = document.querySelectorAll('.project-view');
    
    if (modal) {
        const projectData = {
            1: {
                title: 'FinanceFlow ERP',
                category: 'Software',
                description: 'A comprehensive enterprise resource planning system designed for financial services. Features include real-time analytics, automated reporting, multi-currency support, and advanced security protocols. The system handles over £1B in transactions daily.',
                tech: ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'AWS']
            },
            2: {
                title: 'HealthTrack Pro',
                category: 'Mobile App',
                description: 'Healthcare monitoring application connecting patients with providers. Features real-time vital tracking, appointment scheduling, secure messaging, and integration with wearable devices. Available on iOS and Android.',
                tech: ['React Native', 'Node.js', 'MongoDB', 'Firebase', 'HealthKit']
            },
            3: {
                title: 'E-Commerce Platform',
                category: 'Web',
                description: 'Scalable online marketplace supporting thousands of vendors. Features include real-time inventory management, AI-powered recommendations, multi-payment gateway support, and advanced analytics dashboard.',
                tech: ['Next.js', 'Node.js', 'Redis', 'Elasticsearch', 'Stripe']
            },
            4: {
                title: 'Logistics Hub',
                category: 'Software',
                description: 'End-to-end supply chain management system with real-time tracking, route optimization, and predictive analytics. Reduced delivery times by 35% for client operations.',
                tech: ['Python', 'Django', 'GraphQL', 'TensorFlow', 'Google Maps API']
            },
            5: {
                title: 'RetailMax',
                category: 'Mobile App',
                description: 'Retail management solution with inventory tracking, staff scheduling, and customer loyalty programs. Includes offline mode for uninterrupted operations.',
                tech: ['Flutter', 'Dart', 'SQLite', 'REST API', 'Bluetooth LE']
            },
            6: {
                title: 'CloudSync Dashboard',
                category: 'Web',
                description: 'SaaS analytics platform providing real-time data visualization and business intelligence. Features customizable dashboards, automated reporting, and team collaboration tools.',
                tech: ['Vue.js', 'D3.js', 'Go', 'TimescaleDB', 'Kubernetes']
            }
        };
        
        projectViewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const projectId = btn.getAttribute('data-project');
                const project = projectData[projectId];
                
                if (project) {
                    document.getElementById('modalTitle').textContent = project.title;
                    document.getElementById('modalCategory').textContent = project.category;
                    document.getElementById('modalDescription').textContent = project.description;
                    
                    const techContainer = document.getElementById('modalTech');
                    techContainer.innerHTML = '';
                    project.tech.forEach(tech => {
                        const span = document.createElement('span');
                        span.textContent = tech;
                        techContainer.appendChild(span);
                    });
                    
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.add('active')) {
                closeModal();
            }
        });
    }

    // ================================
    // Contact Form Validation
    // ================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = ['name', 'email', 'service', 'message'];
            
            requiredFields.forEach(fieldName => {
                const field = document.getElementById(fieldName);
                if (!field) return;
                
                const formGroup = field.closest('.form-group');
                
                if (!field.value.trim()) {
                    if (formGroup) formGroup.classList.add('error');
                    isValid = false;
                } else {
                    if (formGroup) formGroup.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = document.getElementById('email');
            if (emailField) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailField.value && !emailRegex.test(emailField.value)) {
                    emailField.closest('.form-group').classList.add('error');
                    isValid = false;
                }
            }
            
            if (isValid) {
                // Show success message (in production, this would submit to server)
                const btn = contactForm.querySelector('button[type="submit"]');
                if (btn) {
                    const originalText = btn.innerHTML;
                    
                    btn.innerHTML = '<span>Message Sent!</span>';
                    btn.style.background = '#10b981';
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        contactForm.reset();
                    }, 3000);
                }
            }
        });
        
        // Real-time validation removal
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    const formGroup = this.closest('.form-group');
                    if (formGroup) formGroup.classList.remove('error');
                }
            });
        });
    }

    // ================================
    // Smooth Scroll for Anchor Links
    // ================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Skip if it's a hash route for pages
            if (href.length <= 2) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ================================
    // Parallax Effect
    // ================================
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    if (parallaxSections.length) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxSections.forEach(section => {
                const rate = scrolled * -0.3;
                section.style.backgroundPositionY = rate + 'px';
            });
        });
    }
});