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

    function generateTimeOptions() {
        const timePicker = $('#timePicker');
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const formattedHour = hour < 10 ? `0${hour}` : hour;
                const formattedMinute = minute < 10 ? `0${minute}` : minute;
                const timeString = `${formattedHour}:${formattedMinute}`;
                timePicker.append(`<option value="${timeString}">${timeString}</option>`);
            }
        }
    }

    function addTask() {
        const taskInput = $('#taskInput');
        const dueDateInput = $('#dueDateInput');
        const timePicker = $('#timePicker');
        const taskText = taskInput.val().trim();
        const dueDate = dueDateInput.val();
        const dueTime = timePicker.val();

        if (taskText === '' || dueDate === '' || dueTime === '') return;

        lists[currentList].tasks.push({ task: taskText, dueDate: `${dueDate} ${dueTime}` });
        renderList();
        saveLists();

        taskInput.val('');
        dueDateInput.val('');
        timePicker.val('');
    }

    function renderList() {
        const taskList = $('#taskList');
        taskList.empty();
        lists[currentList].tasks.forEach((item, index) => {
            const listItem = $('<li></li>');

            const checkbox = $('<input type="checkbox" class="task-checkbox">');

            const taskContent = $('<span class="task-content"></span>').text(item.task);

            const dueDateSpan = $('<span class="due-date"></span>').text(item.dueDate);

            const deleteBtn = $('<button class="delete-btn">✖</button>');
            deleteBtn.on('click', function () {
                lists[currentList].tasks.splice(index, 1);
                renderList();
                saveLists();
            });

            const upBtn = $('<button class="move-btn">▲</button>');
            upBtn.on('click', function () {
                if (index > 0) {
                    const temp = lists[currentList].tasks[index - 1];
                    lists[currentList].tasks[index - 1] = lists[currentList].tasks[index];
                    lists[currentList].tasks[index] = temp;
                    renderList();
                    saveLists();
                }
            });

            const downBtn = $('<button class="move-btn">▼</button>');
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
            taskInfo.append(taskContent, dueDateSpan, deleteBtn);

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

    // Initialize date picker and time picker dropdown
    $('#dueDateInput').datepicker({
        dateFormat: 'yy-mm-dd'
    });
    generateTimeOptions();

    loadTheme();
    renderList();
    updateTabNames();
});
