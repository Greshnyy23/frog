const game = {
    energy: 0,
    power: 1,
    autoclickers: 0,
    level: 1,
    experience: 0,
    nextLevelExp: 1000,
    levels: [],
    prestigeMultiplier: 1,
    nextHarvestTime: 10,
    upgrades: [
        { id: 'powerUpgrade', name: 'Улучшение мощности', cost: 50, effect: 'power', value: 1, description: 'Увеличивает количество энергии за клик.' },
        { id: 'autoclickerUpgrade', name: 'Авто-кликер', cost: 100, effect: 'autoclickers', value: 1, description: 'Автоматически собирает энергию.' },
        { id: 'clickIncomeUpgrade', name: 'Увеличение дохода от клика', cost: 150, effect: 'power', value: 2, description: 'Значительно увеличивает количество энергии за клик.' },
        { id: 'bonusAutoclicker', name: 'Бонусный Авто-кликер', cost: 300, effect: 'autoclickers', value: 1, description: 'Получите дополнительный авто-кликер за уровень.' }
    ],
    quests: [
        { id: 1, description: "Собрать 100 энергии", reward: 50, isCompleted: false },
        { id: 2, description: "Достигнуть 10 уровня", reward: 100, isCompleted: false }
    ],
    saveKey: 'nexusTapCoinGame',
    timerInterval: null,

    init: () => {
        game.generateLevels();
        game.loadGame();
        game.updateUI();
        game.createUpgrades();
        game.createQuests();
        game.addEventListeners();
        game.startTimer();
    },

    generateLevels: () => {
        let expToNext = 1000;
        for (let i = 1; i <= 100; i++) {
            game.levels.push(expToNext);
            expToNext = Math.floor(expToNext * 1.1);
        }
    },

    addEventListeners: () => {
        document.getElementById('harvest-button').addEventListener('click', game.harvestEnergy);
        document.getElementById('prestige-button').addEventListener('click', game.prestige);
        document.getElementById('theme-toggle').addEventListener('click', game.toggleTheme);
    },

    loadGame: () => {
        const savedGame = localStorage.getItem(game.saveKey);
        if (savedGame) {
            try {
                Object.assign(game, JSON.parse(savedGame));
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
                localStorage.removeItem(game.saveKey);
            }
        }
    },

    saveGame: () => {
        const saveData = {
            energy: game.energy,
            power: game.power,
            autoclickers: game.autoclickers,
            level: game.level,
            experience: game.experience,
            nextLevelExp: game.nextLevelExp,
            prestigeMultiplier: game.prestigeMultiplier
        };
        localStorage.setItem(game.saveKey, JSON.stringify(saveData));
    },

    harvestEnergy: () => {
        const gainedEnergy = game.power * game.prestigeMultiplier;
        game.energy += gainedEnergy;
        game.experience += gainedEnergy; 
        game.checkLevelUp(); 
        game.checkQuests(); 
        game.updateUI();
        game.saveGame();
        game.showNotification(`+${gainedEnergy} энергии`);
    },

    checkLevelUp: () => {
        while (game.experience >= game.nextLevelExp) {
            game.level++;
            game.experience -= game.nextLevelExp;

            let rewardType = Math.random();
            let rewardDescription;

            if (rewardType < 0.33) {
                game.power += 1;
                rewardDescription = `Вы получили +1 к мощности! Теперь мощность: ${game.power}`;
            } else if (rewardType < 0.66) {
                game.autoclickers += 1;
                rewardDescription = `Вы получили +1 автокликер! Теперь количество автокликеров: ${game.autoclickers}`;
            } else {
                game.energy += 100;
                rewardDescription = `Вы получили +100 энергии! Теперь энергия: ${game.energy}`;
            }

            game.nextLevelExp = game.levels[game.level - 1] || game.nextLevelExp * 2;
            game.showNotification(`Уровень повышен! ${rewardDescription}`);
        }
    },

    checkQuests: () => {
        game.quests.forEach(quest => {
            if (!quest.isCompleted) {
                switch(quest.id) {
                    case 1:
                        if (game.energy >= 100) {
                            quest.isCompleted = true;
                            game.energy += quest.reward;
                            game.showNotification(`Квест выполнен: ${quest.description}! Награда: ${quest.reward} энергии.`);
                        }
                        break;
                    case 2:
                        if (game.level >= 10) {
                            quest.isCompleted = true;
                            game.energy += quest.reward;
                            game.showNotification(`Квест выполнен: ${quest.description}! Награда: ${quest.reward} энергии.`);
                        }
                        break;
                }
            }
        });
    },

    prestige: () => {
        if (game.energy >= 1000) {
            game.showNotification("Престиж активирован! Ваш прогресс сброшен.");
            game.prestigeMultiplier *= 2;
            game.energy = 0;
            game.power = 1;
            game.autoclickers = 0;
            game.level = 1;
            game.experience = 0;
            game.nextLevelExp = 1000;
            game.updateUI();
            game.saveGame();
        } else {
            game.showNotification("Недостаточно энергии для престижа! Нужно 1000 энергии.");
        }
    },

    toggleTheme: () => {
        document.body.classList.toggle('light-mode');
    },

    updateUI: () => {
        document.getElementById('coins').textContent = game.energy;
        document.getElementById('core-power').textContent = game.power;
        document.getElementById('neuro-clicks').textContent = game.autoclickers;
        document.getElementById('level').textContent = game.level;

        const progressBar = document.getElementById('matrix-progress');
        const nextLvlExp = game.levels[game.level - 1] || game.nextLevelExp * 2;
        const progressPercentage = Math.min(100, (game.experience / nextLvlExp) * 100);
        progressBar.style.width = `${progressPercentage}%`;

        game.createUpgrades();
        game.createQuests();
    },

    startTimer: () => {
        let timerDisplay = document.getElementById('timer-display');

        game.timerInterval = setInterval(() => {
            if (game.nextHarvestTime > 0) {
                game.nextHarvestTime--;
                timerDisplay.textContent = game.nextHarvestTime;
            } else {
                game.harvestEnergy();
                game.nextHarvestTime = 10;
                timerDisplay.textContent = game.nextHarvestTime;
            }
        }, 1000); 
    },

    showNotification: (message) => {
        const notificationContainer = document.getElementById('notification');
        notificationContainer.textContent = message;
        notificationContainer.classList.add('show');
        
        setTimeout(() => {
            notificationContainer.classList.remove('show');
        }, 3000);
    },

    createUpgrades: () => {
        const upgradesContainer = document.getElementById('upgrades-section');
        upgradesContainer.innerHTML = '';
        game.upgrades.forEach(upgrade => {
            const card = document.createElement('div');
            card.classList.add('upgrade-card', 'card');
            card.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            card.innerHTML = `
                <h3>${upgrade.name}</h3>
                <p>Стоимость: <span class="cost">${upgrade.cost}</span> энергии</p>
                <p>${upgrade.description}</p>
            `;
            card.addEventListener('click', () => game.buyUpgrade(upgrade));
            upgradesContainer.appendChild(card);
        });
    },

    buyUpgrade: (upgrade) => {
        if (game.energy >= upgrade.cost) {
            game.energy -= upgrade.cost;
            game[upgrade.effect] += upgrade.value;
            game.showNotification(`Улучшение "${upgrade.name}" приобретено!`);
            game.updateUI();
            game.saveGame();
        } else {
            game.showNotification("Недостаточно энергии!");
        }
    },

    createQuests: () => {
        const questsContainer = document.getElementById('quests-section');
        questsContainer.innerHTML = '';
        game.quests.forEach(quest => {
            const card = document.createElement('div');
            card.classList.add('quest-card', 'card');
            card.classList.add(quest.isCompleted ? 'completed' : 'hover');
            card.style.backgroundColor = quest.isCompleted ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 165, 0, 0.2)';
            card.innerHTML = `
                <h3>${quest.description}</h3>
                <p>Награда: ${quest.reward} энергии</p>
            `;
            card.addEventListener('click', () => {
                if (!quest.isCompleted) {
                    game.showNotification(`Квест "${quest.description}" завершен!`);
                    quest.isCompleted = true;
                    game.energy += quest.reward;
                    game.updateUI();
                }
            });
            questsContainer.appendChild(card);
        });
    },
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('background-music').play(); 
    game.init(); 
});