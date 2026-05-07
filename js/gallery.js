// Генерация и отображение карточек воспоминаний
class Gallery {
    constructor() {
        this.container = document.getElementById('memoriesContainer');
        this.memories = memoriesData;
        this.currentHoverCard = null;
    }
    
    init() {
        if (!this.container) return;
        this.render();
        this.initLazyLoading();
        this.initParallax();
        this.initViewButtons();
    }
    
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = this.memories.map(memory => `
            <div class="swiper-slide">
                <div class="film-card" data-id="${memory.id}">
                    <div class="card-sticky">
                        <div class="card-media">
                            <div class="film-poster" data-id="${memory.id}">
                                <img data-src="${memory.image}" alt="${memory.title}" class="lazy-image">
                                <div class="film-rating">${memory.rating}</div>
                                <div class="view-counter" data-id="${memory.id}">
                                    👁️ ${memory.views}
                                </div>
                            </div>
                        </div>
                        <div class="card-content">
                            <div class="film-meta">
                                <span class="film-year">${memory.year}</span>
                                <span class="film-director">КВЕСТ: ${memory.director}</span>
                            </div>
                            <h2 class="film-title">«${memory.title}»</h2>
                            <div class="film-details">
                                <div class="detail-item">⏱️ ${memory.duration}</div>
                                <div class="detail-item">🏆 ${memory.achievement}</div>
                            </div>
                            <p class="film-synopsis">${memory.synopsis}</p>
                            <div class="film-quote">«${memory.quote}»</div>
                            <button class="watch-trailer" data-id="${memory.id}">📸 Смотреть фото →</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    initLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-image');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    initParallax() {
        const cards = document.querySelectorAll('.film-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${y * 8}deg) 
                    rotateY(${x * 8}deg)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.3s ease';
                setTimeout(() => {
                    card.style.transition = '';
                }, 300);
            });
            
            card.addEventListener('mouseenter', () => {
                if (window.sound) window.sound.play('hover');
            });
        });
    }
    
    initViewButtons() {
        const buttons = document.querySelectorAll('.watch-trailer');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const memory = this.memories.find(m => m.id === id);
                
                if (memory) {
                    // Обновляем счётчик просмотров
                    const newCount = saveViewToStorage(id);
                    const counter = document.querySelector(`.view-counter[data-id="${id}"]`);
                    if (counter) counter.textContent = `👁️ ${newCount}`;
                    
                    // Открываем модальное окно
                    if (window.modalManager) {
                        modalManager.open(memory.image, memory.title, memory.synopsis);
                    }
                    
                    // Звук
                    if (window.sound) window.sound.play('click');
                }
            });
        });
    }
    
    updateCounter(id) {
        const counter = document.querySelector(`.view-counter[data-id="${id}"]`);
        if (counter) {
            const memory = this.memories.find(m => m.id === id);
            if (memory) counter.textContent = `👁️ ${memory.views}`;
        }
    }
}

// Инициализация галереи
let gallery;

document.addEventListener('DOMContentLoaded', () => {
    loadViewsFromStorage();
    gallery = new Gallery();
    gallery.init();
});