import { starWars } from '../lib/star-wars.js';

document.addEventListener('DOMContentLoaded', function () {
    // Элементы для поиска по query
    const search = document.getElementById('Search');
    const button = document.getElementById('byQueryBtn');
    const resultBox = document.getElementById('result-container');
    const content = document.getElementById('content-box');
    const select = document.getElementById('select');
    const deleteButton = document.querySelector('.delete');

    // Элементы для поиска по ID
    const searchByIdInput = document.getElementById('SearchID'); 
    const buttonById = document.getElementById('byIDbtn');
    const selectById = document.getElementById('selectID');
    //спинер
    const spinnerContainer = document.querySelector('.spinnerContainer');

    function showSpinner() {
        spinnerContainer.classList.add('active');
        setTimeout(hideSpinner,5000)
    } 
    
    function hideSpinner() {
        spinnerContainer.classList.remove('active');

    }
    
    // Обработчик для кнопки закрытия (крестик)
    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            if (resultBox) {
                resultBox.classList.add('result');
            }
        });
    }

    // Обработчики для нажатия Enter
    if (search) {
        search.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                button.click();
            }
        });
    }

    // Функция для отображения информации о персонаже
    async function displayCharacterInfo(character) {
        const name = character.name || 'Неизвестно';
        const height = character.height ? `${character.height} см` : 'не указан';
        const mass = character.mass ? `${character.mass} кг` : 'не указан';
        const hairColor = character.hair_color || 'не указан';
        const skinColor = character.skin_color || 'не указан';
        const eyeColor = character.eye_color || 'не указан';
        const birthYear = character.birth_year || 'не указан';
        const gender = character.gender || 'не указан';
        const homeworld = character.homeworld || '';
        const filmsCount = character.films ? character.films.length : 0;
        const speciesCount = character.species ? character.species.length : 0;
        const vehiclesCount = character.vehicles ? character.vehicles.length : 0;
        const starshipsCount = character.starships ? character.starships.length : 0;

        let planetInfo = 'Информация отсутствует';
        if (homeworld) {
            try {
                let planetId = '';
                let parts = homeworld.split('/').filter(part => part.trim() !== '');
                planetId = parts.length > 0 ? parts[parts.length - 1] : '';
                
                if (planetId) {
                    const world = await starWars.getPlanetsById(planetId);
                    planetInfo = `<p><strong>Родная планета:</strong> ${world.name || 'Неизвестно'}</p>`;
                }
            } catch (error) {
                console.error("Ошибка получения планеты:", error);
                planetInfo = `<p><strong>Родная планета:</strong> Не удалось загрузить информацию</p>`;
            }
        }

        return `
            <div class="character-info">
                <p><strong>Имя:</strong> ${name}</p>
                <p><strong>Рост:</strong> ${height}</p>
                <p><strong>Вес:</strong> ${mass}</p>
                <p><strong>Цвет волос:</strong> ${hairColor}</p>
                <p><strong>Цвет кожи:</strong> ${skinColor}</p>
                <p><strong>Цвет глаз:</strong> ${eyeColor}</p>
                <p><strong>Год рождения:</strong> ${birthYear}</p>
                <p><strong>Пол:</strong> ${gender}</p>
                <hr>
                <p><strong>Количество фильмов:</strong> ${filmsCount}</p>
                <p><strong>Количество видов:</strong> ${speciesCount}</p>
                <p><strong>Количество транспорта:</strong> ${vehiclesCount}</p>
                <p><strong>Количество звездолетов:</strong> ${starshipsCount}</p>
                <hr>
                ${planetInfo}
            </div>
        `;
    }

    // Функция для отображения информации о планете
 // Функция для отображения информации о планете
    function displayPlanetInfo(planet) {
        // Проверяем значения на "unknown" или "0"
        const getValue = (value, defaultValue = 'не указан') => {
            if (!value || value === 'unknown' || value === '0') return defaultValue;
            return value;
        };

        // Форматируем числовые значения
        const formatNumber = (value) => {
            const cleanValue = getValue(value);
            if (cleanValue === 'не указан') return cleanValue;
            if (!isNaN(cleanValue) && cleanValue !== '') {
                return new Intl.NumberFormat('ru-RU').format(cleanValue);
            }
            return cleanValue;
        };

        const residentsCount = planet.residents ? planet.residents.length : 0;
        const filmsCount = planet.films ? planet.films.length : 0;

        return `
            <div class="character-info">
                <p><strong>Название:</strong> ${getValue(planet.name, 'Неизвестно')}</p>
                <p><strong>Климат:</strong> ${getValue(planet.climate)}</p>
                <p><strong>Диаметр:</strong> ${getValue(planet.diameter)} ${planet.diameter && planet.diameter !== '0' && planet.diameter !== 'unknown' ? 'км' : ''}</p>
                <p><strong>Гравитация:</strong> ${getValue(planet.gravity)}</p>
                <p><strong>Террейн:</strong> ${getValue(planet.terrain)}</p>
                <p><strong>Поверхностные воды:</strong> ${getValue(planet.surface_water)} ${planet.surface_water && planet.surface_water !== 'unknown' ? '%' : ''}</p>
                <p><strong>Население:</strong> ${formatNumber(planet.population)}</p>
                <hr>
                <p><strong>Период вращения:</strong> ${getValue(planet.rotation_period)} ${planet.rotation_period && planet.rotation_period !== '0' && planet.rotation_period !== 'unknown' ? 'часов' : ''}</p>
                <p><strong>Орбитальный период:</strong> ${getValue(planet.orbital_period)} ${planet.orbital_period && planet.orbital_period !== '0' && planet.orbital_period !== 'unknown' ? 'дней' : ''}</p>
                <hr>
                <p><strong>Количество жителей:</strong> ${residentsCount}</p>
                <p><strong>Количество фильмов:</strong> ${filmsCount}</p>
                <hr>
                <p><strong>Дата создания:</strong> ${getValue(planet.created)}</p>
                <p><strong>Дата редактирования:</strong> ${getValue(planet.edited)}</p>
                <p><strong>URL:</strong> ${planet.url ? `<a href="${planet.url}" target="_blank" rel="noopener noreferrer">${planet.url}</a>` : 'не указан'}</p>
            </div>
        `;
    }

    // Функция для отображения информации о виде
    function displaySpeciesInfo(species) {
        return `
            <div class="character-info">
                <p><strong>Название:</strong> ${species.name || 'Неизвестно'}</p>
                <p><strong>Классификация:</strong> ${species.classification || 'не указана'}</p>
                <p><strong>Обозначение:</strong> ${species.designation || 'не указано'}</p>
                <p><strong>Средний рост:</strong> ${species.average_height ? `${species.average_height} см` : 'не указан'}</p>
                <p><strong>Средняя продолжительность жизни:</strong> ${species.average_lifespan ? `${species.average_lifespan} лет` : 'не указана'}</p>
                <p><strong>Цвет глаз:</strong> ${species.eye_colors || 'не указан'}</p>
                <p><strong>Цвет волос:</strong> ${species.hair_colors || 'не указан'}</p>
                <p><strong>Цвет кожи:</strong> ${species.skin_colors || 'не указан'}</p>
                <p><strong>Язык:</strong> ${species.language || 'не указан'}</p>
            </div>
        `;
    }

    // Общая функция для обновления заголовка
    function updateHeader(type) {
        const messageHeader = document.querySelector('.message-header p');
        if (messageHeader) {
            if (type === 'people') messageHeader.textContent = 'Character Details';
            else if (type === 'planets') messageHeader.textContent = 'Planet Details';
            else if (type === 'species') messageHeader.textContent = 'Species Details';
            else messageHeader.textContent = 'Результаты поиска';
        }
    }

    // Обработчик для поиска по тексту
    button.addEventListener('click', async function () {
        const query = search.value.trim();

        if (!query) {
            alert('Введите текст для поиска');
            return;
        }

        // ПОКАЗЫВАЕМ СПИННЕР
        showSpinner();
        
        // Скрываем результат
        if (resultBox) {
            resultBox.classList.add('result');
        }

        try {
            const searchType = select.value.toLowerCase();
            updateHeader(searchType);
            
            if (searchType === 'people') {
                const result = await starWars.searchCharacters(query);
                
                if (!result.results || result.results.length === 0) {
                    content.innerHTML = '<p class="has-text-danger">Персонажи не найдены</p>';
                    if (resultBox) resultBox.classList.remove('result');
                    hideSpinner();
                    return;
                }
                
                const firstCharacter = result.results[0];
                content.innerHTML = await displayCharacterInfo(firstCharacter);
                
            } else if (searchType === 'planets') {
                const result = await starWars.searchPlanets(query);
                
                if (!result.results || result.results.length === 0) {
                    content.innerHTML = '<p class="has-text-danger">Планеты не найдены</p>';
                    if (resultBox) resultBox.classList.remove('result');
                    hideSpinner();
                    return;
                }
                
                const planet = result.results[0];
                content.innerHTML = displayPlanetInfo(planet);
                
            } else if (searchType === 'species') {
                const result = await starWars.searchSpecies(query);
                
                if (!result.results || result.results.length === 0) {
                    content.innerHTML = '<p class="has-text-danger">Виды не найдены</p>';
                    if (resultBox) resultBox.classList.remove('result');
                    hideSpinner();
                    return;
                }
                
                const species = result.results[0];
                content.innerHTML = displaySpeciesInfo(species);
            }
            
            if (resultBox) {
                resultBox.classList.remove('result');
            }
            
        } catch (error) {
            console.error('Ошибка поиска:', error);
            content.innerHTML = '<p class="has-text-danger">Не удалось выполнить поиск. Попробуйте еще раз.</p>';
            updateHeader('error');
            hideSpinner();
            if (resultBox) resultBox.classList.remove('result');
        } finally {
            // ВСЕГДА скрываем спиннер
            
            hideSpinner();
        }
    });

    // Обработчик для поиска по ID
    buttonById.addEventListener('click', async function () {
        const id = searchByIdInput.value.trim();

        if (!id) {
            alert('Введите ID для поиска');
            return;
        }

        // Проверяем, что ID - число
        if (isNaN(id) || parseInt(id) <= 0) {
            alert('Введите корректный числовой ID');
            return;
        }

        // ПОКАЗЫВАЕМ СПИННЕР
        showSpinner();
        
        // Скрываем результат
        if (resultBox) {
            resultBox.classList.add('result');
        }

        try {
            const searchType = selectById.value.toLowerCase();
            updateHeader(searchType);
            
            if (searchType === 'people') {
                const character = await starWars.getCharactersById(id);
                content.innerHTML = await displayCharacterInfo(character);
                
            } else if (searchType === 'planets') {
                const planet = await starWars.getPlanetsById(id);
                content.innerHTML = displayPlanetInfo(planet);
                
            } else if (searchType === 'species') {
                const species = await starWars.getSpeciesById(id);
                content.innerHTML = displaySpeciesInfo(species);
            }
            
            if (resultBox) {
                resultBox.classList.remove('result');
            }
            
        } catch (error) {
            console.error('Ошибка получения по ID:', error);
            content.innerHTML = '<p class="has-text-danger">Не удалось получить данные по ID. Возможно, ID не существует.</p>';
            updateHeader('error');
            if (resultBox) resultBox.classList.remove('result');
        } finally {
            // ВСЕГДА скрываем спиннер
            hideSpinner();
        }
    });

    // Обработчик Enter для поиска по ID
    if (searchByIdInput) {
        searchByIdInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                buttonById.click();
            }
        });
    }
});