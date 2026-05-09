document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Кинематографичный сайт воспоминаний загружен');

    // 0. Стили для скрытия скроллбаров
    if (!document.getElementById('hide-scrollbar-styles')) {
        const style = document.createElement('style');
        style.id = 'hide-scrollbar-styles';

        style.textContent = `
            .horizontal-scroll {
                -ms-overflow-style: none;
                scrollbar-width: none;
                overflow-y: hidden !important;
                overflow-x: auto;
                white-space: nowrap;
                cursor: default;
                scroll-behavior: smooth;
            }

            .horizontal-scroll::-webkit-scrollbar {
                display: none;
            }

            html, body {
                overflow-x: hidden;
                overflow-y: auto;
            }
        `;

        document.head.appendChild(style);
    }

    // 1. Частицы
    initParticles();

    // 2. Звук
    const soundToggle = document.getElementById('soundToggle');

    if (
        soundToggle &&
        window.sound &&
        typeof window.sound.toggle === 'function'
    ) {
        soundToggle.addEventListener('click', () => {
            window.sound.toggle();
        });
    }

    // 3. Предзагрузка + приветствие
    preloadCriticalResources();
    showWelcomeMessage();

    // 4. Кнопки просмотра
    initWatchButtons();

    // 5. Горизонтальный scroll колесом
    const scrollContainer = document.getElementById('horizontalScroll');

    if (scrollContainer) {

        const canScroll = (direction) => {

            if (direction === 'left') {
                return scrollContainer.scrollLeft > 1;
            }

            if (direction === 'right') {
                return (
                    scrollContainer.scrollLeft <
                    scrollContainer.scrollWidth -
                    scrollContainer.clientWidth -
                    1
                );
            }

            return false;
        };

        scrollContainer.addEventListener('wheel', (e) => {

            // Не трогаем модалки
            if (e.target.closest('.modal, .modal-content')) {
                return;
            }

            const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;

            const direction = delta > 0 ? 'right' : 'left';

            // Если можем скроллить контейнер — забираем wheel
            if (canScroll(direction)) {

                e.preventDefault();

                scrollContainer.scrollBy({
                    left: delta,
                    behavior: 'smooth'
                });
            }

            // Иначе страница прокрутится сама
        }, { passive: false });
    }
});

function initParticles() {

    const canvas = document.getElementById('particlesCanvas');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;

    let particles = [];

    let animationId = null;

    const PARTICLE_COUNT = 80;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createParticle() {
        return {
            x: random(0, width),
            y: random(0, height),
            radius: random(1, 3),
            speedX: random(-0.3, 0.3),
            speedY: random(-0.2, 0.2),
            color: `rgba(196, 155, 63, ${random(0.3, 0.9)})`
        };
    }

    function initParticlesArray() {
        particles = [];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }
    }

    function drawParticles() {

        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        for (const p of particles) {

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = p.color;

            ctx.fill();
        }
    }

    function updateParticles() {

        for (const p of particles) {

            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;
        }
    }

    function animateParticles() {
        updateParticles();
        drawParticles();

        animationId = requestAnimationFrame(animateParticles);
    }

    // debounce resize
    let resizeTimeout;

    window.addEventListener('resize', () => {

        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            initParticlesArray();
        }, 100);
    });

    resizeCanvas();
    initParticlesArray();
    animateParticles();

    // cleanup для SPA
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}

function preloadCriticalResources() {

    const criticalImages = [
        'https://picsum.photos/id/104/800/1000',
        'https://picsum.photos/id/106/800/1000'
    ];

    criticalImages.forEach(src => {

        const img = new Image();

        img.decoding = 'async';
        img.loading = 'eager';

        img.src = src;
    });
}

let welcomeShown = false;

function showWelcomeMessage() {

    if (welcomeShown) return;

    welcomeShown = true;

    setTimeout(() => {

        const toast = document.createElement('div');

        toast.innerHTML = `
            <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-size:2rem;">🎬</span>

                <div>
                    <strong>Добро пожаловать в наш кинозал!</strong><br>

                    <small>
                        Листайте вниз, а над карточками крутите колёсико мыши, чтобы погрузиться в атмосферу воспоминаний.
                    </small>
                </div>
            </div>
        `;

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(196,155,63,0.5);
            border-radius: 12px;
            padding: 12px 20px;
            z-index: 2000;
            animation: slideInRight 0.3s ease;
            font-family: Inter, sans-serif;
            font-size: 14px;
            color: #fff;
            max-width: 300px;
        `;

        if (!document.querySelector('#toast-keyframes')) {

            const style = document.createElement('style');

            style.id = 'toast-keyframes';

            style.textContent = `
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }

                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;

            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 6000);

    }, 500);
}

