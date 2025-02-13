const achievements = JSON.parse(localStorage.getItem('achievements')) || [
    { id: 1, description: "Соберите 10 очков", threshold: 10, completed: false },
    { id: 2, description: "Соберите 100 очков", threshold: 100, completed: false },
    { id: 3, description: "Купить 1 улучшение", threshold: 1, completed: false, count: 0 },
    { id: 4, description: "Кликните 50 раз", threshold: 50, completed: false, count: 0 }
];

// Отображение достижений
function renderAchievements() {
    const achievementsContainer = document.getElementById('achievementsContainer');
    achievementsContainer.innerHTML = '';
    achievements.forEach(achievement => {
        const achievementCard = document.createElement('div');
        achievementCard.className = 'achievement-card ' + (achievement.completed ? 'completed' : '');
        achievementCard.innerHTML = achievement.description + (achievement.completed ? " (Получено)" : "");
        achievementsContainer.appendChild(achievementCard);
    });
}

// Обработчик для кнопки "Назад"
document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = 'index.html'; // Переход на главную страницу
});

// Инициализация
renderAchievements();