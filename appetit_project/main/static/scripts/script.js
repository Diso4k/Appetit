// Global Variables
let currentSlide = 0;
const totalSlides = 3;
let isNavExpanded = false;

// DOM Elements
const header = document.getElementById('header');
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const navToggle = document.getElementById('navToggle');
const navButtons = document.getElementById('navButtons');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const progressFill = document.querySelector('.progress-fill');
const contactForm = document.getElementById('contactForm');

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializeScrollEffects();
    initializeNavigation();
    initializeForm();
    initializeAnimations();
});

// Carousel Functions
function initializeCarousel() {
    // Auto-advance carousel
    setInterval(nextSlide, 5000);
    
    // Touch support for mobile
    let startX = 0;
    let endX = 0;
    
    const carousel = document.querySelector('.offers-carousel');
    
    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                previousSlide();
            }
        }
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function currentSlideFunc(n) {
    currentSlide = n;
    updateCarousel();
}

function updateCarousel() {
    // Update slides
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Scroll Effects
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const progress = (scrolled / documentHeight) * 100;
        
        // Update progress bar
        progressFill.style.width = progress + '%';
        
        // Update header
        header.classList.toggle('scrolled', scrolled > 50);
        
        // Show/hide scroll to top button
        scrollTopBtn.classList.toggle('active', scrolled > 300);
        
        // Update active navigation
        updateActiveNavigation();
        
        // Animate elements on scroll
        animateOnScroll();
    });
}

function updateActiveNavigation() {
    const sections = ['offers', 'menu', 'about', 'contact'];
    const navBtns = document.querySelectorAll('.nav-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSection = sectionId;
            }
        }
    });
    
    // Update navigation buttons
    navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === currentSection);
    });
    
    // Update header navigation links
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === '#' + currentSection);
    });
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.menu-item, .timeline-item, .contact-item, .stat-item');
    
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !element.classList.contains('fade-in-up')) {
            element.classList.add('fade-in-up');
        }
    });
}

// Navigation Functions
function initializeNavigation() {
    // Navigation toggle
    navToggle.addEventListener('click', function() {
        isNavExpanded = !isNavExpanded;
        navToggle.classList.toggle('active', isNavExpanded);
        navButtons.classList.toggle('active', isNavExpanded);
    });
    
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.dataset.target;
            scrollToSection(target);
            
            // Close navigation on mobile
            isNavExpanded = false;
            navToggle.classList.remove('active');
            navButtons.classList.remove('active');
        });
    });
    
    // Header navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            scrollToSection(target);
        });
    });
    
    // Scroll to top button
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = header.offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Form Handling
function initializeForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            submitForm(data);
        });
    }
}

function submitForm(data) {
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Отправляется...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Success simulation
        showNotification('🎉 Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
        
        // Reset form
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        console.log('Form submitted:', data);
    }, 2000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? 'var(--primary-red)' : 'var(--gray-800)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Button Click Handlers
function initializeAnimations() {
    // Add click animations to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    // Handle special button actions
    handleSpecialButtons();
}

function handleSpecialButtons() {
    // Order buttons
    document.querySelectorAll('.order-btn, .btn-offer').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('🛒 Отличный выбор! Переходим к оформлению заказа...', 'success');
            // Here you would typically redirect to order page or open modal
        });
    });
    
    // Cart buttons
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('h3').textContent;
            
            showNotification(`✅ ${itemName} добавлена в корзину!`, 'success');
            
            // Add cart animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Contact buttons
    document.querySelectorAll('.btn-contact').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            
            if (action.includes('Позвонить')) {
                window.location.href = 'tel:+15551234567';
            } else if (action.includes('карте')) {
                window.open('https://maps.google.com', '_blank');
            } else {
                scrollToSection('contact');
            }
        });
    });
}

// Global functions for carousel (called from HTML)
window.nextSlide = nextSlide;
window.previousSlide = previousSlide;
window.currentSlide = currentSlideFunc;

