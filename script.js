document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on refresh
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // =========================================
    // PRELOADER WITH ANIMATED PERCENT
    // =========================================
    const preloader = document.getElementById('preloader');
    const percentEl = document.getElementById('preloader-percent');
    let currentPercent = 0;

    const percentInterval = setInterval(() => {
        currentPercent += Math.floor(Math.random() * 8) + 2;
        if (currentPercent >= 100) {
            currentPercent = 100;
            clearInterval(percentInterval);
        }
        if (percentEl) percentEl.textContent = currentPercent + '%';
    }, 60);

    if (preloader) {
        setTimeout(() => {
            currentPercent = 100;
            if (percentEl) percentEl.textContent = '100%';
            preloader.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            preloader.style.opacity = '0';
            preloader.style.transform = 'scale(1.05)';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 700);
        }, 2600);
    }

    // =========================================
    // TYPEWRITER EFFECT
    // =========================================
    const phrases = [
        "Enter The Arena. Reload The Thrill.",
        "Pool Tables. PS5. Pure Gaming.",
        "Where Legends Are Made.",
        "Game Hard. Live Harder."
    ];

    const typewriterElement = document.getElementById('typewriter');
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 55;

    function typeWriter() {
        if (!typewriterElement) return;
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typewriterElement.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 30;
        } else {
            typewriterElement.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 55;
        }

        if (!isDeleting && charIndex === current.length) {
            typeDelay = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeDelay = 400;
        }

        setTimeout(typeWriter, typeDelay);
    }

    setTimeout(typeWriter, 3200);

    // =========================================
    // MINIMAL DIGITAL CLOCK
    // =========================================
    function updateMinimalClock() {
        const clockElement = document.getElementById('minimal-clock-time');
        if (!clockElement) return;

        const now = new Date();
        let hours = now.getHours();
        let min = now.getMinutes();
        let sec = now.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12 || 12;
        min = min < 10 ? '0' + min : min;
        sec = sec < 10 ? '0' + sec : sec;

        clockElement.textContent = `${hours}:${min}:${sec} ${ampm}`;
    }

    setInterval(updateMinimalClock, 1000);
    updateMinimalClock();

    // =========================================
    // BACKGROUND PARTICLES (CANVAS)
    // =========================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        const COLORS = ['rgba(0,242,255,', 'rgba(157,0,255,', 'rgba(0,255,136,'];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();

        class Particle {
            constructor() { this.reset(true); }

            reset(initial = false) {
                this.x = Math.random() * canvas.width;
                this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = -(Math.random() * 0.5 + 0.2);
                this.opacity = Math.random() * 0.5 + 0.1;
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
                this.pulse = Math.random() * Math.PI * 2;
            }

            draw() {
                this.pulse += 0.02;
                const alpha = this.opacity + Math.sin(this.pulse) * 0.1;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + Math.max(0, Math.min(1, alpha)) + ')';
                ctx.fill();
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                    this.reset();
                }
                this.draw();
            }
        }

        function initParticles() {
            particlesArray = [];
            const count = Math.floor((canvas.width * canvas.height) / 12000);
            for (let i = 0; i < Math.min(count, 120); i++) {
                particlesArray.push(new Particle());
            }
        }

        function connectParticles() {
            const maxDist = 140;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a + 1; b < particlesArray.length; b++) {
                    const dx = particlesArray[a].x - particlesArray[b].x;
                    const dy = particlesArray[a].y - particlesArray[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.12;
                        ctx.strokeStyle = `rgba(0, 242, 255, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(p => p.update());
            connectParticles();
        }

        window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
        initParticles();
        animateParticles();
    }

    // =========================================
    // SCROLL ANIMATIONS
    // =========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // =========================================
    // NAVBAR SCROLL EFFECT & ACTIVE LINKS
    // =========================================
    const navbar = document.getElementById('navbar');
    const navAnchors = document.querySelectorAll('.nav-links li a');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Scrolled state
        if (window.scrollY > 60) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) {
                current = sec.getAttribute('id');
            }
        });

        navAnchors.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) {
                a.classList.add('active');
            }
        });

        // Scroll to top button
        if (scrollTopBtn) {
            scrollTopBtn.style.display = window.scrollY > 500 ? 'block' : 'none';
        }
    });

    // =========================================
    // SMOOTH SCROLL
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
            // Close mobile menu on click
            navLinksEl?.classList.remove('mobile-open');
            hamburger?.classList.remove('active');
        });
    });

    // =========================================
    // HAMBURGER MENU
    // =========================================
    const hamburger = document.getElementById('hamburger');
    const navLinksEl = document.getElementById('nav-links');

    if (hamburger && navLinksEl) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksEl.classList.toggle('mobile-open');
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinksEl.classList.remove('mobile-open');
            }
        });
    }

    // =========================================
    // BUNKER CAFE MODAL & MENU
    // =========================================
    const menuBtn = document.getElementById('menu-btn');
    const menuModal = document.getElementById('menu-modal');
    const closeMenuBtn = document.getElementById('close-menu');
    const menuGrid = document.getElementById('menu-grid');

    const menuCategories = [
        {
            title: "⚡ Quick Bites & Snacks",
            emoji: "🍟",
            items: [
                { name: "Samosa (2 pcs)", price: "₹ XX", desc: "Crispy golden samosas with chutney." },
                { name: "Veg Sandwich", price: "₹ XX", desc: "Fresh vegetables in toasted bread." },
                { name: "Bread Butter", price: "₹ XX", desc: "Classic butter toast, always fresh." },
                { name: "Poha", price: "₹ XX", desc: "Light and flavorful flattened rice snack." },
                { name: "Maggi Noodles", price: "₹ XX", desc: "Quick 2-minute fuel for late nights." },
                { name: "Chips & Namkeen", price: "₹ XX", desc: "Assorted crunchy snack packs." },
                { name: "Boiled Eggs (2)", price: "₹ XX", desc: "High-protein quick energy." },
                { name: "Biscuits Pack", price: "₹ XX", desc: "Assorted biscuit packs." },
            ]
        },
        {
            title: "🥤 Cold Fuel (Drinks)",
            emoji: "🧃",
            items: [
                { name: "Cold Water Bottle", price: "₹ XX", desc: "Chilled 1L packaged water." },
                { name: "Soft Drinks", price: "₹ XX", desc: "Pepsi, Coke, Sprite & more." },
                { name: "Energy Drink", price: "₹ XX", desc: "Extra boost for long gaming sessions." },
                { name: "Juice Pack", price: "₹ XX", desc: "Real fruit juice packs, chilled." },
                { name: "Lassi", price: "₹ XX", desc: "Sweet or salted, freshly made." },
                { name: "Tea / Coffee", price: "₹ XX", desc: "Hot chai or instant coffee." },
            ]
        },
        {
            title: "🍛 Heavy Artillery (Meals)",
            emoji: "🍽️",
            items: [
                { name: "Thali (Full)", price: "₹ XX", desc: "Rice, dal, sabzi, roti & salad." },
                { name: "Dal Rice", price: "₹ XX", desc: "Simple, filling comfort food." },
                { name: "Rajma Chawal", price: "₹ XX", desc: "Classic kidney beans with steamed rice." },
                { name: "Chole Bhature", price: "₹ XX", desc: "Spiced chickpeas with puffed bread." },
                { name: "Paneer Roti", price: "₹ XX", desc: "Soft rotis with paneer sabzi." },
                { name: "Chicken Rice", price: "₹ XX", desc: "Spiced chicken with basmati rice." },
            ]
        }
    ];

    if (menuGrid) {
        let menuHTML = '';
        menuCategories.forEach((category) => {
            menuHTML += `
                <div class="menu-divider">
                    <span>${category.title}</span>
                </div>
            `;
            menuHTML += category.items.map(item => `
                <div class="menu-item">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.price}</span>
                    <p class="item-desc">${item.desc}</p>
                </div>
            `).join('');
        });
        menuGrid.innerHTML = menuHTML;
    }

    if (menuBtn && menuModal && closeMenuBtn) {
        menuBtn.addEventListener('click', () => {
            menuModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeModal = () => {
            menuModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeMenuBtn.addEventListener('click', closeModal);
        menuModal.addEventListener('click', (e) => {
            if (e.target === menuModal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuModal.classList.contains('active')) closeModal();
        });
    }

    // =========================================
    // SCROLL TO TOP
    // =========================================
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================
    // 3D TILT EFFECT FOR GAME CARDS
    // =========================================
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPct = (x / rect.width - 0.5) * 2;
            const yPct = (y / rect.height - 0.5) * 2;
            const rotateY = xPct * 8;
            const rotateX = -yPct * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1) translateY(0)';
        });
    });

    // =========================================
    // WHATSAPP SLOT BOOKING
    // =========================================
    const bookButtons = document.querySelectorAll('.book-btn');
    const phoneNumber = "919113104602";

    bookButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const gameName = btn.getAttribute('data-game');
            if (!gameName) return;

            const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            const bookingId = "RB-" + Date.now().toString().slice(-6);

            const message = `Hello Royal Bunkers Reloaded Team,\n\nI would like to book a slot for *${gameName}*.\n\n🎮 *Gamezone:* Royal Bunkers Reloaded\n🏢 *Operated by:* Royal Castle Hostel & PG (Sadguru Corporation)\n🆔 *Booking ID:* ${bookingId}\n\n📅 *Preferred Date:* ${today}\n⏰ *Preferred Time:* (Please discuss)\n\nPlease share availability and confirm my booking.\nThank you.`;

            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
        });
    });

    // =========================================
    // SECTION REVEAL STAGGER ANIMATION
    // =========================================
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.game-card, .pricing-card, .feature-card, .gallery-item');
                children.forEach((child, i) => {
                    child.style.transitionDelay = (i * 0.08) + 's';
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                });
            }
        });
    }, { threshold: 0.05 });

    // Apply stagger base styles and observe
    document.querySelectorAll('.games-grid, .pricing-grid, .features-grid, .gallery-grid').forEach(grid => {
        const children = grid.querySelectorAll('.game-card, .pricing-card, .feature-card, .gallery-item');
        children.forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            child.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.23,1,0.32,1)';
        });
        staggerObserver.observe(grid);
    });

    // =========================================
    // RIPPLE EFFECT ON BUTTONS
    // =========================================
    function createRipple(e, el) {
        const rect = el.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px; height: ${size}px;
            left: ${x}px; top: ${y}px;
            background: rgba(255,255,255,0.15);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleAnim 0.6s ease-out;
            pointer-events: none;
        `;

        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes rippleAnim {
                    to { transform: scale(2.5); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    document.querySelectorAll('.cta-button, .cta-button-outline, .select-plan, .btn-cafe, .social-btn').forEach(btn => {
        btn.addEventListener('click', (e) => createRipple(e, btn));
    });

});
