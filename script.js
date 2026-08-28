const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const allCount = document.getElementById("allCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

const emptyMessage = document.getElementById("emptyMessage");

const filterButtons = document.querySelectorAll(".filter-btn");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// Add Task

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        date: new Date().toLocaleDateString()
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}


// Save Tasks in Local Storage

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Delete Task

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}


// Complete Task

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;

    });

    saveTasks();

    renderTasks();
}


// Filter Tasks

function getFilteredTasks() {

    if (currentFilter === "completed") {
        return tasks.filter(task => task.completed);
    }

    if (currentFilter === "pending") {
        return tasks.filter(task => !task.completed);
    }

    return tasks;
}


// Render Tasks

function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = getFilteredTasks();


    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = `task-item ${task.completed ? "completed" : ""}`;


        li.innerHTML = `

            <button class="check-btn">
                <i class="fa-solid fa-check"></i>
            </button>

            <div class="task-content">

                <div class="task-text">
                    ${escapeHTML(task.text)}
                </div>

                <div class="task-date">
                    <i class="fa-regular fa-calendar"></i>
                    ${task.date}
                </div>

            </div>

            <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>

        `;


        // Complete Button

        li.querySelector(".check-btn").addEventListener("click", () => {

            toggleTask(task.id);

        });


        // Delete Button

        li.querySelector(".delete-btn").addEventListener("click", () => {

            deleteTask(task.id);

        });


        taskList.appendChild(li);

    });


    updateStats();

}


// Update Counters

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;


    // Footer Stats

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;


    // Filter Counters

    allCount.textContent = total;

    completedCount.textContent = completed;

    pendingCount.textContent = pending;

}


// Prevent HTML Injection

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// Add Button Click

addBtn.addEventListener("click", addTask);


// Enter Key

taskInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// Filter Buttons

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;


        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        renderTasks();

    });

});


// Start App

renderTasks();