// База данных планет (упрощенные средние расстояния от Солнца в километрах)
const planetsData = {
    mercury: { name: "Меркурия", distanceFromSun: 57.9e6, image: "mercury.jpg" },
    venus: { name: "Венеры", distanceFromSun: 108.2e6, image: "venus.jpg" },
    earth: { name: "Земли", distanceFromSun: 149.6e6, image: "earth.jpg" },
    mars: { name: "Марса", distanceFromSun: 227.9e6, image: "mars.jpg" },
    jupiter: { name: "Юпитера", distanceFromSun: 778.5e6, image: "jupiter.jpg" },
    saturn: { name: "Сатурна", distanceFromSun: 1432.0e6, image: "saturn.jpg" },
    uranus: { name: "Урана", distanceFromSun: 2867.0e6, image: "uranus.jpg" },
    neptune: { name: "Нептуна", distanceFromSun: 4515.0e6, image: "neptune.jpg" }
};

// Элементы DOM
const planetSelect = document.getElementById('planet-select');
const useLocationCheckbox = document.getElementById('use-location');
const manualLocationDiv = document.getElementById('manual-location');
const coordinatesInput = document.getElementById('coordinates');
const calculateBtn = document.getElementById('calculate-btn');
const resultPanel = document.getElementById('result-panel');
const locationNameSpan = document.getElementById('location-name');
const planetNameSpan = document.getElementById('planet-name');
const distanceValueP = document.getElementById('distance-value');
const comparisonP = document.getElementById('comparison');
const planetsContainer = document.querySelector('.planets-container');

// 1. Загружаем галерею планет
function loadPlanetGallery() {
    for (const [key, planet] of Object.entries(planetsData)) {
        const planetCard = document.createElement('div');
        planetCard.className = 'planet-card';
        planetCard.innerHTML = `
            <img src="images/${planet.image}" alt="${planet.name}" title="${planet.name}">
            <p>${planet.name}</p>
        `;
        planetsContainer.appendChild(planetCard);
    }
}

// 2. Обработчик переключателя "Мое местоположение"
useLocationCheckbox.addEventListener('change', function() {
    manualLocationDiv.style.display = this.checked ? 'none' : 'block';
});

// 3. Функция получения текущих координат пользователя
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!useLocationCheckbox.checked) {
            // Парсим ручной ввод
            const coords = coordinatesInput.value.split(',').map(Number);
            if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                resolve({ latitude: coords[0], longitude: coords[1] });
            } else {
                reject("Введите корректные координаты.");
            }
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve(position.coords);
                },
                (error) => {
                    reject("Не удалось получить ваше местоположение. Разрешите доступ к геолокации или введите координаты вручную.");
                }
            );
        } else {
            reject("Геолокация не поддерживается вашим браузером.");
        }
    });
}

// 4. Упрощенная функция расчета расстояния (по теореме косинусов для сферы)
// Это модель! Реальное расстояние зависит от времени года и положения планет на орбите.
function calculateDistance(userCoords, targetPlanetKey) {
    const earthRadius = 6371; // Радиус Земли в км
    const targetPlanet = planetsData[targetPlanetKey];

    // Предположим, что планеты висят неподвижно на своих орбитах.
    // Это, конечно, не так, но для учебного проекта сгодится.
    // Мы вычисляем расстояние между точкой на Земле и точкой на орбите планеты.

    // Упрощение: считаем, что расстояние от Земли до планеты - это разница их расстояний от Солнца.
    // Это очень грубое приближение, но простое для понимания.
    const averageDistanceToPlanet = Math.abs(targetPlanet.distanceFromSun - planetsData.earth.distanceFromSun);

    // Добавим "случайность" для имитации движения по орбите (можно заменить на реальные формулы, если хочешь сложнее)
    const variation = averageDistanceToPlanet * 0.2; // Вариация 20%
    const simulatedDistance = averageDistanceToPlanet + (Math.random() * variation - variation / 2);

    return Math.round(simulatedDistance / 1000) * 1000; // Округляем до тысяч км для красоты
}

// 5. Функция для сравнения расстояния с чем-то понятным (например, длиной экватора Земли)
function getComparisonString(distanceKm) {
    const earthCircumference = 40075; // Длина экватора Земли в км
    const comparisons = distanceKm / earthCircumference;
    return `Это расстояние равняется ${comparisons.toFixed(1)} путешествиям вокруг Земли по экватору!`;
}

// 6. Обработчик нажатия на кнопку "Рассчитать"
calculateBtn.addEventListener('click', function() {
    const selectedPlanet = planetSelect.value;

    getUserLocation()
        .then(userCoords => {
            // Вычисляем расстояние
            const distance = calculateDistance(userCoords, selectedPlanet);
            const comparison = getComparisonString(distance);

            // Обновляем интерфейс
            locationNameSpan.textContent = useLocationCheckbox.checked ? "твоей точки" : "заданной точки";
            planetNameSpan.textContent = planetsData[selectedPlanet].name;
            distanceValueP.textContent = distance.toLocaleString('ru-RU') + " км";
            comparisonP.textContent = comparison;

            // Показываем результат
            resultPanel.style.display = 'block';
        })
        .catch(error => {
            alert(error);
        });
});

// Инициализация галереи при загрузке страницы
window.onload = loadPlanetGallery;