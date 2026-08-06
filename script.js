document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    /* --------------------------------------------------
       MOBILE HAMBURGER MENU
    -------------------------------------------------- */
    const hamburger = document.getElementById('hamburger-menu');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        mobileNavOverlay.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    };

    hamburger.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavOverlay.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    /* --------------------------------------------------
       SCROLL ANIMATIONS (INTERSECTION OBSERVER)
    -------------------------------------------------- */
    // Helper function for skill percentages count-up
    function animateCountUp(element, target, duration) {
        let startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const current = Math.floor(progress * target);
            element.textContent = current + '%';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = target + '%';
            }
        }
        window.requestAnimationFrame(step);
    }

    // Helper function for stat counters count-up
    function animateStatCount(element, target, duration) {
        let startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const current = Math.floor(progress * target);
            element.textContent = current;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = target;
            }
        }
        window.requestAnimationFrame(step);
    }

    // Main animation observer
    const revealElements = document.querySelectorAll(
        '.reveal-left, .reveal-right, .reveal-slide-left, .reveal-scale, .reveal-cascade, .reveal-drop, .animate-item, .project-card, .timeline-item, .skills-card-group, .stat-counter-card, .achievement-card, .education-card, .hero-section, .about-section'
    );

    const animationObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-animation');

                // If it is a skills card group, run progress bars and count percentage text
                if (entry.target.classList.contains('skills-card-group')) {
                    const fills = entry.target.querySelectorAll('.progress-bar-fill');
                    fills.forEach(fill => {
                        const pct = fill.getAttribute('data-percent');
                        fill.style.width = pct + '%';
                    });

                    const percentages = entry.target.querySelectorAll('.skill-percentage');
                    percentages.forEach(perc => {
                        if (!perc.dataset.animated) {
                            perc.dataset.animated = 'true';
                            const target = parseInt(perc.getAttribute('data-target'));
                            animateCountUp(perc, target, 1500);
                        }
                    });
                }

                // If it is a stat counter card, count statistics upward
                if (entry.target.classList.contains('stat-counter-card')) {
                    const numEl = entry.target.querySelector('.stat-num');
                    if (numEl && !numEl.dataset.animated) {
                        numEl.dataset.animated = 'true';
                        const target = parseInt(numEl.getAttribute('data-val'));
                        animateStatCount(numEl, target, 2000);
                    }
                }
            }
        });
    }, animationObserverOptions);

    revealElements.forEach(el => animationObserver.observe(el));

    /* --------------------------------------------------
       SCROLL SPY & ACTIVE NAV LINK
    -------------------------------------------------- */
    const sections = document.querySelectorAll('.scroll-spy, section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const spyObserverOptions = {
        root: null,
        rootMargin: '-25% 0px -55% 0px', // Activates when section covers center viewport
        threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });

                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, spyObserverOptions);

    sections.forEach(sec => spyObserver.observe(sec));

    /* --------------------------------------------------
       CERTIFICATION CARD MOUSE-FOLLOW TILT EFFECT
    -------------------------------------------------- */
    const tiltElements = document.querySelectorAll('.tilt-element');
    
    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Tilt calculation - max 8 degrees rotation
            const rotateX = ((centerY - y) / centerY) * 8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            // Restore rotation with default random offsets defined in CSS cascade vertical animation
            const rotationDegree = card.style.getPropertyValue('--rot') || '0deg';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) rotate(${rotationDegree}) scale3d(1, 1, 1)`;
        });
    });

    /* --------------------------------------------------
       CONTACT FORM SUBMISSION HANDLER
    -------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        if (!name || !email || !subject || !message) {
            formFeedback.className = 'form-feedback error';
            formFeedback.textContent = 'Please fill out all fields.';
            return;
        }

        // Compose body structure
        const bodyContent = `Full Name: ${name}\nEmail Address: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:kr.pankaj.098419@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;

        // Open user's default mail client
        window.location.href = mailtoLink;

        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = 'Opening your mail client to send message...';

        // Clear form
        contactForm.reset();

        // Reset floating input labels
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
            input.classList.remove('has-value');
        });

        setTimeout(() => {
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';
        }, 5000);
    });
});
