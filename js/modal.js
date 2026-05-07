// Модальное окно для просмотра фото
class ModalManager {
    constructor() {
        this.modal = document.getElementById('modal');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDesc = document.getElementById('modalDesc');
        this.closeBtn = document.getElementById('modalClose');
        
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        // Закрытие по кнопке
        this.closeBtn?.addEventListener('click', () => this.close());
        
        // Закрытие по клику на фон
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) this.close();
        });
    }
    
    open(imageUrl, title, description) {
        if (!this.modal) return;
        
        this.modalImage.src = imageUrl;
        this.modalTitle.textContent = title;
        this.modalDesc.textContent = description;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Воспроизводим звук при открытии
        if (window.sound) window.sound.play('click');
    }
    
    close() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    isOpen() {
        return this.modal?.classList.contains('active') || false;
    }
}

// Создаём глобальный экземпляр
const modalManager = new ModalManager();