class Gallery {
    constructor() {
        this.container = document.getElementById('memoriesContainer');
        this.memories = memoriesData;
        this.init();
    }
    
    init() {
        if (!this.container) return;
        this.render();
        // После рендера пересчитываем изображения для прелоадера
        if (window.recalcPreloader) {
            setTimeout(() => window.recalcPreloader(), 100);
        }
        this.initLazyLoading();
        this.initParallax();
        this.initViewButtons();
    }
    
    render() {
        this.container.innerHTML = this.memories.map((memory, index) => `
            <div class="swiper-slide">
                <div class="film-card" data-id="${memory.id}">
                    <div class="card-sticky">
                        <div class="card-media">
                            <div class="film-poster" data-id="${memory.id}">
                                <img 
                                    src="${index === 0 ? memory.image : 'placeholder.webp'}"
                                    data-src="${memory.image}"
                                    alt="${memory.title}"
                                    ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}
                                    class="lazy-image"
                                >

                                <div class="film-rating">${memory.rating}</div>
                                <div class="view-counter" data-id="${memory.id}">
                                    👁️ ${memory.views}
                                </div>
                            </div>
                        </div>

                        <div class="card-content">
                            <div class="film-meta">
                                <span class="film-year">${memory.year}</span>
                                <span class="film-director">
                                    КВЕСТ: ${memory.director}
                                </span>
                            </div>

                            <h2 class="film-title">«${memory.title}»</h2>

                            <div class="film-details">
                                <div class="detail-item">
                                    ⏱️ ${memory.duration}
                                </div>

                                <div class="detail-item">
                                    🏆 ${memory.achievement}
                                </div>
                            </div>

                            <p class="film-synopsis">
                                ${memory.synopsis}
                            </p>

                            <div class="film-quote">
                                «${memory.quote}»
                            </div>

                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <button class="watch-trailer" data-id="${memory.id}">
                                    📸 Смотреть фото →
                                </button>

                                <button class="like-btn" data-id="${memory.id}">
                                    ❤️ 
                                    <span class="likes-count">
                                        ${memory.likes || 0}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        
        // Инициализация лайков (сохраняем в localStorage)
        document.querySelectorAll('.like-btn').forEach(btn => {
            const id = btn.dataset.id;
            const countSpan = btn.querySelector('.likes-count');
            const savedLikes = localStorage.getItem(`like_${id}`);
            if (savedLikes) countSpan.textContent = savedLikes;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                let likes = parseInt(countSpan.textContent) || 0;
                likes++;
                countSpan.textContent = likes;
                localStorage.setItem(`like_${id}`, likes);
                btn.classList.add('liked');
                setTimeout(() => btn.classList.remove('liked'), 300);
                if (window.sound) window.sound.play('click');
            });
        });
    }
    
    initLazyLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });
        document.querySelectorAll('.lazy-image').forEach(img => observer.observe(img));
    }
    
    initParallax() {
        document.querySelectorAll('.film-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(1000px) rotateX(${y * 8}deg) rotateY(${x * 8}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
            card.addEventListener('mouseenter', () => { if(window.sound) window.sound.play('hover'); });
        });
    }
    
    initViewButtons() {
        document.querySelectorAll('.watch-trailer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const memory = this.memories.find(m => m.id === id);
                if (memory) {
                    const newCount = saveViewToStorage(id);
                    const counter = document.querySelector(`.view-counter[data-id="${id}"]`);
                    if (counter && typeof animateCounter !== 'undefined') {
                        animateCounter(counter, newCount);
                    } else if (counter) {
                        counter.textContent = `👁️ ${newCount}`;
                    }
                    if (window.modalManager) modalManager.open(memory.image, memory.title, memory.synopsis);
                    if (window.sound) window.sound.play('click');
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadViewsFromStorage();
    window.gallery = new Gallery();
});