// Получение элементов DOM
const input = document.querySelector('input');
const addButton = document.querySelector('button[type="submit"]');
const todoList = document.getElementById('todo-list');
const counter = document.querySelector('p');
const form = document.querySelector('form');// Добавьте форму

let taskCount = 0; // Счётчик задач
let tasks = []; // Массив для хранения задач

// Функция для добавления задачи
function addTask(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const taskText = input.value.trim(); // Получаем и очищаем текст задачи

    if (taskText === '') return; // Если поле пустое, ничего не делаем

    // Создаём объект задачи
    const task = {
        id: Date.now(),           // уникальный id
        text: taskText,
        isComplete: false
    };

    // Добавляем задачу в массив
    tasks.push(task);

    // Создаём новый элемент списка
    const li = document.createElement('li');

    // Добавляем текст задачи и кнопку удаления (с data-id)
    li.innerHTML = `
        <span class="task-text" data-id="${task.id}">${taskText}</span>
        <button class="delete-button" data-id="${task.id}">Удалить</button>
    `;

    // Добавляем элемент в список
    todoList.appendChild(li);

    // Очищаем поле ввода
    input.value = '';

    // Обновляем счётчик
    updateCounter();

    // Добавляем обработчик для кнопки удаления
    const deleteButton = li.querySelector('.delete-button');
    deleteButton.addEventListener('click', deleteTask);

    // Сохраняем в localStorage
    saveTasks();
}
// Функция для удаления задачи
function deleteTask(event) {
    const li = event.target.closest('li'); // Находим ближайший элемент li
    const taskId = Number(event.target.dataset.id); // Получаем ID задачи

    // Удаляем задачу из массива и сохраняем в localStorage
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();

    // Удаляем элемент из списка
    li.remove();

    // Обновляем счётчик
    updateCounter();
}
// Функция для обновления счётчика
function updateCounter() {
    counter.textContent = `Всего: ${tasks.length}`;
}
// Функция для переключения состояния задачи
function toggleTaskCompletion(event) {
    const taskText = event.target;
    const taskId = Number(taskText.dataset.id); // Получаем ID задачи
    taskText.classList.toggle('task-completed');

    // Обновляем статус задачи и сохраняем в localStorage
    const task = tasks.find(task => task.id === taskId);
    task.isComplete = taskText.classList.contains('task-completed');
    saveTasks();
}

// Функция для сохранения задач в localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Функция для загрузки задач из localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="task-text" data-id="${task.id}">${task.text}</span>
                <button class="delete-button" data-id="${task.id}">Удалить</button>
            `;
            if (task.isComplete) {
                li.querySelector('.task-text').classList.add('task-completed');
            }
            todoList.appendChild(li);
            const deleteButton = li.querySelector('.delete-button');
            deleteButton.addEventListener('click', deleteTask);
        });
        taskCount = tasks.length;
        updateCounter();
    }
}

// Загрузка задач при загрузке страницы
loadTasks();

// Обработчики событий
form.addEventListener('submit', addTask); // Добавляем задачу при отправке формы

// Делегирование события клика на задачи
todoList.addEventListener('click', (event) => {
    if (event.target.classList.contains('task-text')) {
        toggleTaskCompletion(event);
    }
});