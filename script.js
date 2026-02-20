document.addEventListener('DOMContentLoaded', () => {

    // Force scroll to top on refresh
    if (history.scrollRestoration) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    // ── Mobile flag (skip heavy effects on phones) ──
    const isMobile = window.innerWidth <= 768;

    // =========================================
    // PRELOADER WITH ANIMATED PERCENT
    // =========================================
    const preloader = document.getElementById('preloader');
    const percentEl = document.getElementById('preloader-percent');
    let currentPct = 0;

    const pctInterval = setInterval(() => {
        currentPct += Math.floor(Math.random() * 8) + 2;
        if (currentPct >= 100) { currentPct = 100; clearInterval(pctInterval); }
        if (percentEl) percentEl.textContent = currentPct + '%';
    }, 60);

    if (preloader) {
        setTimeout(() => {
            currentPct = 100;
            if (percentEl) percentEl.textContent = '100%';

            // Flash overlay on exit
            const flash = document.createElement('div');
            flash.style.cssText = `position:fixed;inset:0;background:#00e5ff;z-index:99998;
                opacity:0.1;pointer-events:none;animation:flashOut 0.4s ease forwards;`;
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 400);

            preloader.style.transition = 'opacity 0.45s ease';
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
        }, 1800);
    }

    // =========================================
    // TYPEWRITER EFFECT
    // =========================================
    const phrases = [
        "Enter The Arena. Reload The Thrill.",
        "Pool Tables. PS5. Pure Gaming.",
        "Where Legends Are Made.",
        "Game Hard. Live Harder.",
        "Open To All. Closed For Boredom."
    ];

    const typewriterEl = document.getElementById('typewriter');
    let phraseIdx = 0, charIdx = 0, isDeleting = false, typeDelay = 55;

    function typeWriter() {
        if (!typewriterEl) return;
        const phrase = phrases[phraseIdx];
        if (isDeleting) {
            typewriterEl.textContent = phrase.substring(0, charIdx - 1);
            charIdx--;
            typeDelay = 28;
        } else {
            typewriterEl.textContent = phrase.substring(0, charIdx + 1);
            charIdx++;
            typeDelay = 55;
        }
        if (!isDeleting && charIdx === phrase.length) {
            typeDelay = 2400;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typeDelay = 380;
        }
        setTimeout(typeWriter, typeDelay);
    }
    setTimeout(typeWriter, 3200);

    // =========================================
    // DIGITAL CLOCK
    // =========================================
    function updateClock() {
        const el = document.getElementById('minimal-clock-time');
        if (!el) return;
        const now = new Date();
        let h = now.getHours();
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        el.textContent = `${h}:${m}:${s} ${ampm}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // =========================================
    // BACKGROUND PARTICLES (CANVAS)
    // =========================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas && !isMobile) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const COLS = ['rgba(0,229,255,', 'rgba(180,0,255,', 'rgba(0,255,153,'];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();

        class Particle {
            constructor() { this.reset(true); }
            reset(init = false) {
                this.x = Math.random() * canvas.width;
                this.y = init ? Math.random() * canvas.height : canvas.height + 10;
                this.size = Math.random() * 1.6 + 0.4;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = -(Math.random() * 0.55 + 0.18);
                this.alpha = Math.random() * 0.45 + 0.08;
                this.color = COLS[Math.floor(Math.random() * COLS.length)];
                this.pulse = Math.random() * Math.PI * 2;
            }
            update() {
                this.pulse += 0.022;
                this.x += this.vx;
                this.y += this.vy;
                if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) this.reset();
                const a = this.alpha + Math.sin(this.pulse) * 0.08;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + Math.max(0, Math.min(1, a)) + ')';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const n = Math.min(Math.floor((canvas.width * canvas.height) / 20000), 40);
            for (let i = 0; i < n; i++) particles.push(new Particle());
        }

        function connectParticles() {
            // Disabled connecting lines to improve performance
            return;
            const maxD = 130;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < maxD) {
                        ctx.strokeStyle = `rgba(0,229,255,${(1 - d / maxD) * 0.1})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => p.update());
            connectParticles();
        }

        window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
        initParticles();
        animate();
    }

    // =========================================
    // SCROLL → NAVBAR + ACTIVE LINKS
    // =========================================
    const navbar = document.getElementById('navbar');
    const navAnchors = document.querySelectorAll('.nav-links li a');
    const sections = document.querySelectorAll('section[id]');
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 60);
        if (scrollTopBtn) scrollTopBtn.style.display = window.scrollY > 500 ? 'block' : 'none';

        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 130) current = sec.getAttribute('id');
        });
        navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }, { passive: true });

    // =========================================
    // SMOOTH SCROLL
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
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
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinksEl.classList.remove('mobile-open');
            }
        });
    }

    // =========================================
    // SCROLL REVEAL — FADE IN
    // =========================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.07 });
    document.querySelectorAll('.fade-in').forEach(el => revealObserver.observe(el));

    // =========================================
    // STAGGER CHILDREN (cards, items)
    // =========================================
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const kids = entry.target.querySelectorAll(
                '.game-card, .pricing-card, .feature-card, .gallery-item'
            );
            kids.forEach((kid, i) => {
                setTimeout(() => {
                    kid.style.opacity = '1';
                    kid.style.transform = 'translateY(0) scale(1)';
                }, isMobile ? 0 : i * 40);
            });
            staggerObserver.unobserve(entry.target);
        });
    }, { threshold: 0.04 });

    document.querySelectorAll('.games-grid, .pricing-grid, .features-grid, .gallery-grid').forEach(grid => {
        grid.querySelectorAll('.game-card, .pricing-card, .feature-card, .gallery-item').forEach(kid => {
            if (isMobile) {
                // On mobile: just show instantly, no stagger transform
                kid.style.opacity = '1';
                kid.style.transform = 'none';
            } else {
                kid.style.cssText += `opacity:0;transform:translateY(20px) scale(0.98);
                    transition:opacity 0.45s cubic-bezier(0.23,1,0.32,1),
                               transform 0.45s cubic-bezier(0.23,1,0.32,1);`;
            }
        });
        if (!isMobile) staggerObserver.observe(grid);
    });

    // =========================================
    // STAT COUNTER ANIMATION
    // =========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsDone = false;

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !statsDone) {
            statsDone = true;
            statNumbers.forEach(el => {
                const raw = el.textContent.trim();

                // Values like "24/7" contain a slash — skip animation, leave as-is
                if (raw.includes('/')) return;

                const num = parseInt(raw.replace(/[^0-9]/g, ''));
                const suffix = raw.replace(/^[0-9]+/, '');  // text AFTER the leading digits
                const prefix = raw.replace(/[0-9].*$/, ''); // text BEFORE the digits
                if (isNaN(num)) return;

                let start = 0;
                const step = Math.ceil(num / 40);
                const timer = setInterval(() => {
                    start = Math.min(start + step, num);
                    el.textContent = prefix + start + suffix;
                    if (start >= num) clearInterval(timer);
                }, 45);
            });
        }
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);

    // =========================================
    // MAGNETIC NAV LINKS
    // =========================================
    if (!isMobile) {
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('mousemove', (e) => {
                const rect = link.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
                link.style.transform = `translate(${x}px, ${y}px)`;
            });
            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
            });
        });
    }

    // =========================================
    // PARALLAX HERO ON SCROLL
    // =========================================
    const heroContent = document.querySelector('.hero-content');
    const heroSection = document.getElementById('hero');

    if (!isMobile) {
        window.addEventListener('scroll', () => {
            if (!heroSection || !heroContent) return;
            const scrolled = window.scrollY;
            const heroH = heroSection.offsetHeight;
            if (scrolled < heroH) {
                const pct = scrolled / heroH;
                heroContent.style.transform = `translateY(${pct * 30}px)`;
                heroContent.style.opacity = `${1 - pct * 1.2}`;
            }
        }, { passive: true });
    }

    // =========================================
    // MOUSE-TRACKING SPOTLIGHT ON CARDS
    // =========================================
    if (!isMobile) {
        document.querySelectorAll('.pricing-card, .feature-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                // Throttled / disabled spotlight gradient to save performance
            });
            card.addEventListener('mouseleave', () => {
                card.style.background = '';
            });
        });
    }

    // =========================================
    // 3D TILT — GAME CARDS & GALLERY ITEMS
    // =========================================
    if (!isMobile) {
        function applyTilt(el, maxDeg = 8) {
            el.addEventListener('mousemove', (e) => {
                // Disabled 3D tilt for performance
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        }
        document.querySelectorAll('.game-card').forEach(c => applyTilt(c, 9));
        document.querySelectorAll('.gallery-item').forEach(c => applyTilt(c, 5));
    }

    // =========================================
    // RIPPLE EFFECT ON BUTTONS
    // =========================================
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleAnim { to { transform:scale(2.8); opacity:0; } }
        @keyframes flashOut   { to { opacity:0; } }
        @keyframes sparkPop   {
            0%   { transform:translate(0,0) scale(1); opacity:1; }
            100% { transform:translate(var(--sx),var(--sy)) scale(0); opacity:0; }
        }
    `;
    document.head.appendChild(rippleStyle);

    function createRipple(e, el) {
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position:absolute; border-radius:50%; pointer-events:none;
            width:${size}px; height:${size}px;
            left:${e.clientX - rect.left - size / 2}px;
            top:${e.clientY - rect.top - size / 2}px;
            background:rgba(0,229,255,0.18);
            transform:scale(0); animation:rippleAnim 0.6s ease-out forwards;`;
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 640);
    }

    document.querySelectorAll(
        '.cta-button, .cta-button-outline, .select-plan, .btn-cafe, .social-btn, #scrollTop'
    ).forEach(btn => {
        btn.addEventListener('click', (e) => createRipple(e, btn));
    });

    // =========================================
    // SPARK BURST on CTA / booking click
    // =========================================
    function spawnSparks(e) {
        if (isMobile) return; // skip on mobile
        for (let i = 0; i < 10; i++) {
            const spark = document.createElement('div');
            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * 50;
            const sx = Math.round(Math.cos(angle) * dist) + 'px';
            const sy = Math.round(Math.sin(angle) * dist) + 'px';
            spark.style.cssText = `
                position:fixed; width:4px; height:4px; border-radius:50%;
                background:var(--neon-cyan,#00e5ff);
                left:${e.clientX}px; top:${e.clientY}px;
                pointer-events:none; z-index:99999;
                --sx:${sx}; --sy:${sy};
                box-shadow:0 0 6px var(--neon-cyan,#00e5ff);
                animation:sparkPop 0.55s cubic-bezier(0.23,1,0.32,1) forwards;`;
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 560);
        }
    }

    document.querySelectorAll('.cta-button').forEach(btn => {
        btn.addEventListener('click', spawnSparks);
    });

    // =========================================
    // SCROLL-TO-TOP
    // =========================================
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================
    // BUNKER CAFÉ MODAL & MENU
    // =========================================
    const menuBtn = document.getElementById('menu-btn');
    const menuModal = document.getElementById('menu-modal');
    const closeMenuBtn = document.getElementById('close-menu');
    const menuGrid = document.getElementById('menu-grid');

    const menuCategories = [
        {
            title: "⚡ Quick Bites & Snacks",
            items: [
                { name: "Samosa (2 pcs)", price: "₹ XX", desc: "Crispy golden samosas with chutney." },
                { name: "Veg Sandwich", price: "₹ XX", desc: "Fresh vegetables in toasted bread." },
                { name: "Bread Butter", price: "₹ XX", desc: "Classic butter toast, always fresh." },
                { name: "Poha", price: "₹ XX", desc: "Light and flavorful flattened rice." },
                { name: "Maggi Noodles", price: "₹ XX", desc: "Quick 2-minute fuel for late nights." },
                { name: "Chips & Namkeen", price: "₹ XX", desc: "Assorted crunchy snack packs." },
                { name: "Boiled Eggs (2)", price: "₹ XX", desc: "High-protein quick energy." },
                { name: "Biscuits Pack", price: "₹ XX", desc: "Assorted biscuit packs." },
            ]
        },
        {
            title: "🥤 Cold Fuel (Drinks)",
            items: [
                { name: "Cold Water Bottle", price: "₹ XX", desc: "Chilled 1L packaged water." },
                { name: "Soft Drinks", price: "₹ XX", desc: "Pepsi, Coke, Sprite & more." },
                { name: "Energy Drink", price: "₹ XX", desc: "Extra boost for long sessions." },
                { name: "Juice Pack", price: "₹ XX", desc: "Real fruit juice packs, chilled." },
                { name: "Lassi", price: "₹ XX", desc: "Sweet or salted, freshly made." },
                { name: "Tea / Coffee", price: "₹ XX", desc: "Hot chai or instant coffee." },
            ]
        },
        {
            title: "🍛 Heavy Artillery (Meals)",
            items: [
                { name: "Thali (Full)", price: "₹ XX", desc: "Rice, dal, sabzi, roti & salad." },
                { name: "Dal Rice", price: "₹ XX", desc: "Simple, filling comfort food." },
                { name: "Rajma Chawal", price: "₹ XX", desc: "Classic kidney beans with rice." },
                { name: "Chole Bhature", price: "₹ XX", desc: "Spiced chickpeas with puffed bread." },
                { name: "Paneer Roti", price: "₹ XX", desc: "Soft rotis with paneer sabzi." },
                { name: "Chicken Rice", price: "₹ XX", desc: "Spiced chicken with basmati rice." },
            ]
        }
    ];

    if (menuGrid) {
        menuGrid.innerHTML = menuCategories.map(cat => `
            <div class="menu-divider"><span>${cat.title}</span></div>
            ${cat.items.map(item => `
                <div class="menu-item">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.price}</span>
                    <p class="item-desc">${item.desc}</p>
                </div>`).join('')}
        `).join('');
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
        menuModal.addEventListener('click', e => { if (e.target === menuModal) closeModal(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && menuModal.classList.contains('active')) closeModal();
        });
    }

    // =========================================
    // WHATSAPP SLOT BOOKING
    // =========================================
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            spawnSparks(e);
            const game = btn.getAttribute('data-game');
            if (!game) return;
            const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            const id = 'RB-' + Date.now().toString().slice(-6);
            const msg = `Hello Royal Bunkers Reloaded Team,\n\nI would like to book a slot for *${game}*.\n\n🎮 *Gamezone:* Royal Bunkers Reloaded\n🏢 *Operated by:* Royal Castle Hostel & PG (Sadguru Corporation)\n🆔 *Booking ID:* ${id}\n\n📅 *Preferred Date:* ${date}\n⏰ *Preferred Time:* (Please discuss)\n\nPlease share availability and confirm my booking.\nThank you.`;
            window.open(`https://wa.me/919113104602?text=${encodeURIComponent(msg)}`, '_blank');
        });
    });

    // =========================================
    // PAGE SCROLL PROGRESS BAR
    // =========================================
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position:fixed; top:0; left:0; height:2px; width:0%;
        background:linear-gradient(90deg,var(--neon-purple,#b400ff),var(--neon-cyan,#00e5ff),var(--neon-gold,#ffcc00));
        z-index:9999; pointer-events:none;
        box-shadow:0 0 10px var(--neon-cyan,#00e5ff);
        transition:width 0.1s linear;`;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (docH > 0 ? (window.scrollY / docH) * 100 : 0) + '%';
    }, { passive: true });

    // =========================================
    // GALLERY ITEM — NEON PULSE ON CLICK
    // =========================================
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', (e) => {
            spawnSparks(e);
            item.style.transition = 'box-shadow 0.1s ease';
            item.style.boxShadow = '0 0 40px rgba(0,229,255,0.5)';
            setTimeout(() => { item.style.boxShadow = ''; }, 400);
        });
    });

    // =========================================
    // FEATURE CARD — subtle hover (jolt removed for performance)
    // =========================================
    // Feature card jolt disabled for smoother experience

    // =========================================
    // NAV ACTIVE ON CLICK
    // =========================================
    navAnchors.forEach(a => {
        a.addEventListener('click', function () {
            navAnchors.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

});
