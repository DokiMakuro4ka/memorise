function initAnimations() {
    // Регистрируем ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Анимация появления карточек при скролле

        if (windowWith > 769) {
          gsap.utils.toArray('.film-card').forEach((card, index) => {
              gsap.from(card, {
                  scrollTrigger: {
                      trigger: card,
                      start: 'top 85%',
                      end: 'bottom 20%',
                      toggleActions: 'play none none reverse',
                      once: false
                  },
                  opacity: 0,
                  y: 100,
                  duration: 0.8,
                  delay: index * 0.15,
                  ease: 'power2.out'
              });
          });
        }
        
        // Анимация для hero секции
        gsap.from('.hero-content', {
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            opacity: 0,
            y: -50,
            scale: 0.95
        });
        
        // Параллакс для постеров при скролле
        gsap.utils.toArray('.film-poster').forEach(poster => {
            gsap.to(poster, {
                scrollTrigger: {
                    trigger: poster,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: 50,
                ease: 'none'
            });
        });
        
        // Футер появляется с эффектом
        gsap.from('.cinema-footer', {
            scrollTrigger: {
                trigger: '.cinema-footer',
                start: 'top 90%',
                end: 'bottom 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8
        });
    }
    
    // Анимация для кнопок при наведении
    const buttons = document.querySelectorAll('.watch-trailer, .random-btn, .sound-toggle');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: 'back.out(1)'
                });
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'back.in(1)'
                });
            }
        });
    });
    
    // Анимация для имён друзей
    const friends = document.querySelectorAll('.friend-link');
    friends.forEach(friend => {
        friend.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(friend, {
                    y: -3,
                    duration: 0.2,
                    ease: 'power1.out'
                });
            }
        });
        
        friend.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(friend, {
                    y: 0,
                    duration: 0.2,
                    ease: 'power1.in'
                });
            }
        });
    });
}

// Запуск анимаций после загрузки DOM
document.addEventListener('DOMContentLoaded', initAnimations);