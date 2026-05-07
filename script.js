// Регистрируем плагин GSAP
gsap.registerPlugin(ScrollTrigger);

// Анимация появления карточек при скролле (как в кинопрокате)
document.querySelectorAll('.film-card').forEach((card, index) => {
    ScrollTrigger.create({
        trigger: card,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => card.classList.add('visible'),
        once: true,
        toggleActions: 'play none none reverse'
    });
    
    // Эффект параллакса для постеров внутри карточки
    const poster = card.querySelector('.film-poster');
    if(poster) {
        ScrollTrigger.create({
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
                const y = self.progress * 80 - 40;
                gsap.to(poster, { y: y, duration: 0.1, overwrite: true });
            }
        });
    }
});

// Динамическая подсветка кнопок 'смотреть'
const buttons = document.querySelectorAll('.watch-trailer');
buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('✨ Здесь будет ссылка на альбом с тёплыми воспоминаниями и видео ✨
Скоро добавим!');
    });
});

// Магический 3D-гаджет, который вращается и следует за мышью (но оставляя эффект)
const gadget = document.getElementById('magicGadget');
if(gadget) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        // Элемент следует с небольшим отставанием для плавности
        gsap.to(gadget, { x: x + 20, y: y - 40, duration: 0.6, ease: 'power2.out' });
    });
}

// Микро-анимация для главного титра (дополнительный шарм)
const heroTitle = document.querySelector('.title-main');
if(heroTitle) {
    heroTitle.addEventListener('mouseenter', () => {
        gsap.to(heroTitle, { scale: 1.02, duration: 0.3, color: '#c49b3f', ease: 'back.out(1)' });
    });
    heroTitle.addEventListener('mouseleave', () => {
        gsap.to(heroTitle, { scale: 1, duration: 0.3, color: '', ease: 'back.in' });
    });
}

console.log('🎬 Кинематографичный сайт воспоминаний загружен. Приятного просмотра!');
