// Данные о квестах
const memoriesData = [
    {
        id: 1,
        title: "Номер 113. Не выселяться",
        year: "8 jan 2026",
        director: "Lucky Hotel | Люкс 113",
        duration: "1.5 часа",
        achievement: "11 000 ₽ / 5 участников",
        synopsis: "Проклятый отель не отпускает. Эльза возвращается под чужим именем, чтобы заселиться в люкс 113. Мы — её команда. В коридорах — шёпот, в зеркалах — лица из прошлого. Алёна нашла дневник горничной, Даша расшифровала старые регистрационные карты, Илья услышал шаги Томми... А Рита и Даня остановили время, когда тьма уже настигала. Отель показал нам воспоминания, которые нельзя изменить — но можно использовать, чтобы выбраться.",
        quote: "«Если вас поглотила тьма, значит, Томми рядом... Но мы были громче его шёпота.»",
        image: "assets/images/lucky-hotel-poster.jpeg",
        rating: "🌑 10/10 — «Тьма внутри»",
        views: 0,
        likes: 0
    },
    {
        id: 2,
        title: "Зеркальный лабиринт",
        year: "2023",
        director: "Побег из проклятого особняка",
        duration: "44 минуты",
        achievement: "IQ команды: 140+",
        synopsis: "Илья виртуозно разгадал зеркальную головоломку, а Артём без страха открыл потайную дверь. Чистое адреналиновое безумие и море смеха после финала.",
        quote: "Когда лазеры активировались, мы кричали так, что охрана прибежала!",
        image: "https://picsum.photos/id/106/800/1000",
        rating: "🏃‍♂️ 9.5/10",
        views: 0,
        contributors: ["Илья", "Артём"]
    },
    {
        id: 3,
        title: "Матрица сломана",
        year: "2023",
        director: "Лабиринт иллюзий",
        duration: "62 минуты",
        achievement: "Рекорд команды",
        synopsis: "Даша просчитала все ходы на 3 шага вперёд, благодаря чему мы вышли с лучшим временем. Мозг кипел, но эмоции переполняли!",
        quote: "Столько подсказок мы ещё никогда не использовали, но это того стоило!",
        image: "https://picsum.photos/id/20/800/1000",
        rating: "🧠 10/10",
        views: 0,
        contributors: ["Даша"]
    },
    {
        id: 4,
        title: "Последний пазл",
        year: "2024",
        director: "Заговор теней",
        duration: "51 минута",
        achievement: "5 загадок",
        synopsis: "Рита угадала шифр с первого раза! Финальная сцена с лазерами — это было нечто невероятное. Настоящий детективный боевик.",
        quote: "Я чувствовала себя агентом 007, когда мы крались в темноте.",
        image: "https://picsum.photos/id/26/800/1000",
        rating: "🕵️‍♀️ 10/10",
        views: 0,
        contributors: ["Рита"]
    },
    {
        id: 5,
        title: "Идеальный побег",
        year: "2024",
        director: "Секретный бункер",
        duration: "37 минут",
        achievement: "Лучшее время",
        synopsis: "Командная работа была flawless (безупречна). Мы действовали как единый механизм. А после квеста — молочные коктейли и смех до утра.",
        quote: "Я до сих пор не понимаю, как мы так быстро! Это был чистый поток.",
        image: "https://picsum.photos/id/96/800/1000",
        rating: "⚡ 10/10",
        views: 0,
        contributors: ["Все"]
    },
    {
        id: 6,
        title: "Космическое приключение",
        year: "2024",
        director: "Астральный побег",
        duration: "48 минут",
        achievement: "За гранью реальности",
        synopsis: "Последний квест перед учебой — идеальное завершение лета. Крутые декорации и загадки будущего. Вместе мы сила!",
        quote: "Когда открылась финальная дверь, у нас был настоящий взрыв эмоций!",
        image: "https://picsum.photos/id/29/800/1000",
        rating: "🚀 9.9/10",
        views: 0,
        contributors: ["Даша", "Алёна", "Илья", "Артём", "Рита"]
    }
];

// Сохранение и загрузка просмотров
function loadViewsFromStorage() {
    memoriesData.forEach(memory => {
        const saved = localStorage.getItem(`view_${memory.id}`);
        if (saved) memory.views = parseInt(saved);
    });
}

function saveViewToStorage(id) {
    const memory = memoriesData.find(m => m.id === id);
    if (memory) {
        memory.views++;
        localStorage.setItem(`view_${memory.id}`, memory.views);
        return memory.views;
    }
    return 0;
}

// Получение случайного воспоминания
function getRandomMemory() {
    const randomIndex = Math.floor(Math.random() * memoriesData.length);
    return memoriesData[randomIndex];
}