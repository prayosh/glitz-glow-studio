document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a, .hero-actions a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // Allow default behavior if it's not an internal hash link
            if (!targetId.startsWith('#')) return;
            
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 70; // adjusted for mobile height
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Dynamic navigation links highlighting based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset for sticky navigation
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. Add dynamic styling helper class to header on scroll
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Hamburger Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isActive = menuToggle.classList.contains('active');
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', !isActive);
        });

        // Close mobile drawer when an internal link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 5. Scroll-triggered Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                
                // Trigger typing animation specifically on Service Menu items when category is revealed
                if (entry.target.classList.contains('menu-category')) {
                    const itemNames = entry.target.querySelectorAll('.item-name');
                    itemNames.forEach(itemName => {
                        triggerTypingEffect(itemName);
                    });
                }
                
                observer.unobserve(entry.target); // Reveal once for clean scrolling
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px' // Trigger slightly before element peaks
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Character-by-character typing effect with automatic cursor dismissal
    function triggerTypingEffect(element) {
        const fullText = element.textContent.trim();
        element.textContent = ''; // Clear text content
        element.classList.add('typing-active'); // Add cursor class
        
        let charIndex = 0;
        const typingSpeed = 40; // Butter-smooth typing speed (30ms - 50ms)
        
        function typeChar() {
            if (charIndex < fullText.length) {
                element.textContent += fullText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, typingSpeed);
            } else {
                element.classList.remove('typing-active'); // Remove blinking cursor once typing completes
            }
        }
        
        typeChar();
    }

    console.log('Glitz & Glow Studio Script Initialized.');
});
