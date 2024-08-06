$(document).ready(function () {
    const localStorageKey = 'todoAppData';
    const themeKey = 'theme';
    let currentList = 'list1';
    const maxLists = 5;
    const defaultListNames = ['List 1', 'List 2', 'List 3', 'List 4', 'List 5'];

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
        const startTimeInput = $('#startTimeInput');
        const dueTimeInput = $('#dueTimeInput');
        const taskText = taskInput.val().trim();
        const startTime = startTimeInput.val();
        const dueTime = dueTimeInput.val();

        if (taskText === '' || dueTime === '') return;

        lists[currentList].tasks.push({ task: taskText, startTime, dueTime });
        renderList();
        saveLists();

        taskInput.val('');
        startTimeInput.val('');
        dueTimeInput.val('');
    }

    function renderList() {
        const taskList = $('#taskList');
        taskList.empty();
        lists[currentList].tasks.forEach((item, index) => {
            const listItem = $('<li></li>');

            const checkbox = $('<input type="checkbox" class="task-checkbox">');

            const taskContent = $('<span class="task-content"></span>').text(item.task);

            const startTimeSpan = $('<span class="start-time"></span>').text(item.startTime);
            const dueTimeSpan = $('<span class="due-time"></span>').text(item.dueTime);

            const deleteBtn = $('<button class="delete-btn">✖</button>');
            deleteBtn.on('click', function () {
                lists[currentList].tasks.splice(index, 1);
                renderList();
                saveLists();
            });

            const upBtn = $('<button class="move-btn">⬆️</button>');
            upBtn.on('click', function () {
                if (index > 0) {
                    const temp = lists[currentList].tasks[index - 1];
                    lists[currentList].tasks[index - 1] = lists[currentList].tasks[index];
                    lists[currentList].tasks[index] = temp;
                    renderList();
                    saveLists();
                }
            });

            const downBtn = $('<button class="move-btn">⬇️</button>');
            downBtn.on('click', function () {
                if (index < lists[currentList].tasks.length - 1) {
                    const temp = lists[currentList].tasks[index + 1];
                    lists[currentList].tasks[index + 1] = lists[currentList].tasks[index];
                    lists[currentList].tasks[index] = temp;
                    renderList();
                    saveLists();
                }
            });

            const taskInfo = $('<div class="task-info"></div>');
            taskInfo.append(taskContent, startTimeSpan, deleteBtn, dueTimeSpan);

            listItem.append(checkbox, taskInfo, upBtn, downBtn);
            taskList.append(listItem);
        });
    }

    function switchTab(newList) {
        currentList = newList;
        renderList();
    }

    function updateTabNames() {
        $('.tab').each(function (index) {
            $(this).text(lists[`list${index + 1}`].name);
        });
    }

    $('#addTaskBtn').on('click', addTask);

    $('#taskInput').on('keypress', function (e) {
        if (e.which === 13) {
            addTask();
        }
    });

    $('#toggleDarkMode').on('click', function () {
        $('body').toggleClass('dark-mode');
        const theme = $('body').hasClass('dark-mode') ? 'dark-mode' : '';
        $(this).text(theme === 'dark-mode' ? '☀️' : '🌙');
        saveTheme(theme);
    });

    $('.tab').on('click', function () {
        $('.tab').removeClass('active');
        $(this).addClass('active');
        const listIndex = $(this).index() + 1;
        switchTab(`list${listIndex}`);
    });

    $('.tab').each(function (index) {
        const listIndex = index + 1;
        $(this).text(lists[`list${listIndex}`].name).on('dblclick', function () {
            const newName = prompt('Enter new list name:', lists[`list${listIndex}`].name);
            if (newName) {
                lists[`list${listIndex}`].name = newName;
                saveLists();
                updateTabNames();
            }
        });
    });

    loadTheme();
    renderList();
    updateTabNames();
});
