// Главный файл инициализации
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Кинематографичный сайт воспоминаний загружен');
    
    // Инициализация галереи (уже в gallery.js)
    // Инициализация анимаций (уже в animations.js)
    // Инициализация скролла (уже в scroll.js)
    // Инициализация друзей (уже в friends.js)
    
    // Переключение звука
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle && window.sound) {
        soundToggle.addEventListener('click', () => {
            window.sound.toggle();
        });
    }
    
    // Предзагрузка критических ресурсов
    preloadCriticalResources();
    
    // Отображение приветствия (однократно)
    showWelcomeMessage();
});

// Предзагрузка важных изображений
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

// Приветственное сообщение
let welcomeShown = false;

function showWelcomeMessage() {
    if (welcomeShown) return;
    welcomeShown = true;
    
    // Показываем приветствие через 1 секунду
    setTimeout(() => {
        const welcome = document.createElement('div');
        welcome.className = 'welcome-toast';
        welcome.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 2rem;">🎬</span>
                <div>
                    <strong>Добро пожаловать в наш кинозал!</strong><br>
                    <small>Листайте вниз, чтобы пересмотреть лучшие моменты</small>
                </div>
            </div>
        `;
        welcome.style.cssText = `
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
        
        // Добавляем анимацию
        if (!document.querySelector('#welcome-styles')) {
            const styles = document.createElement('style');
            styles.id = 'welcome-styles';
            styles.textContent = `
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
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(welcome);
        
        // Удаляем через 4 секунды
        setTimeout(() => welcome.remove(), 4000);
    }, 1000);
}

// Обработка ошибок загрузки изображений
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        // Можно заменить на заглушку
        e.target.src = 'https://picsum.photos/id/1/800/1000';
    }
}, true);

// Сохранение состояния при закрытии страницы
window.addEventListener('beforeunload', () => {
    // Сохраняем последнее положение скролла при желании
    sessionStorage.setItem('scrollPosition', window.scrollY);
});

// Восстановление положения скролла при загрузке
const savedScroll = sessionStorage.getItem('scrollPosition');
if (savedScroll) {
    window.scrollTo(0, parseInt(savedScroll));
    sessionStorage.removeItem('scrollPosition');
}