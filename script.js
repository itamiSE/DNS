let database = [];
let selectedCategory = "";
let answers = {};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('db.json');
        database = await response.json();
    } catch (error) {
        console.error('Ошибка загрузки базы данных:', error);
    }

    const rangeInput = document.querySelectorAll(".range-input input"),
        priceInput = document.querySelectorAll(".price-input input"),
        range = document.querySelector(".slider .progress");
    let priceGap = 1000;

    priceInput.forEach((input) => {
        input.addEventListener("input", (e) => {
            let minPrice = parseInt(priceInput[0].value),
                maxPrice = parseInt(priceInput[1].value);

            if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
                if (e.target.className === "input-min") {
                    rangeInput[0].value = minPrice;
                    range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
                } else {
                    rangeInput[1].value = maxPrice;
                    range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
                }
            }
        });
    });

    rangeInput.forEach((input) => {
        input.addEventListener("input", (e) => {
            let minVal = parseInt(rangeInput[0].value),
                maxVal = parseInt(rangeInput[1].value);

            if (maxVal - minVal < priceGap) {
                if (e.target.className === "range-min") {
                    rangeInput[0].value = maxVal - priceGap;
                } else {
                    rangeInput[1].value = minVal + priceGap;
                }
            } else {
                priceInput[0].value = minVal;
                priceInput[1].value = maxVal;
                range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
                range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
            }
        });
    });
});

function showQuestions() {
    const category = document.querySelector('input[name="category"]:checked'); 
    if (category) { 
        selectedCategory = category.value; // Сохраняем выбранную категорию
        document.getElementById("category-selection").style.display = "none";  
        document.getElementById("question-1").style.display = "block";  
    } 
}

function handleAnswer(questionNumber, answer) {
    answers[questionNumber] = answer;

    const currentQuestion = document.getElementById(`question-${questionNumber}`);
    currentQuestion.style.display = "none"; // Скрываем текущий вопрос

    const nextQuestion = document.getElementById(`question-${questionNumber + 1}`);
    if (nextQuestion) {
        nextQuestion.style.display = "block"; // Показываем следующий вопрос
    } else {
        document.getElementById("questions").style.display = "none"; // Скрываем все вопросы
        document.querySelector('.price-input').style.display = "block"; // Показываем диапазон цен
    }
}

function showResults() {
    const minPrice = parseInt(document.querySelector('.input-min').value);
    const maxPrice = parseInt(document.querySelector('.input-max').value);

    let results = database.filter(item => 
        item.type === selectedCategory &&
        item.age === answers[1] &&
        item.gender === answers[2] &&
        item.price >= minPrice && item.price <= maxPrice
    );

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = "<h2>Рекомендации:</h2>";

    if (results.length > 0) {
        results.forEach(item => {
            resultsContainer.innerHTML += `
                <div>
                    <img src="${item.image}" alt="${item.ProductName}" style="width:100px;height:100px;">
                    <p><strong>${item.ProductName}</strong></p>
                    <p>Цена: ${item.price.toLocaleString()} ₽</p>
                    <p>Рейтинг: ${item.rating}</p>
                    <p>ID: ${item.id}</p>
                </div>
            `;
        });
    } else {
        resultsContainer.innerHTML += "<p>К сожалению, подходящих идей не найдено. Вот вся база данных:</p>";
        resultsContainer.innerHTML += '<div class="results-container">'; // Добавляем контейнер для карточек
        database.slice(0, 5).forEach(item => {
            resultsContainer.innerHTML += `
                <div class="product-card">
                    <img src="${item.image}" alt="${item.ProductName}">
                    <div>
                        <h4>${item.ProductName}</h4>
                        <p>${item.description}</p>
                        <p>Цена: ${item.price} (с учётом ID: ${item.id})</p>
                    </div>
                </div>
            `;
        });
        resultsContainer.innerHTML += '</div>'; // Закрываем контейнер карточек
    }

    resultsContainer.style.display = "block";
}

function finishTest() {
    const questionsSection = document.getElementById("questions");
    const resultsContainer = document.getElementById('results');

    // Скрываем раздел вопросов
    questionsSection.style.display = "none"; 

    // Вызываем функцию для показа результатов
    showResults();
}