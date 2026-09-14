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

    /* --------------------------------------------------
       FEATURED PROJECT VIDEO HOVER & MODAL CONTROLLER
    -------------------------------------------------- */
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const video = card.querySelector('.project-preview-video');
        const hint = card.querySelector('.video-overlay-hint');
        if (!video) return;

        const playVideo = () => {
            video.muted = true;
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        if (hint) hint.classList.add('is-playing');
                    })
                    .catch(() => {});
            }
        };

        const pauseVideo = () => {
            video.pause();
            if (hint) hint.classList.remove('is-playing');
        };

        // Hover events for Desktop
        card.addEventListener('mouseenter', playVideo);
        card.addEventListener('mouseleave', pauseVideo);

        // Tap/Click event for Mobile/Touch
        const videoWrapper = card.querySelector('.project-video-wrapper');
        if (videoWrapper) {
            videoWrapper.addEventListener('click', () => {
                if (video.paused) {
                    playVideo();
                } else {
                    pauseVideo();
                }
            });
        }
    });

    // Project Detail Modal Controller
    const modalOpenButtons = document.querySelectorAll('.btn-details-modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close-btn');
    const modalBackdrops = document.querySelectorAll('.project-modal-backdrop');

    modalOpenButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetModalId = btn.getAttribute('data-modal');
            const targetModal = document.getElementById(targetModalId);
            if (targetModal) {
                targetModal.classList.add('is-active');
                targetModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';

                // Pause any running videos when modal is opened
                document.querySelectorAll('.project-preview-video').forEach(v => v.pause());
                document.querySelectorAll('.video-overlay-hint').forEach(h => h.classList.remove('is-playing'));
            }
        });
    });

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = btn.closest('.project-modal-backdrop');
            if (modal) closeModal(modal);
        });
    });

    modalBackdrops.forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeModal(backdrop);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.project-modal-backdrop.is-active');
            if (activeModal) closeModal(activeModal);
        }
    });

    // Equalize Timeline Cards Height so both cards have the exact same height and never crop
    const equalizeTimelineCards = () => {
        const cards = document.querySelectorAll('.timeline-card');
        if (!cards.length) return;
        if (window.innerWidth > 768) {
            cards.forEach(card => card.style.minHeight = 'auto');
            let maxHeight = 0;
            cards.forEach(card => {
                const h = card.scrollHeight || card.offsetHeight;
                if (h > maxHeight) maxHeight = h;
            });
            if (maxHeight > 0) {
                cards.forEach(card => {
                    card.style.minHeight = maxHeight + 'px';
                });
            }
        } else {
            cards.forEach(card => {
                card.style.minHeight = 'auto';
            });
        }
    };

    equalizeTimelineCards();
    window.addEventListener('resize', equalizeTimelineCards);
    window.addEventListener('load', equalizeTimelineCards);

    /* --------------------------------------------------
       INTERACTIVE 3D DIGITAL BOOK CONTROLLER
    -------------------------------------------------- */
    const initInteractiveBook = () => {
        const bookWrapper = document.querySelector('.interactive-book-wrapper');
        if (!bookWrapper) return;

        const pages = bookWrapper.querySelectorAll('.book-page');
        const tabButtons = bookWrapper.querySelectorAll('.book-tab-btn');
        const totalPages = pages.length; // 10 pages: 0 to 9
        let currentPage = 0;

        const goToPage = (targetIndex) => {
            if (targetIndex < 0 || targetIndex >= totalPages) return;
            if (targetIndex === currentPage) return;

            pages.forEach((page) => {
                const pageIndex = parseInt(page.getAttribute('data-page'), 10);
                page.classList.remove('is-active', 'slide-prev');
                
                if (pageIndex === targetIndex) {
                    page.classList.add('is-active');
                } else if (pageIndex < targetIndex) {
                    page.classList.add('slide-prev');
                }
            });

            // Update Bookmark Tabs
            tabButtons.forEach(btn => {
                const tabIndex = parseInt(btn.getAttribute('data-tab-page'), 10);
                if (tabIndex === targetIndex) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            currentPage = targetIndex;

            // Re-render lucide icons if needed
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }

            // If user scrolled away on small screens, keep book neatly in view
            if (window.innerWidth < 768) {
                const bookRect = bookWrapper.getBoundingClientRect();
                if (bookRect.top < 0 || bookRect.bottom > window.innerHeight) {
                    bookWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };

        // Next Page Buttons
        const nextBtns = bookWrapper.querySelectorAll('.btn-book-next');
        nextBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                goToPage(currentPage + 1);
            });
        });

        // Prev Page Buttons
        const prevBtns = bookWrapper.querySelectorAll('.btn-book-prev');
        prevBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage > 0) {
                    goToPage(currentPage - 1);
                }
            });
        });

        // Cover Reset Button on the last page
        const firstBtns = bookWrapper.querySelectorAll('.btn-book-first');
        firstBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                goToPage(0);
            });
        });

        // Quick Index Button (Back to Table of Contents - page 2)
        const indexQuickBtns = bookWrapper.querySelectorAll('.book-index-quick-btn');
        indexQuickBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                goToPage(2);
            });
        });

        // Table of Contents Items (click any chapter)
        const indexItems = bookWrapper.querySelectorAll('.index-item');
        indexItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetPage = parseInt(item.getAttribute('data-goto'), 10);
                if (!isNaN(targetPage)) {
                    goToPage(targetPage);
                }
            });
        });

        // Bookmark Tab Buttons (on the right)
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetPage = parseInt(btn.getAttribute('data-tab-page'), 10);
                if (!isNaN(targetPage)) {
                    goToPage(targetPage);
                }
            });
        });

        // Keyboard navigation when mouse is inside book
        let isBookHovered = false;
        bookWrapper.addEventListener('mouseenter', () => { isBookHovered = true; });
        bookWrapper.addEventListener('mouseleave', () => { isBookHovered = false; });

        document.addEventListener('keydown', (e) => {
            if (!isBookHovered) return;
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                if (currentPage < totalPages - 1) {
                    e.preventDefault();
                    goToPage(currentPage + 1);
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                if (currentPage > 0) {
                    e.preventDefault();
                    goToPage(currentPage - 1);
                }
            }
        });

        // Touch Swipe Navigation for Mobile
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        bookWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        bookWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX < 0) {
                    if (currentPage < totalPages - 1) {
                        goToPage(currentPage + 1);
                    }
                } else {
                    if (currentPage > 0) {
                        goToPage(currentPage - 1);
                    }
                }
            }
        };
    };

    initInteractiveBook();

    // Re-initialize Lucide Icons for newly rendered elements
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
});