// Add CSS animation for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for better performance
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.menu-item, .timeline-item, .contact-item, .stat-item, .value-item').forEach(el => {
        observer.observe(el);
    });
}

// Initialize intersection observer after DOM load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeIntersectionObserver, 1000);
});

// Smooth scrolling for older browsers
function smoothScrollPolyfill() {
    if (!('scrollBehavior' in document.documentElement.style)) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15.0.0/dist/smooth-scroll.polyfills.min.js';
        document.head.appendChild(script);
    }
}

smoothScrollPolyfill();

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll handler
window.addEventListener('scroll', throttle(function() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const progress = (scrolled / documentHeight) * 100;
    
    progressFill.style.width = progress + '%';
    header.classList.toggle('scrolled', scrolled > 50);
    scrollTopBtn.classList.toggle('active', scrolled > 300);
    updateActiveNavigation();
}, 16)); // ~60fps

// Регистрация и Логин
const userInfo = document.getElementById("user-info");
const loginModal = document.getElementById("login-modal");
const registerModal = document.getElementById("register-modal");

const showLoginBtn = document.getElementById("show-login");
const showRegisterBtn = document.getElementById("show-register");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");

let currentUser = JSON.parse(localStorage.getItem("user")) || null;

// обновить хеддер
function renderHeader() {
  if (currentUser) {
    userInfo.innerHTML = `
      <span>${currentUser.name}</span>
      <button id="logout-btn">Выйти</button>
    `;
    document.getElementById("logout-btn").onclick = () => {
      localStorage.removeItem("user");
      currentUser = null;
      renderHeader();
    };
  } else {
    userInfo.innerHTML = `<button id="open-login">Войти</button>`;
    document.getElementById("open-login").onclick = () => {
      loginModal.classList.remove("hidden");
    };
  }
}

// вход
loginBtn.onclick = () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const stored = JSON.parse(localStorage.getItem("registeredUser"));
  if (stored && stored.email === email && stored.password === password) {
    currentUser = stored;
    localStorage.setItem("user", JSON.stringify(currentUser));
    loginModal.classList.add("hidden");
    renderHeader();
  } else {
    alert("Неверные данные!");
  }
};

// регистрация
registerBtn.onclick = () => {
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  const newUser = { name, email, password };
  localStorage.setItem("registeredUser", JSON.stringify(newUser));
  alert("Аккаунт создан! Теперь войдите.");
  registerModal.classList.add("hidden");
  loginModal.classList.remove("hidden");
};

// переключатели форм
showRegisterBtn.onclick = () => {
  loginModal.classList.add("hidden");
  registerModal.classList.remove("hidden");
};
showLoginBtn.onclick = () => {
  registerModal.classList.add("hidden");
  loginModal.classList.remove("hidden");
};


document.addEventListener('DOMContentLoaded', function () {
  const loginBtn = document.getElementById('loginBtn');
  const modal = document.getElementById('authModal');
  const closeBtn = document.getElementById('closeAuthModal');
  const backdrop = modal ? modal.querySelector('.modal__backdrop') : null;
  const tabsBtns = document.querySelectorAll('.tabs__btn');
  const linkSwitches = document.querySelectorAll('.link-switch');

  function openModal() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (loginBtn && modal) loginBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  function activateTab(name) {
    document.querySelectorAll('[data-tab-panel]').forEach(p => {
      p.classList.toggle('hidden', p.dataset.tabPanel !== name);
    });
    tabsBtns.forEach(b => b.classList.toggle('tabs__btn--active', b.dataset.tab === name));
  }

  tabsBtns.forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));
  linkSwitches.forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    const t = a.dataset.target;
    if (t) activateTab(t);
  }));
});


// инициализация
renderHeader();

// Console message for developers
console.log(`
🍴 APPETIT - Аутентичная восточная кухня
🚀 Сайт успешно загружен!
📱 Все функции работают корректно.
💝 Сделано с любовью для гурманов!
`);