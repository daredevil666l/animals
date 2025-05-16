document.addEventListener('DOMContentLoaded', () => {
  // Элементы DOM
  const startScreen = document.getElementById('start-screen');
  const startButton = document.getElementById('start-btn');
  const quizContainer = document.getElementById('quiz-container');
  const questionContainer = document.getElementById('question-container');
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const imageContainer = document.getElementById('image-container');
  const questionImage = document.getElementById('question-image');
  const nextButton = document.getElementById('next-btn');
  const prevButton = document.getElementById('prev-btn');
  const resultContainer = document.getElementById('result-container');
  const scoreElement = document.getElementById('score');
  const maxScoreElement = document.getElementById('max-score');
  const restartButton = document.getElementById('restart-btn');
  const currentQuestionElement = document.getElementById('current-question');
  const totalQuestionsElement = document.getElementById('total-questions');

  // Переменные состояния
  let currentQuestionIndex = 0;
  let score = 0;
  let userAnswers = [];
  let selectedQuestions = [];
  const QUESTIONS_PER_QUIZ = 5;

  // Инициализация
  function initQuiz() {
    // Выбираем случайные 5 вопросов из общего списка
    selectedQuestions = getRandomQuestions(quizData, QUESTIONS_PER_QUIZ);
    
    totalQuestionsElement.textContent = QUESTIONS_PER_QUIZ;
    userAnswers = Array(QUESTIONS_PER_QUIZ).fill(null);
    
    // Показываем стартовый экран
    startScreen.classList.remove('hidden');
    quizContainer.classList.add('hidden');
    resultContainer.classList.add('hidden');
    
    // Обработчики событий
    startButton.addEventListener('click', startQuiz);
    nextButton.addEventListener('click', handleNextButton);
    prevButton.addEventListener('click', handlePrevButton);
    restartButton.addEventListener('click', restartQuiz);
  }
  
  // Функция для выбора случайных вопросов
  function getRandomQuestions(questions, count) {
    // Если вопросов меньше, чем нужно, вернем все имеющиеся
    if (questions.length <= count) return [...questions];
    
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  // Начало теста
  function startQuiz() {
    startScreen.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    showQuestion(0);
  }

  // Показать вопрос
  function showQuestion(index) {
    const question = selectedQuestions[index];
    questionText.textContent = question.question;
    currentQuestionElement.textContent = index + 1;
    
    // Обработка изображения
    if (question.image && question.image !== 'url') {
      questionImage.src = question.image;
      imageContainer.classList.remove('hidden');
    } else {
      imageContainer.classList.add('hidden');
    }
    
    // Очистка и создание вариантов ответов
    optionsContainer.innerHTML = '';
    question.options.forEach((option, optionIndex) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'option relative p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors cursor-pointer';
      
      // Если пользователь уже отвечал на этот вопрос
      if (userAnswers[index] === optionIndex) {
        optionElement.classList.add('selected', 'bg-white/10');
      }
      
      optionElement.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="option-text text-sm">${option}</span>
          <span class="option-indicator ${userAnswers[index] === optionIndex ? '' : 'opacity-0'}">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </span>
        </div>
      `;
      
      optionElement.addEventListener('click', () => selectOption(optionIndex));
      optionsContainer.appendChild(optionElement);
    });
    
    // Обновление кнопок навигации
    updateNavigationButtons();
  }

  // Выбор варианта ответа
  function selectOption(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
    
    // Обновление визуального выбора
    const options = optionsContainer.querySelectorAll('.option');
    options.forEach((option, index) => {
      if (index === optionIndex) {
        option.classList.add('selected', 'bg-white/10');
        option.querySelector('.option-indicator').classList.remove('opacity-0');
      } else {
        option.classList.remove('selected', 'bg-white/10');
        option.querySelector('.option-indicator').classList.add('opacity-0');
      }
    });
  }

  // Обработка кнопки "Next"
  function handleNextButton() {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      currentQuestionIndex++;
      showQuestion(currentQuestionIndex);
    } else {
      showResults();
    }
  }

  // Обработка кнопки "Previous"
  function handlePrevButton() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      showQuestion(currentQuestionIndex);
    }
  }

  // Обновление кнопок навигации
  function updateNavigationButtons() {
    if (currentQuestionIndex === 0) {
      prevButton.classList.add('hidden');
    } else {
      prevButton.classList.remove('hidden');
    }
    
    if (currentQuestionIndex === selectedQuestions.length - 1) {
      nextButton.textContent = 'Завершить';
    } else {
      nextButton.textContent = 'Далее';
    }
  }

  // Показать результаты
  function showResults() {
    // Подсчет правильных ответов
    score = 0;
    userAnswers.forEach((answer, index) => {
      if (answer !== null && selectedQuestions[index].options[answer] === selectedQuestions[index].correctAnswer) {
        score++;
      }
    });
    
    // Отображение результатов
    scoreElement.textContent = score;
    maxScoreElement.textContent = QUESTIONS_PER_QUIZ;
    
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
  }

  // Перезапуск теста
  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    
    // Выбираем новые случайные вопросы
    selectedQuestions = getRandomQuestions(quizData, QUESTIONS_PER_QUIZ);
    userAnswers = Array(QUESTIONS_PER_QUIZ).fill(null);
    
    resultContainer.classList.add('hidden');
    startScreen.classList.remove('hidden');
  }

  // Запуск теста
  initQuiz();
});
