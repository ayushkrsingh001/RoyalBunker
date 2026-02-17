document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on refresh
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // =========================================
    // PRELOADER
    // =========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Simulate loading time
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 2500);
    }

    // =========================================
    // CUSTOM CURSOR
    // =========================================
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            // Slight delay for follower
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 50);
        });

        // Add active state to cursor on hoverable elements
        const hoverables = document.querySelectorAll('a, button, .game-card, .pricing-card');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('active');
            });
        });
    }

    // =========================================
    // BACKGROUND MUSIC
    // =========================================
    const music = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');

    if (music && musicToggle) {
        let isPlaying = false;

        // Set volume lower
        music.volume = 0.3;

        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                music.pause();
                musicToggle.innerHTML = '🔊 OFF';
                musicToggle.style.borderColor = 'var(--accent-green)';
                musicToggle.style.color = 'var(--accent-green)';
                musicToggle.style.boxShadow = '0 0 10px rgba(0, 255, 136, 0.2)';
            } else {
                music.play().then(() => {
                    musicToggle.innerHTML = '🔊 ON';
                    musicToggle.style.borderColor = 'var(--accent-blue)';
                    musicToggle.style.color = 'var(--accent-blue)';
                    musicToggle.style.boxShadow = '0 0 20px var(--accent-blue)';
                }).catch(e => console.log("Audio play failed (interaction required):", e));
            }
            isPlaying = !isPlaying;
        });
    }

    // =========================================
    // TOURNAMENT MODAL
    // =========================================
    const modal = document.getElementById('tournament-modal');
    const closeModal = document.querySelector('.close-modal');

    if (modal && closeModal) {
        // Show modal after 5 seconds
        setTimeout(() => {
            modal.style.display = 'flex';
        }, 5000);

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // =========================================
    // TYPEWRITER EFFECT
    // =========================================
    const textToType = "Enter The Arena. Reload The Thrill.";
    const typewriterElement = document.getElementById('typewriter');
    let typeIndex = 0;

    if (typewriterElement) {
        function typeWriter() {
            if (typeIndex < textToType.length) {
                typewriterElement.innerHTML += textToType.charAt(typeIndex);
                typeIndex++;
                setTimeout(typeWriter, 50); // Typing speed
            }
        }

        // Start typing after preloader
        setTimeout(typeWriter, 3000);
    }

    // =========================================
    // MINIMAL DIGITAL CLOCK (New Section)
    // =========================================
    function updateMinimalClock() {
        const clockElement = document.getElementById('minimal-clock-time');
        if (clockElement) {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
            const ampm = hours >= 12 ? 'PM' : 'AM';

            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            clockElement.innerText = `${hours}:${minutes}:${seconds} ${ampm}`;
        }
    }

    setInterval(updateMinimalClock, 1000);
    updateMinimalClock();

    // =========================================
    // BACKGROUND PARTICLES (CANVAS)
    // =========================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        let particlesArray;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 15000;

            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 1) - 0.5;
                let directionY = (Math.random() * 1) - 0.5;
                let color = '#00f2ff'; // Cyan default

                // Randomly assign neon colors
                const colors = ['#00f2ff', '#9d00ff', '#00ff88'];
                color = colors[Math.floor(Math.random() * colors.length)];

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connectParticles();
        }

        function connectParticles() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(100, 100, 100,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        initParticles();
        animateParticles();
    }

    // =========================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // =========================================
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // =========================================
    // NAVBAR SCROLL EFFECT
    // =========================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // =========================================
    // SMOOTH SCROLL FOR NAV LINKS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================
    // BUNKER CAFE MODAL & MENU
    // =========================================
    const menuBtn = document.getElementById('menu-btn');
    const menuModal = document.getElementById('menu-modal');
    const closeMenuBtn = document.getElementById('close-menu');
    const menuGrid = document.getElementById('menu-grid');

    // Menu Categories & Items
    const menuCategories = [
        {
            title: "Quick Bites & Snacks",
            items: Array.from({ length: 8 }, (_, i) => ({
                name: `Snack Item ${String(i + 1).padStart(2, '0')}`,
                price: '₹ XX',
                desc: 'Crispy, crunchy, and perfect for gaming.'
            }))
        },
        {
            title: "Cold Fuel (Drinks)",
            items: Array.from({ length: 6 }, (_, i) => ({
                name: `Drink Item ${String(i + 1).padStart(2, '0')}`,
                price: '₹ XX',
                desc: 'Chilled energetic beverages to keep you going.'
            }))
        },
        {
            title: "Heavy Artillery (Meals)",
            items: Array.from({ length: 6 }, (_, i) => ({
                name: `Meal Item ${String(i + 1).padStart(2, '0')}`,
                price: '₹ XX',
                desc: 'Filling meals for the long haul.'
            }))
        }
    ];

    // Render Menu Items with Dividers
    if (menuGrid) {
        let menuHTML = '';
        menuCategories.forEach((category, index) => {
            // Add Divider (except potentially for the first one if preferred, but adding for all is robust)
            menuHTML += `
                <div class="menu-divider">
                    <span>${category.title}</span>
                </div>
            `;

            // Add Items for this category
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

    // Modal Logic
    if (menuBtn && menuModal && closeMenuBtn) {
        menuBtn.addEventListener('click', () => {
            // Activate the overlay (which fades in)
            menuModal.style.visibility = 'visible';
            menuModal.style.opacity = '1';
            // Start the card animation slightly after overlay
            const modalBox = menuModal.querySelector('.menu-modal');
            if (modalBox) {
                modalBox.style.transform = 'translateY(0)';
            }
            menuModal.classList.add('active'); // Helper class if easier
        });

        const closeModal = () => {
            menuModal.style.opacity = '0';
            menuModal.style.visibility = 'hidden';
            const modalBox = menuModal.querySelector('.menu-modal');
            if (modalBox) {
                modalBox.style.transform = 'translateY(50px)';
            }
            menuModal.classList.remove('active');
        };

        closeMenuBtn.addEventListener('click', closeModal);

        // Click outside to close
        menuModal.addEventListener('click', (e) => {
            if (e.target === menuModal) {
                closeModal();
            }
        });

        // Mobile Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // =========================================
    // SCROLL TO TOP functionality (existing)
    // =========================================
    const scrollTopBtn = document.getElementById('scrollTop');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.style.display = 'block';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =========================================
    // HAMBURGER MENU (Basic Toggle)
    // =========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.right = '20px';
                navLinks.style.background = '#0a0a0a';
                navLinks.style.padding = '20px';
                navLinks.style.border = '1px solid #333';
                navLinks.style.borderRadius = '10px';
            }
        });
    }

    // =========================================
    // TILT EFFECT FOR CARDS (Basic JS impl)
    // =========================================
    const cards = document.querySelectorAll('.game-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xPct = x / rect.width;
            const yPct = y / rect.height;

            const rotateX = (0.5 - yPct) * 10; // Max 10 deg
            const rotateY = (xPct - 0.5) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // =========================================
    // WHATSAPP SLOT BOOKING
    // =========================================
    const bookButtons = document.querySelectorAll('.book-btn');
    const phoneNumber = "919113104602"; // REPLACE WITH YOUR ACTUAL WHATSAPP NUMBER

    bookButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const gameName = btn.getAttribute('data-game');

            // Get today's date
            const today = new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            // Generate Booking ID (Timestamp)
            const bookingId = "RB-" + Date.now().toString().slice(-6);

            if (gameName) {
                const message = `Hello Royal Bunkers Reloaded Team,\n\nI would like to book a slot for *${gameName}*.\n\n🎮 *Gamezone:* Royal Bunkers Reloaded\n🏢 *Operated by:* Royal Castle Hostel & PG (Sadguru Corporation)\n🆔 *Booking ID:* ${bookingId}\n\n📅 *Preferred Date:* ${today}\n⏰ *Preferred Time:* (Please discuss)\n\nPlease share availability and confirm my booking.\nThank you.`;

                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

                window.open(whatsappUrl, '_blank');
            }
        });
    });
});
