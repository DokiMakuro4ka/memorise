// Управление скроллом и прогресс-баром
class ScrollManager {

    constructor() {

        this.progressBar =
            document.getElementById('progressBar');

        this.randomBtn =
            document.getElementById('randomBtn');

        this.scrollTicking = false;

        this.init();
    }

    init() {

        this.initProgressBar();
        this.initRandomButton();
        this.initSmoothScroll();
    }

    // =====================================================
    // Progress bar
    // =====================================================

    initProgressBar() {

        if (!this.progressBar) return;

        const updateProgress = () => {

            const winScroll = window.scrollY;

            const height =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const scrolled =
                height > 0
                    ? (winScroll / height) * 100
                    : 0;

            this.progressBar.style.width =
                `${Math.min(scrolled, 100)}%`;

            this.scrollTicking = false;
        };

        window.addEventListener('scroll', () => {

            if (!this.scrollTicking) {

                requestAnimationFrame(updateProgress);

                this.scrollTicking = true;
            }

        }, { passive: true });

        // initial render
        updateProgress();
    }

    // =====================================================
    // Random card button
    // =====================================================

    initRandomButton() {

        if (!this.randomBtn) return;

        this.randomBtn.addEventListener('click', () => {

            const cards =
                document.querySelectorAll('.film-card');

            if (!cards.length) return;

            const randomIndex =
                Math.floor(Math.random() * cards.length);

            const randomCard =
                cards[randomIndex];

            // Плавный скролл
            randomCard.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });

            // Подсветка
            randomCard.classList.add('card-highlight');

            setTimeout(() => {

                randomCard.classList.remove(
                    'card-highlight'
                );

            }, 1000);

            // Звук
            if (
                window.sound &&
                typeof window.sound.play === 'function'
            ) {
                window.sound.play('click');
            }
        });
    }

    // =====================================================
    // Smooth anchor scroll
    // =====================================================

    initSmoothScroll() {

        const anchors =
            document.querySelectorAll('a[href^="#"]');

        anchors.forEach(anchor => {

            anchor.addEventListener('click', (e) => {

                const href =
                    anchor.getAttribute('href');

                // Игнорируем пустые #
                if (!href || href === '#') {
                    return;
                }

                const target =
                    document.querySelector(href);

                if (!target) return;

                e.preventDefault();

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }

    // =====================================================
    // Destroy (на будущее для SPA)
    // =====================================================

    destroy() {

        // сюда можно добавить cleanup listeners
        // если проект станет SPA
    }
}

// =====================================================
// Защита от двойной инициализации
// =====================================================

if (
    window.scrollManager &&
    typeof window.scrollManager.destroy === 'function'
) {
    window.scrollManager.destroy();
}

window.scrollManager = new ScrollManager();