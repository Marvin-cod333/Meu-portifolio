// script.js

// Configurações Globais
const CONFIG = {
    enableCursor: true,
    enableParticles: true,
    enableAnimations: true,
    scrollOffset: 100,
    animationDelay: 50
};

// Estado da Aplicação
const STATE = {
    currentTheme: 'light',
    isMenuOpen: false,
    isLoaded: false,
    scrollPosition: 0,
    mousePosition: { x: 0, y: 0 }
};

// Inicialização da Aplicação
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.setupTheme();
        this.setupLoading();
        this.setupNavigation();
        this.setupAnimations();
        this.setupInteractions();
        this.setupForms();
        this.setupPerformance();
        
        console.log('🎯 Portfólio Marvin Daniel Cossa carregado com sucesso!');
    }

    // Sistema de Tema
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('portfolio-theme');
        
        if (savedTheme) {
            STATE.currentTheme = savedTheme;
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            STATE.currentTheme = 'dark';
        }

        this.applyTheme();

        themeToggle?.addEventListener('click', () => {
            STATE.currentTheme = STATE.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme();
            this.saveTheme();
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('portfolio-theme')) {
                STATE.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        });
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', STATE.currentTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = STATE.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }

        const themeColor = STATE.currentTheme === 'light' ? '#ffffff' : '#0f172a';
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
    }

    saveTheme() {
        localStorage.setItem('portfolio-theme', STATE.currentTheme);
    }

    // Loading Screen
    setupLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        
        if (!loadingScreen) return;

        const minLoadTime = 2000;
        const startTime = Date.now();

        const completeLoading = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minLoadTime - elapsed);

            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                
                setTimeout(() => {
                    loadingScreen.remove();
                    STATE.isLoaded = true;
                    this.onLoadComplete();
                }, 500);
            }, remaining);
        };

        if (document.readyState === 'complete') {
            completeLoading();
        } else {
            window.addEventListener('load', completeLoading);
        }

        setTimeout(completeLoading, 4000);
    }

    onLoadComplete() {
        this.initParticles();
        this.initCursor();
        this.startAnimations();
        this.setupScrollEffects();
    }

    // Sistema de Partículas
    initParticles() {
        if (!CONFIG.enableParticles) return;

        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = window.innerWidth < 768 ? 30 : 50;

        for (let i = 0; i < particleCount; i++) {
            this.createParticle(particlesContainer);
        }

        setInterval(() => {
            const currentParticles = particlesContainer.children.length;
            if (currentParticles < particleCount) {
                this.createParticle(particlesContainer);
            }
        }, 1000);
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = Math.random() * 10 + 15;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${posX}vw;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
            opacity: ${Math.random() * 0.3 + 0.1};
            background: var(--primary);
        `;

        container.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode === container) {
                container.removeChild(particle);
            }
        }, (duration + delay) * 1000);
    }

    // Cursor Personalizado
    initCursor() {
        if (!CONFIG.enableCursor || window.innerWidth < 768) return;

        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        
        if (!cursor || !follower) return;

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        let speed = 0.1;

        const updateCursor = () => {
            const dx = mouseX - followerX;
            const dy = mouseY - followerY;
            
            followerX += dx * speed;
            followerY += dy * speed;

            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

            requestAnimationFrame(updateCursor);
        };

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            STATE.mousePosition = { x: mouseX, y: mouseY };
        });

        const interactiveElements = [
            'a', 'button', '.btn-primary', '.btn-secondary', 
            '.project-card', '.skill-category', '.nav-link',
            '.social-link', '.theme-toggle', '.education-card'
        ];

        interactiveElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.style.transform = 'scale(1.5)';
                    follower.style.transform = 'scale(1.2)';
                    cursor.style.background = 'var(--primary)';
                });

                el.addEventListener('mouseleave', () => {
                    cursor.style.transform = 'scale(1)';
                    follower.style.transform = 'scale(1)';
                    cursor.style.background = 'transparent';
                });
            });
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            follower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
        });

        updateCursor();
    }

    // Sistema de Navegação
    setupNavigation() {
        const hamburger = document.getElementById('navHamburger');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        hamburger?.addEventListener('click', () => {
            STATE.isMenuOpen = !STATE.isMenuOpen;
            hamburger.classList.toggle('active', STATE.isMenuOpen);
            navMenu.classList.toggle('active', STATE.isMenuOpen);
            document.body.style.overflow = STATE.isMenuOpen ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                STATE.isMenuOpen = false;
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        this.setupSmoothScroll();
        this.setupNavbarScroll();
    }

    setupSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupNavbarScroll() {
        const navbar = document.getElementById('navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const scrollDelta = currentScroll - lastScroll;

            if (navbar) {
                if (currentScroll > 100) {
                    navbar.style.background = 'var(--bg-primary)';
                    navbar.style.backdropFilter = 'blur(20px)';
                    
                    if (scrollDelta > 0 && currentScroll > 200) {
                        navbar.style.transform = 'translateY(-100%)';
                    } else {
                        navbar.style.transform = 'translateY(0)';
                    }
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.9)';
                    if (STATE.currentTheme === 'dark') {
                        navbar.style.background = 'rgba(15, 23, 42, 0.9)';
                    }
                    navbar.style.transform = 'translateY(0)';
                }
            }

            lastScroll = currentScroll;
            STATE.scrollPosition = currentScroll;
        });
    }

    // Sistema de Animações
    setupAnimations() {
        if (!CONFIG.enableAnimations) return;

        this.initCounters();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
    }

    initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => counterObserver.observe(counter));
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .skill-progress, .timeline-item, .education-card, .project-card');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    if (entry.target.classList.contains('skill-progress')) {
                        const width = entry.target.getAttribute('data-width');
                        setTimeout(() => {
                            entry.target.style.transform = `scaleX(${width / 100})`;
                        }, CONFIG.animationDelay);
                    }
                    
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => scrollObserver.observe(el));
    }

    setupHoverAnimations() {
        const tiltElements = document.querySelectorAll('.project-card, .skill-category, .education-card');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 25;
                const rotateY = (centerX - x) / 25;
                
                element.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateZ(10px)
                `;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    startAnimations() {
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-actions, .hero-stats');
        
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });

        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.5}s`;
        });
    }

    // Interações Avançadas
    setupInteractions() {
        this.setupCVDownload();
        this.setupProjectInteractions();
        this.setupSkillsInteractions();
        this.setupTimelineInteractions();
    }

    setupCVDownload() {
        const downloadCV = document.getElementById('downloadCV');
        downloadCV?.addEventListener('click', (e) => {
            e.preventDefault();
            this.downloadCV();
        });
    }

    downloadCV() {
        const cvUrl = 'Marvin Daniel Cossa.pdf';
        
        this.showNotification('Iniciando download do CV...', 'info');
        
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = 'Marvin_Daniel_Cossa_CV.pdf';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            this.showNotification('CV baixado com sucesso!', 'success');
        }, 1000);
    }

    setupProjectInteractions() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const image = card.querySelector('.project-image');
            const overlay = card.querySelector('.project-overlay');
            
            card.addEventListener('mousemove', (e) => {
                if (!image) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const moveX = (x - rect.width / 2) / 20;
                const moveY = (y - rect.height / 2) / 20;
                
                image.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
            });

            card.addEventListener('mouseleave', () => {
                if (image) {
                    image.style.transform = 'translate(0, 0) scale(1)';
                }
            });
        });
    }

    setupSkillsInteractions() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const progress = item.querySelector('.skill-progress');
                if (progress) {
                    progress.style.transform = `scaleX(${progress.getAttribute('data-width') / 100})`;
                }
            });
        });
    }

    setupTimelineInteractions() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }

    // Sistema de Formulários
    setupForms() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(contactForm);
            });

            this.setupFormValidation(contactForm);
        }
    }

    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch (field.type) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                message = isValid ? '' : 'Por favor, insira um email válido';
                break;
            case 'text':
                if (field.name === 'name') {
                    isValid = value.length >= 2;
                    message = isValid ? '' : 'Nome deve ter pelo menos 2 caracteres';
                }
                break;
            default:
                isValid = value.length > 0;
                message = isValid ? '' : 'Este campo é obrigatório';
        }

        this.setFieldState(field, isValid, message);
        return isValid;
    }

    setFieldState(field, isValid, message) {
        field.classList.toggle('error', !isValid);
        field.classList.toggle('success', isValid);

        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (!isValid && message) {
            const errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            errorElement.style.cssText = `
                color: #dc2626;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
            `;
            field.parentNode.appendChild(errorElement);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error', 'success');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    async handleFormSubmit(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        const inputs = form.querySelectorAll('input, textarea');
        let allValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });

        if (!allValid) {
            this.showNotification('Por favor, corrija os erros no formulário.', 'error');
            return;
        }

        try {
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;

            await new Promise(resolve => setTimeout(resolve, 2000));

            this.showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
            form.reset();
            
            inputs.forEach(input => this.clearFieldError(input));

        } catch (error) {
            this.showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
                <span>${message}</span>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#059669' : '#dc2626'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Scroll Effects
    setupScrollEffects() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50% 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentSection = entry.target.id;
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentSection}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // Otimizações de Performance
    setupPerformance() {
        this.setupLazyLoading();
        this.setupScrollDebounce();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupScrollDebounce() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Operações após scroll parar
            }, 100);
        });
    }

    // Métodos públicos para extensão
    getState() {
        return { ...STATE };
    }

    updateConfig(newConfig) {
        Object.assign(CONFIG, newConfig);
    }
}

// Inicializar aplicação
const portfolioApp = new PortfolioApp();

// Service Worker para PWA (Opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Web Vitals para métricas de performance
const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(onPerfEntry);
            getFID(onPerfEntry);
            getFCP(onPerfEntry);
            getLCP(onPerfEntry);
            getTTFB(onPerfEntry);
        });
    }
};

// Hotkeys para desenvolvimento
if (process.env.NODE_ENV === 'development') {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            portfolioApp.updateConfig({ enableCursor: !CONFIG.enableCursor });
        }
        
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            portfolioApp.updateConfig({ enableAnimations: !CONFIG.enableAnimations });
        }
    });
}

// Exportar para uso global
window.PortfolioApp = portfolioApp;
window.reportWebVitals = reportWebVitals;

console.log(`
╔══════════════════════════════════════╗
║    PORTFÓLIO MARVIN COSSA ATIVO     ║
║                                      ║
║  ✅ Tema claro/escuro               ║
║  ✅ Download do CV funcional        ║
║  ✅ Formulário de contacto          ║
║  ✅ Animações smooth                ║
║  ✅ Design responsivo               ║
║                                      ║
╚══════════════════════════════════════╝
`);