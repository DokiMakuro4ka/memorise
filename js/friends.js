// Данные о друзьях
const friendsData = {
    dasha: {
        name: 'Даша',
        url: 'https://www.instagram.com/', // Замените на реальную ссылку
        achievement: 'королева дедукции',
        stats: '85% разгаданных загадок',
        emoji: '👑',
        message: 'Спасибо за твою проницательность и ум! Ты настоящий детектив в команде!'
    },
    alena: {
        name: 'Алёна',
        url: 'https://t.me/', // Замените на реальную ссылку
        achievement: 'мастер секретов',
        stats: 'нашла 3 тайника и 5 скрытых предметов',
        emoji: '🔍',
        message: 'Твоя внимательность к деталям не знает границ! Ты наш главный исследователь!'
    },
    ilya: {
        name: 'Илья',
        url: 'https://vk.com/', // Замените на реальную ссылку
        achievement: 'король зеркал',
        stats: 'разгадал 5 сложнейших головоломок',
        emoji: '🎯',
        message: 'Твой логический склад ума — наше секретное оружие! Продолжай в том же духе!'
    },
    artem: {
        name: 'Артём',
        url: 'https://wa.me/', // Замените на реальную ссылку
        achievement: 'мускулы команды',
        stats: 'открыл 2 потайные двери физической силой',
        emoji: '💪',
        message: 'Твоя решительность и сила духа вдохновляют! Без тебя мы бы застряли!'
    },
    rita: {
        name: 'Рита',
        url: 'https://www.tiktok.com/@', // Замените на реальную ссылку
        achievement: 'гений шифров',
        stats: 'угадала код с 1 раза в 2 квестах',
        emoji: '🧩',
        message: 'Твоя интуиция и умение видеть закономерности поражают! Ты наше секретное оружие!'
    }
};

// Инициализация кликабельных ссылок для друзей
function initFriendsLinks() {
    const links = document.querySelectorAll('.friend-link');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const friendId = link.dataset.friend;
            const friend = friendsData[friendId];
            
            if (friend) {
                // Открываем ссылку (если есть)
                if (friend.url && friend.url !== 'https://') {
                    window.open(friend.url, '_blank');
                }
                
                // Показываем персональную пасхалку
                showFriendEasterEgg(friend);
                
                // Звук
                if (window.sound) window.sound.play('success');
            }
        });
        
        // Эффект при наведении
        link.addEventListener('mouseenter', () => {
            if (window.sound) window.sound.play('hover');
        });
    });
}

// Показ пасхалки для друга
function showFriendEasterEgg(friend) {
    // Создаём временное уведомление в стиле тоста
    const toast = document.createElement('div');
    toast.className = 'friend-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-emoji">${friend.emoji}</span>
            <div class="toast-text">
                <strong>${friend.name}</strong><br>
                ${friend.achievement}<br>
                <small>📊 ${friend.stats}</small>
            </div>
        </div>
    `;
    
    // Стили для тоста
    toast.style.cssText = `
        position: fixed;
        bottom: 120px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(196,155,63,0.5);
        border-radius: 16px;
        padding: 1rem 1.5rem;
        z-index: 2000;
        animation: slideUp 0.3s ease;
        font-family: 'Inter', sans-serif;
        color: #fff;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;
    
    document.body.appendChild(toast);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    // Добавляем анимации, если их нет
    if (!document.querySelector('#toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            @keyframes slideDown {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Статистика по друзьям (можно добавить на страницу)
function getFriendsStats() {
    const stats = {};
    memoriesData.forEach(memory => {
        memory.contributors.forEach(contributor => {
            const key = contributor.toLowerCase();
            stats[key] = (stats[key] || 0) + 1;
        });
    });
    return stats;
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initFriendsLinks();
});