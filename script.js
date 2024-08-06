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
        // Initialize default data if none exists
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
        const taskText = taskInput.val().trim();
        const dueTime = dueTimeInput.val();

        if (taskText === '' || dueTime === '') return;

        lists[currentList].tasks.push({ task: taskText, time: dueTime });
        renderList();
        saveLists();

        taskInput.val('');
        dueTimeInput.val('');
    }

    function deleteTask(index) {
        lists[currentList].tasks.splice(index, 1);
        renderList();
        saveLists();
    }

    function renderList() {
        const taskList = $('#taskList');
        taskList.empty();
        lists[currentList].tasks.forEach((item, index) => {
            const listItem = $('<li></li>');

            const checkbox = $('<input type="checkbox" class="task-checkbox">');

            const taskContent = $('<span class="task-content"></span>').text(item.task);

            const dueTimeSpan = $('<span class="due-time"></span>').text(item.time);

            const deleteBtn = $('<button class="delete-btn">❌</button>');
            deleteBtn.on('click', function () {
                deleteTask(index);
            });

            listItem.append(checkbox, taskContent, dueTimeSpan, deleteBtn);
            taskList.append(listItem);
        });
    }

    function initializeTabs() {
        $('.tabs').empty();
        Object.keys(lists).forEach(listKey => {
            const button = $(`<button class="tab" data-list="${listKey}">${lists[listKey].name}</button>`);
            button.on('click', function () {
                currentList = $(this).data('list');
                renderList();
                $('#listTitle').val(lists[currentList].name);
                $('.tab').removeClass('active');
                $(this).addClass('active');
            });
            $('.tabs').append(button);
        });
    }

    // Initialize Timepicker.js
    $('#dueTimeInput').timepicker({
        timeFormat: 'h:mm a',
        interval: 30,
        minTime: '12:00 am',
        maxTime: '11:30 pm',
        defaultTime: 'now',
        startTime: '12:00 am',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        zindex: 9999
    });

    // Toggle dark mode
    $('#toggleDarkMode').on('click', function () {
        $('body').toggleClass('dark-mode');
        const theme = $('body').hasClass('dark-mode') ? 'dark-mode' : 'light-mode';
        $('#toggleDarkMode').text(theme === 'dark-mode' ? '☀️' : '🌙');
        saveTheme(theme);
    });

    // Event listeners
    $('#addTaskBtn').on('click', addTask);
    $('#taskInput').on('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    $('#listTitle').on('input', function () {
        const title = $(this).val().substring(0, 20);
        lists[currentList].name = title;
        $(`.tab[data-list="${currentList}"]`).text(title);
        saveLists();
    });

    // Initialize with the first list
    initializeTabs();
    renderList();
    $('#listTitle').val(lists[currentList].name);

    // Load theme on page load
    loadTheme();
});
