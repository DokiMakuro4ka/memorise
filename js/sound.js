let soundEnabled = true;
let audioContext = null;
let _failed = false;

function initAudioContext() {
    if (_failed) return;
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
            console.warn('Web Audio не поддерживается');
            _failed = true;
            return;
        }
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume().catch(e => {
            _failed = true;
        });
    }
}

function playSound(type) {
    if (!soundEnabled || _failed) return;
    try {
        initAudioContext();
        if (!audioContext) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        switch(type) {
            case 'hover': oscillator.frequency.value = 440; gainNode.gain.value = 0.05; break;
            case 'click': oscillator.frequency.value = 880; gainNode.gain.value = 0.08; break;
            case 'success': oscillator.frequency.value = 523.25; gainNode.gain.value = 0.1; break;
            default: oscillator.frequency.value = 440;
        }
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch(e) { console.log(e); }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const toggle = document.getElementById('soundToggle');
    if (toggle) toggle.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled && !_failed) playSound('success');
    else if (_failed && toggle) toggle.textContent = '🔇🚫';
}

window.sound = { play: playSound, toggle: toggleSound, isEnabled: () => soundEnabled };