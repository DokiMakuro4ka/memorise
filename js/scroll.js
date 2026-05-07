// Управление скроллом и прогресс-баром
class ScrollManager {
    constructor() {
        this.progressBar = document.getElementById('progressBar');
        this.randomBtn = document.getElementById('randomBtn');
        this.init();
    }
    
    init() {
        this.initProgressBar();
        this.initRandomButton();
        this.initSmoothScroll();
        this.initSwiper();
    }
    
    initProgressBar() {
        if (!this.progressBar) return;
        
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (winScroll / height) * 100;
            this.progressBar.style.width = scrolled + '%';
        });
    }
    
    initRandomButton() {
        if (!this.randomBtn) return;
        
        this.randomBtn.addEventListener('click', () => {
            const cards = document.querySelectorAll('.film-card');
            if (cards.length === 0) return;
            
            const randomIndex = Math.floor(Math.random() * cards.length);
            const randomCard = cards[randomIndex];
            
            // Плавный скролл к карточке
            randomCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // Эффект подсветки
            randomCard.style.transition = 'all 0.3s';
            randomCard.style.boxShadow = '0 0 40px rgba(196,155,63,0.8)';
            setTimeout(() => {
                randomCard.style.boxShadow = '';
            }, 1000);
            
            // Звук
            if (window.sound) window.sound.play('click');
        });
    }
    
    initSmoothScroll() {
        // Плавный скролл для всех якорей
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    initSwiper() {
        // Инициализация Swiper только на мобильных устройствах
        if (window.innerWidth < 900 && typeof Swiper !== 'undefined') {
            new Swiper('.swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                keyboard: {
                    enabled: true,
                    onlyInViewport: true
                },
                effect: 'slide',
                speed: 400
            });
        }
    }
}

// Инициализация
const scrollManager = new ScrollManager();

// Переинициализация Swiper при изменении размера окна
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        scrollManager.initSwiper();
    }, 250);
});