function animateCounter(element, newValue) {

    if (!element) return;

    const oldText = element.textContent;

    const start =
        parseInt(oldText.replace(/[^0-9]/g, '')) || 0;

    const end = newValue;

    if (start === end) return;

    const duration = 400;
    const stepTime = 16;

    const steps = duration / stepTime;

    const increment = (end - start) / steps;

    let current = start;
    let step = 0;

    const timer = setInterval(() => {

        step++;

        current += increment;

        if (step >= steps) {

            element.textContent = `👁️ ${end}`;

            clearInterval(timer);

        } else {

            element.textContent =
                `👁️ ${Math.round(current)}`;
        }

    }, stepTime);
}

function showSimpleModal(imgSrc) {

    const existing =
        document.getElementById('temp-modal');

    if (existing) {
        existing.remove();
    }

    const modal = document.createElement('div');

    modal.id = 'temp-modal';

    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
        cursor: pointer;
    `;

    const img = document.createElement('img');

    img.onerror = () => {
        img.src = 'https://picsum.photos/id/1/800/1000';
    };

    img.src = imgSrc;

    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.borderRadius = '16px';
    img.style.boxShadow =
        '0 0 30px rgba(196,155,63,0.5)';

    modal.appendChild(img);

    const closeModal = () => {
        modal.remove();
        document.removeEventListener('keydown', escHandler);
    };

    modal.addEventListener('click', closeModal);

    const escHandler = (e) => {

        if (e.key === 'Escape') {
            closeModal();
        }
    };

    document.addEventListener('keydown', escHandler);

    document.body.appendChild(modal);
}

function initWatchButtons() {

    const buttons =
        document.querySelectorAll('.watch-trailer');

    buttons.forEach(btn => {

        // правильное удаление старого обработчика
        if (btn._watchHandler) {
            btn.removeEventListener(
                'click',
                btn._watchHandler
            );
        }

        const handler = (e) => {

            e.stopPropagation();

            const questId =
                btn.getAttribute('data-id');

            if (!questId) return;

            const imageUrl =
                `assets/images/quest_${questId}.jpg`;

            if (
                typeof modalManager !== 'undefined' &&
                typeof modalManager.open === 'function'
            ) {

                const card =
                    btn.closest('.film-card');

                const title =
                    card
                        ?.querySelector('.film-title')
                        ?.innerText
                    || 'Фото с квеста';

                modalManager.open(
                    imageUrl,
                    title,
                    ''
                );

            } else {

                showSimpleModal(imageUrl);
            }
        };

        btn.addEventListener('click', handler);

        btn._watchHandler = handler;
    });
}

// fallback изображений
window.addEventListener('error', (e) => {

    const img = e.target;

    if (
        img.tagName === 'IMG' &&
        !img.dataset.fallback
    ) {

        img.dataset.fallback = 'true';

        console.warn(
            'Image failed to load:',
            img.src
        );

        img.src =
            'https://picsum.photos/id/1/800/1000';
    }

}, true);

// === НАВИГАЦИЯ ===
function initNavigation() {
    const scrollContainer = document.getElementById('horizontalScroll');
    const prevBtn = document.getElementById('navPrev');
    const nextBtn = document.getElementById('navNext');
    const dotsContainer = document.getElementById('navDots');
    if (!scrollContainer || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = document.querySelectorAll('.film-card');
    const cardCount = cards.length;
    if (cardCount === 0) return;

    // создаём точки
    dotsContainer.innerHTML = '';
    for (let i = 0; i < cardCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('nav-dot');
        dot.dataset.index = i;
        dot.addEventListener('click', () => goToCard(i));
        dotsContainer.appendChild(dot);
    }
    const dots = document.querySelectorAll('.nav-dot');

    function goToCard(index) {
        index = Math.max(0, Math.min(index, cardCount - 1));
        const cardWidth = scrollContainer.clientWidth;
        scrollContainer.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    }

    function updateActiveDot() {
        const scrollLeft = scrollContainer.scrollLeft;
        const cardWidth = scrollContainer.clientWidth;
        let activeIndex = Math.round(scrollLeft / cardWidth);
        activeIndex = Math.min(activeIndex, cardCount - 1);
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeIndex);
        });
    }

    prevBtn.addEventListener('click', () => {
        const scrollLeft = scrollContainer.scrollLeft;
        const cardWidth = scrollContainer.clientWidth;
        const currentIndex = Math.round(scrollLeft / cardWidth);
        goToCard(currentIndex - 1);
    });
    nextBtn.addEventListener('click', () => {
        const scrollLeft = scrollContainer.scrollLeft;
        const cardWidth = scrollContainer.clientWidth;
        const currentIndex = Math.round(scrollLeft / cardWidth);
        goToCard(currentIndex + 1);
    });
    scrollContainer.addEventListener('scroll', () => requestAnimationFrame(updateActiveDot));
    window.addEventListener('resize', updateActiveDot);
    updateActiveDot();
}

// вызываем после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}

// =========================================================
// ПРЕЛОАДЕР С ОТСЛЕЖИВАНИЕМ КАРТОЧЕК, ИЗОБРАЖЕНИЙ И ВИДЕО
// =========================================================
(function() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('preloaderProgressBar');
    const percentSpan = document.getElementById('preloaderPercent');
    const preloaderText = document.querySelector('#preloader .preloader-text');
    
    if (!preloader) return;
    
    let loadedResources = 0;
    let totalResources = 0;
    let isFinished = false;
    let cardsReady = false;
    
    // Массив дружелюбных сообщений
    const loadingMessages = [
        { percent: 0, text: "🎬 Подготавливаем кадры..." },
        { percent: 25, text: "🍿 Достаём попкорн, воспоминания загружаются..." },
        { percent: 50, text: "📽️ Наматываем киноплёнку..." },
        { percent: 75, text: "✨ Почти готово, осталось чуть-чуть!" },
        { percent: 90, text: "🎞️ Финальный штрих..." },
        { percent: 100, text: "🎉 Добро пожаловать в наш кинозал!" }
    ];
    
    function incrementLoad() {
        loadedResources++;
        updateProgress();
    }
    
    function updateProgress() {
        if (isFinished) return;
        const percent = totalResources === 0 ? 100 : Math.floor((loadedResources / totalResources) * 100);
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (percentSpan) percentSpan.textContent = `${percent}%`;
        if (preloaderText) {
            let currentMessage = loadingMessages[0].text;
            for (let i = loadingMessages.length - 1; i >= 0; i--) {
                if (percent >= loadingMessages[i].percent) {
                    currentMessage = loadingMessages[i].text;
                    break;
                }
            }
            preloaderText.textContent = currentMessage;
        }
        // Проверяем, всё ли загружено И карточки уже есть
        if (loadedResources >= totalResources && totalResources > 0 && cardsReady) {
            finishLoading();
        }
    }
    
    function finishLoading() {
        if (isFinished) return;
        isFinished = true;
        setTimeout(() => {
            preloader.classList.add('hide');
            setTimeout(() => {
                if (preloader && preloader.parentNode) preloader.remove();
            }, 500);
        }, 300);
    }
    
    // Проверка наличия карточек (и их содержимого)
    function checkCardsReady() {
        const cards = document.querySelectorAll('.film-card, .card-sticky'); // ждём появления любых из этих классов
        if (cards.length > 0) {
            cardsReady = true;
            updateProgress();
        } else {
            // Если карточек ещё нет, ждём через MutationObserver
            const cardObserver = new MutationObserver(() => {
                if (document.querySelectorAll('.film-card, .card-sticky').length > 0) {
                    cardsReady = true;
                    updateProgress();
                    cardObserver.disconnect();
                }
            });
            cardObserver.observe(document.body, { childList: true, subtree: true });
        }
    }
    
    function countAndObserveResources() {
        const images = document.querySelectorAll('img');
        const videos = document.querySelectorAll('video');
        totalResources = images.length + videos.length;
        if (totalResources === 0) {
            // Если ресурсов нет, просто ждём карточки
            checkCardsReady();
            return;
        }
        loadedResources = 0;
        
        images.forEach(img => {
            if (img.complete) {
                incrementLoad();
            } else {
                img.addEventListener('load', incrementLoad);
                img.addEventListener('error', incrementLoad);
            }
        });
        
        videos.forEach(video => {
            if (video.readyState >= 2) {
                incrementLoad();
            } else {
                video.addEventListener('loadeddata', incrementLoad);
                video.addEventListener('error', incrementLoad);
            }
        });
        updateProgress();
        checkCardsReady();  // начинаем ждать карточки параллельно
    }
    
    countAndObserveResources();
    
    // Наблюдатель за динамически добавляемыми ресурсами
    const observer = new MutationObserver(() => {
        const currentImages = document.querySelectorAll('img');
        const currentVideos = document.querySelectorAll('video');
        const newTotal = currentImages.length + currentVideos.length;
        if (newTotal !== totalResources) {
            totalResources = newTotal;
            currentImages.forEach(img => {
                if (!img.complete && !img._listenerAdded) {
                    img._listenerAdded = true;
                    img.addEventListener('load', incrementLoad);
                    img.addEventListener('error', incrementLoad);
                }
            });
            currentVideos.forEach(video => {
                if (video.readyState < 2 && !video._listenerAdded) {
                    video._listenerAdded = true;
                    video.addEventListener('loadeddata', incrementLoad);
                    video.addEventListener('error', incrementLoad);
                }
            });
            updateProgress();
        }
        // Также проверяем появление карточек, если ещё нет
        if (!cardsReady && document.querySelectorAll('.film-card, .card-sticky').length > 0) {
            cardsReady = true;
            updateProgress();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Защитный таймаут (10 секунд)
    setTimeout(() => {
        if (!isFinished && preloader && !preloader.classList.contains('hide')) {
            console.warn('Прелоадер принудительно скрыт по таймауту');
            finishLoading();
        }
    }, 10000);
})();