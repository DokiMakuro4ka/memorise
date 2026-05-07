// Управление звуком
let soundEnabled = true;
let audioContext = null;

// Инициализация AudioContext (по клику пользователя)
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

// Воспроизведение звука
function playSound(type) {
    if (!soundEnabled) return;
    
    try {
        initAudioContext();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Разные частоты для разных типов звуков
        switch(type) {
            case 'hover':
                oscillator.frequency.value = 440; // Ля
                gainNode.gain.value = 0.05;
                break;
            case 'click':
                oscillator.frequency.value = 880; // Ля (октава выше)
                gainNode.gain.value = 0.08;
                break;
            case 'success':
                oscillator.frequency.value = 523.25; // До
                gainNode.gain.value = 0.1;
                // Добавляем короткую модуляцию
                setTimeout(() => {
                    oscillator.frequency.value = 659.25; // Ми
                }, 50);
                break;
            default:
                oscillator.frequency.value = 440;
                gainNode.gain.value = 0.05;
        }
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch(e) {
        console.log('Audio not supported or blocked');
    }
}

// Переключение звука
function toggleSound() {
    soundEnabled = !soundEnabled;
    const toggle = document.getElementById('soundToggle');
    if (toggle) {
        toggle.textContent = soundEnabled ? '🔊' : '🔇';
        if (soundEnabled) {
            playSound('success');
        }
    }
    return soundEnabled;
}

// Экспорт функций для использования в других модулях
window.sound = {
    play: playSound,
    toggle: toggleSound,
    isEnabled: () => soundEnabled
};