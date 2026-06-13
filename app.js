document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. STICKY & TRANSPARENT NAVBAR
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle scroll states
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('transparent');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.add('transparent');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initially to check scroll position on load

    // Mobile Hamburger Menu Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle body overflow
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Close Mobile Drawer on Link Click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    /* ==========================================================================
       2. SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================== */
    const sections = document.querySelectorAll('section, .portfolio-card, .process-step, .catalog-card');
    
    sections.forEach(sec => {
        sec.classList.add('fade-in-section');
    });

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    /* ==========================================================================
       3. PORTFOLIO CATEGORY FILTERING
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.96)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 300);
            });
        });
    });

    /* ==========================================================================
       4. BEFORE & AFTER INTERACTIVE DRAG SLIDER
       ========================================================================== */
    const slider = document.getElementById('ba-slider');
    const handle = document.getElementById('slider-handle');
    const afterImgWrapper = document.getElementById('after-img-wrapper');
    let isDragging = false;

    if (slider && handle && afterImgWrapper) {
        
        const updateSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let pos = ((x - rect.left) / rect.width) * 100;
            
            if (pos < 0) pos = 0;
            if (pos > 100) pos = 100;
            
            slider.style.setProperty('--slider-pos', `${pos}%`);
        };

        const startDragging = () => { isDragging = true; };
        const stopDragging = () => { isDragging = false; };

        const onDrag = (e) => {
            if (!isDragging) return;
            let clientX = (e.type === 'touchmove') ? e.touches[0].clientX : e.clientX;
            updateSlider(clientX);
        };

        handle.addEventListener('mousedown', startDragging);
        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('mousemove', onDrag);

        handle.addEventListener('touchstart', startDragging);
        window.addEventListener('touchend', stopDragging);
        window.addEventListener('touchmove', onDrag);

        window.addEventListener('resize', () => {
            slider.style.setProperty('--slider-pos', '50%');
        });
    }

    /* ==========================================================================
       5. PROJECT COST CALCULATOR
       ========================================================================== */
    const propOptBtns = document.querySelectorAll('#property-type-options .calc-opt-btn');
    const scopeSelect = document.getElementById('calc-scope');
    const areaRange = document.getElementById('calc-area-range');
    const areaDisplay = document.getElementById('area-val-display');
    const tierCards = document.querySelectorAll('.tier-cards .tier-card');
    const calcResult = document.getElementById('calc-result');
    const calcRangeText = document.getElementById('calc-range-text');
    const calcCtaBtn = document.getElementById('calc-cta-btn');

    let propertyType = 'residential';
    let workScope = 'full';
    let areaSize = 1200;
    let qualityTier = 'standard';

    const priceRates = {
        residential: {
            standard: 1200,
            premium: 1800,
            luxury: 2800
        },
        commercial: {
            standard: 1000,
            premium: 1500,
            luxury: 2500
        }
    };

    const scopeMultipliers = {
        full: 1.0,
        'kitchen-only': 0.35,
        'living-only': 0.45,
        'office-fitout': 0.8
    };

    const calculateBudget = () => {
        const rate = priceRates[propertyType][qualityTier];
        const multiplier = scopeMultipliers[workScope] || 1.0;
        
        let total = rate * areaSize * multiplier;

        if (areaSize > 3000) {
            total = total * 0.95;
        } else if (areaSize > 1800) {
            total = total * 0.98;
        }

        const roundedTotal = Math.round(total / 10000) * 10000;
        const lowerRange = Math.round((roundedTotal * 0.9) / 10000) * 10000;
        const upperRange = Math.round((roundedTotal * 1.1) / 10000) * 10000;

        const formatCurrency = (num) => {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(num);
        };

        if (calcResult) calcResult.textContent = formatCurrency(roundedTotal);
        if (calcRangeText) calcRangeText.textContent = `${formatCurrency(lowerRange)} - ${formatCurrency(upperRange)}`;

        if (calcCtaBtn) {
            calcCtaBtn.href = `#contact?est=${roundedTotal}&area=${areaSize}&type=${propertyType}`;
        }
    };

    propOptBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            propOptBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            propertyType = this.getAttribute('data-value');

            if (propertyType === 'commercial') {
                scopeSelect.innerHTML = `
                    <option value="full">Complete Turnkey Design & Build</option>
                    <option value="office-fitout" selected>Standard Office Fit-out Only</option>
                `;
                workScope = 'office-fitout';
            } else {
                scopeSelect.innerHTML = `
                    <option value="full" selected>Complete Turnkey Design & Build</option>
                    <option value="kitchen-only">Modular Kitchen & Dining Only</option>
                    <option value="living-only">Living Room & False Ceilings Only</option>
                `;
                workScope = 'full';
            }
            calculateBudget();
        });
    });

    if (scopeSelect) {
        scopeSelect.addEventListener('change', function() {
            workScope = this.value;
            calculateBudget();
        });
    }

    if (areaRange) {
        areaRange.addEventListener('input', function() {
            areaSize = parseInt(this.value);
            if (areaDisplay) areaDisplay.textContent = `${areaSize} Sq. Ft.`;
            calculateBudget();
        });
    }

    tierCards.forEach(card => {
        card.addEventListener('click', function() {
            tierCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            qualityTier = this.getAttribute('data-tier');
            calculateBudget();
        });
    });

    calculateBudget();

    /* ==========================================================================
       6. TESTIMONIALS SLIDER
       ========================================================================== */
    const track = document.getElementById('testimonials-track');
    const dots = document.querySelectorAll('#carousel-dots .dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    let currentIndex = 0;
    let autoSlideInterval;

    if (track && dots.length > 0) {
        const slideTo = (index) => {
            currentIndex = index;
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        };

        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                let nextIndex = currentIndex + 1;
                if (nextIndex >= dots.length) nextIndex = 0;
                slideTo(nextIndex);
            }, 6000);
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                stopAutoSlide();
                const index = parseInt(this.getAttribute('data-index'));
                slideTo(index);
                startAutoSlide();
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoSlide();
                let prevIndex = currentIndex - 1;
                if (prevIndex < 0) prevIndex = dots.length - 1;
                slideTo(prevIndex);
                startAutoSlide();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoSlide();
                let nextIndex = currentIndex + 1;
                if (nextIndex >= dots.length) nextIndex = 0;
                slideTo(nextIndex);
                startAutoSlide();
            });
        }

        slideTo(0);
        startAutoSlide();
    }

    /* ==========================================================================
       7. FAQ ACCORDION
       ========================================================================== */
    const faqAccordions = document.querySelectorAll('.faq-accordion');

    faqAccordions.forEach(acc => {
        const trigger = acc.querySelector('.faq-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                const isOpen = acc.classList.contains('active');
                
                faqAccordions.forEach(item => {
                    item.classList.remove('active');
                    const panel = item.querySelector('.faq-content-panel');
                    if (panel) panel.style.maxHeight = null;
                });

                if (!isOpen) {
                    acc.classList.add('active');
                    const panel = acc.querySelector('.faq-content-panel');
                    if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
                }
            });
        }
    });

    /* ==========================================================================
       8. WHATSAPP WIDGET
       ========================================================================== */
    const waBubble = document.getElementById('wa-bubble');
    const waPopup = document.getElementById('wa-popup');
    const waClose = document.getElementById('wa-close');
    const chatTime = document.getElementById('chat-time');

    if (chatTime) {
        const now = new Date();
        chatTime.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    if (waBubble && waPopup) {
        waBubble.addEventListener('click', (e) => {
            e.stopPropagation();
            waPopup.classList.toggle('show');
        });

        if (waClose) {
            waClose.addEventListener('click', (e) => {
                e.stopPropagation();
                waPopup.classList.remove('show');
            });
        }

        document.addEventListener('click', (e) => {
            if (!waPopup.contains(e.target) && !waBubble.contains(e.target)) {
                waPopup.classList.remove('show');
            }
        });
    }

    /* ==========================================================================
       9. LEAD FORM SUBMISSION (CONSULTATION CARD)
       ========================================================================== */
    const leadForm = document.getElementById('lead-form');
    const formSuccessCard = document.getElementById('form-success');
    const successUserName = document.getElementById('success-user-name');
    const successUserPhone = document.getElementById('success-user-phone');
    const successCloseBtn = document.getElementById('success-close-btn');

    // Parse parameters to pre-fill budget selections
    const parseUrlParams = () => {
        const hash = window.location.hash;
        if (hash.includes('?')) {
            const paramStr = hash.split('?')[1];
            const params = new URLSearchParams(paramStr);
            const type = params.get('type');
            const area = params.get('area');
            const est = params.get('est');

            const formType = document.getElementById('form-type');
            const formArea = document.getElementById('form-area');
            const formBudget = document.getElementById('form-budget');

            if (formType && type) formType.value = type;
            if (formArea && area) formArea.value = area;
            if (formBudget && est) {
                const price = parseInt(est);
                if (price < 500000) formBudget.value = 'under-5';
                else if (price <= 1000000) formBudget.value = '5-10';
                else if (price <= 2000000) formBudget.value = '10-20';
                else formBudget.value = '20-plus';
            }
        }
    };

    parseUrlParams();
    window.addEventListener('hashchange', parseUrlParams);

    if (leadForm && formSuccessCard) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nameVal = document.getElementById('form-name').value.trim();
            const phoneVal = document.getElementById('form-phone').value.trim();

            if (successUserName) successUserName.textContent = nameVal;
            if (successUserPhone) successUserPhone.textContent = phoneVal;

            leadForm.style.opacity = '0';
            setTimeout(() => {
                leadForm.style.display = 'none';
                formSuccessCard.style.display = 'flex';
                formSuccessCard.style.opacity = '0';
                setTimeout(() => {
                    formSuccessCard.style.opacity = '1';
                }, 50);
            }, 300);
        });

        if (successCloseBtn) {
            successCloseBtn.addEventListener('click', () => {
                leadForm.reset();
                formSuccessCard.style.opacity = '0';
                setTimeout(() => {
                    formSuccessCard.style.display = 'none';
                    leadForm.style.display = 'flex';
                    setTimeout(() => {
                        leadForm.style.opacity = '1';
                    }, 50);
                }, 300);
            });
        }
    }
});
