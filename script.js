$(document).ready(function () {
    const localStorageKey = 'todoAppData';
    const themeKey = 'theme';
    let currentList = 'list1';
    const maxLists = 5;
    const defaultListNames = ['List 1', 'List 2', 'List 3', 'List 4', 'List 5'];

    // Load data from localStorage
    function loadLists() {
        const savedData = localStorage.getItem(localStorageKey);
        if (savedData) {
            return JSON.parse(savedData);
        }
        let initialData = {};
        for (let i = 1; i <= maxLists; i++) {
            initialData[`list${i}`] = { name: defaultListNames[i - 1], tasks: [] };
        }
        return initialData;
    }

    const lists = loadLists();

    function saveLists() {
        localStorage.setItem(localStorageKey, JSON.stringify(lists));
    }

    function loadTheme() {
        const theme = localStorage.getItem(themeKey);
        if (theme) {
            $('body').addClass(theme);
            $('#toggleDarkMode').text(theme === 'dark-mode' ? '☀️' : '🌙');
        }
    }

    function saveTheme(theme) {
        localStorage.setItem(themeKey, theme);
    }

    function addTask() {
        const taskInput = $('#taskInput');
        const dueTimeInput = $('#dueTimeInput');
        const startTimeInput = $('#startTimeInput');
        const taskText = taskInput.val().trim();
        const dueTime = dueTimeInput.val();
        const startTime = startTimeInput.val();

        if (taskText === '' || dueTime === '' || startTime === '') return;

        lists[currentList].tasks.push({ task: taskText, start: startTime, due: dueTime });
        renderList();
        saveLists();

        taskInput.val('');
        dueTimeInput.val('');
        startTimeInput.val('');
    }

    function renderList() {
        const taskList = $('#taskList');
        taskList.empty();
        lists[currentList].tasks.forEach((item, index) => {
            const listItem = $('<li></li>');

            const deleteBtn = $('<button class="delete-btn">❌</button>');
            deleteBtn.on('click', function () {
                lists[currentList].tasks.splice(index, 1);
                renderList();
                saveLists();
            });

            const checkbox = $('<input type="checkbox" class="task-checkbox">');
            const taskContent = $('<span class="task-content"></span>').text(item.task);
            const startTimeSpan = $('<span class="start-time"></span>').text(`Start: ${item.start}`);
            const dueTimeSpan = $('<span class="due-time"></span>').text(`Due: ${item.due}`);

            const upBtn = $('<button class="up-down-btn up-btn">↑</button>');
            const downBtn = $('<button class="up-down-btn down-btn">↓</button>');
            
            upBtn.on('click', function () {
                if (index > 0) {
                    const temp = lists[currentList].tasks[index];
                    lists[currentList].tasks[index] = lists[currentList].tasks[index - 1];
                    lists[currentList].tasks[index - 1] = temp;
                    renderList();
                    saveLists();
                }
            });

            downBtn.on('click', function () {
                if (index < lists[currentList].tasks.length
