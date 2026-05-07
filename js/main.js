// main.js — чистая версия без дублей

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Кинематографичный сайт воспоминаний загружен');
    
    // 1. Плавающие частицы
    initParticles();
    
    // 2. Звук (если модуль sound.js подключён)
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle && window.sound) {
        soundToggle.addEventListener('click', () => window.sound.toggle());
    }
    
    // 3. Предзагрузка изображений и приветствие
    preloadCriticalResources();
    showWelcomeMessage();
});

// --- Функция для частиц ---
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
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
            alpha: random(0.2, 0.8),
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
        for (let p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
    }
    
    function updateParticles() {
        for (let p of particles) {
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
        requestAnimationFrame(animateParticles);
    }
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticlesArray();
    });
    
    resizeCanvas();
    initParticlesArray();
    animateParticles();
}

// --- Предзагрузка критических изображений ---
function preloadCriticalResources() {
    const criticalImages = [
        'https://picsum.photos/id/104/800/1000',
        'https://picsum.photos/id/106/800/1000'
    ];
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// --- Приветственное сообщение ---
let welcomeShown = false;

function showWelcomeMessage() {
    if (welcomeShown) return;
    welcomeShown = true;
    
    setTimeout(() => {
        const toast = document.createElement('div');
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 2rem;">🎬</span>
                <div>
                    <strong>Добро пожаловать в наш кинозал!</strong><br>
                    <small>Листайте вниз, чтобы пересмотреть лучшие моменты</small>
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
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            color: #fff;
            max-width: 300px;
        `;
        
        if (!document.querySelector('#toast-keyframes')) {
            const style = document.createElement('style');
            style.id = 'toast-keyframes';
            style.textContent = `
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }, 1000);
}

// --- Анимированный счётчик (используется gallery.js) ---
function animateCounter(element, newValue) {
    if (!element) return;
    const oldText = element.textContent;
    const start = parseInt(oldText.replace(/[^0-9]/g, '')) || 0;
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
            element.textContent = `👁️ ${Math.round(current)}`;
        }
    }, stepTime);
}

// --- Обработка ошибок загрузки изображений ---
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        e.target.src = 'https://picsum.photos/id/1/800/1000';
    }
}, true);

// --- Сохранение / восстановление позиции скролла (опционально) ---
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('scrollPosition', window.scrollY);
});

const savedScroll = sessionStorage.getItem('scrollPosition');
if (savedScroll) {
    window.scrollTo(0, parseInt(savedScroll));
    sessionStorage.removeItem('scrollPosition');
}

// Обработчик для кнопки "Смотреть фото" (квест Lucky Hotel)
document.addEventListener('DOMContentLoaded', function() {
    const watchButton = document.querySelector('.film-card[data-id="1"] .watch-trailer');
    if (!watchButton) {
        console.warn('Кнопка не найдена');
        return;
    }

    watchButton.addEventListener('click', function(e) {
        e.stopPropagation();
        // Укажите правильный путь к вашему фото
        const imageUrl = 'assets/images/quest_1.jpg';
        
        // Пытаемся открыть через существующий modalManager (если есть)
        if (typeof modalManager !== 'undefined' && modalManager.open) {
            modalManager.open(imageUrl, 'Lucky Hotel. Люкс 113', 'Фото с квеста');
        } else {
            // Запасной вариант: создать временное модальное окно
            showSimpleModal(imageUrl);
        }
    });
});

// Простая модалка, если modalManager отсутствует
function showSimpleModal(imgSrc) {
    // Удаляем старую, если есть
    const oldModal = document.getElementById('temp-modal');
    if (oldModal) oldModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'temp-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.9); display: flex; align-items: center;
        justify-content: center; z-index: 10000; backdrop-filter: blur(5px);
    `;
    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.borderRadius = '16px';
    img.style.boxShadow = '0 0 30px rgba(196,155,63,0.5)';
    modal.appendChild(img);
    modal.addEventListener('click', () => modal.remove());
    document.body.appendChild(modal);
}