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
        const now = new Date();
        lists[currentList].tasks.forEach((item, index) => {
            const listItem = $('<li></li>');

            const checkbox = $('<input type="checkbox" class="task-checkbox">');

            const taskContent = $('<span class="task-content"></span>').text(item.task);

            const startTimeSpan = $('<span class="start-time"></span>').text(item.startTime ? new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
            const dueTimeSpan = $('<span class="due-time"></span>').text(new Date(item.dueTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            
            // Due date indication
            const dueTime = new Date(item.dueTime);
            if (dueTime < now) {
                dueTimeSpan.addClass('past-due');
            } else if ((dueTime - now) < 24 * 60 * 60 * 1000) { // within 24 hours
                dueTimeSpan.addClass('due-soon');
            }

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

            listItem.append(checkbox, taskContent, deleteBtn, startTimeSpan, dueTimeSpan, upBtn, downBtn);
            taskList.append(listItem);
        });
    }

    function switchList(newList) {
        currentList = newList;
        $('#listTitle').val(lists[currentList].name);
        $('.tab').removeClass('active');
        $(`.tab:contains(${lists[currentList].name})`).addClass('active');
        renderList();
    }

    $('#addTaskBtn').on('click', addTask);

    $('#listTitle').on('input', function () {
        lists[currentList].name = $(this).val();
        $(`.tab:contains(${lists[currentList].name})`).text($(this).val());
        saveLists();
    });

    $('#toggleDarkMode').on('click', function () {
        $('body').toggleClass('dark-mode');
        const theme = $('body').hasClass('dark-mode') ? 'dark-mode' : '';
        saveTheme(theme);
        $(this).text(theme === 'dark-mode' ? '☀️' : '🌙');
    });

    $('.tab').on('click', function () {
        const newList = `list${$(this).index() + 1}`;
        switchList(newList);
    });

    // Initialize
    $('#listTitle').val(lists[currentList].name);
    renderList();
    loadTheme();
});
