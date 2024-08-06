body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    transition: background-color 0.3s, color 0.3s;
}

body.dark-mode {
    background-color: #333;
    color: #fff;
}

.container {
    width: 100%;
    max-width: 800px;
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    transition: background 0.3s, color 0.3s;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
}

body.dark-mode .container {
    background: #444;
    color: #fff;
}

#listTitle {
    margin-bottom: 20px;
    color: inherit;
    text-align: left;
    font-size: 24px;
    width: calc(100% - 40px);
    border: none;
    background: none;
    outline: none;
}

#toggleDarkMode {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 6px;
    background-color: #333;
    color: #fff;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
}

body.dark-mode #toggleDarkMode {
    background-color: #fff;
    color: #333;
}

.tabs {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.tab {
    padding: 10px 20px;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    background-color: #f4f4f4;
    margin-right: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333; /* Default text color for light mode */
}

body.dark-mode .tab {
    background-color: #666;
    color: #fff; /* Text color for dark mode */
    border: 1px solid #555;
}

.tab:hover,
.tab.active {
    background-color: #ddd;
}

body.dark-mode .tab:hover,
body.dark-mode .tab.active {
    background-color: #555;
}

.input-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
}

input[type="text"],
.timepicker-input {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 18px;
    width: 100%;
}

body.dark-mode input[type="text"],
body.dark-mode .timepicker-input {
    background-color: #666;
    color: #fff;
    border: 1px solid #555;
}

button {
    padding: 15px;
    border: none;
    border-radius: 6px;
    background-color: #28a745;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    width: 100%;
}

button:hover {
    background-color: #218838;
}

.task-list-container {
    overflow-y: auto;
    max-height: 50vh;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

li {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    justify-content: space-between;
}

.task-info {
    display: flex;
    align-items: center;
    flex: 1;
}

.task-content {
    margin-right: 10px;
    flex: 1;
}

.due-time,
.start-time {
    margin-left: 10px;
    color: #888;
}

.delete-btn {
    background-color: #dc3545;
    color: #fff;
    border: none;
    border-radius: 6px;
    width: 24px; /* Small square size */
    height: 24px; /* Small square size */
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.delete-btn:hover {
    background-color: #c82333;
}

input[type="checkbox"] {
    margin-right: 15px;
    width: 24px; /* Bigger checkbox size */
    height: 24px; /* Bigger checkbox size */
