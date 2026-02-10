const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const monthYear = document.getElementById("monthYear");
const calendar = document.getElementById("calendar");

const token = localStorage.getItem("token");
let currentDate = new Date();

/* =========================
   AUTH CHECK
========================= */
if (!token) {
    window.location.href = "login.html";
}

/* =========================
   PAGE LOAD
========================= */
window.onload = () => {
    loadTasks();
    generateCalendar();
};

function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };
}

/* =========================
   LOAD TASKS
========================= */
function loadTasks() {
    taskList.innerHTML = "";

    fetch("http://localhost:3000/tasks", {
        headers: authHeaders()
    })
        .then(res => res.json())
        .then(tasks => {
            tasks.forEach(t =>
                addTaskToUI(t._id, t.text, t.date)
            );
        });
}

/* =========================
   ADD TASK
========================= */
addBtn.onclick = () => {
    const text = taskInput.value;
    const date = dateInput.value;

    fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ text, date })
    })
        .then(() => {
            taskInput.value = "";
            dateInput.value = "";
            loadTasks();
            generateCalendar();
        });
};

/* =========================
   TASK UI
========================= */
function addTaskToUI(id, text, date) {
    const li = document.createElement("li");
    li.textContent = `${text} (${date})`;

    li.onclick = () => {
        if (!confirm("Delete task?")) return;

        fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE",
            headers: authHeaders()
        }).then(() => {
            taskList.removeChild(li);
            generateCalendar();
        });
    };

    taskList.appendChild(li);
}

/* =========================
   CALENDAR
========================= */
async function generateCalendar() {
    calendar.innerHTML = "";

    const res = await fetch("http://localhost:3000/tasks", {
        headers: authHeaders()
    });
    const tasks = await res.json();

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    days.forEach(d => {
        const div = document.createElement("div");
        div.textContent = d;
        div.className = "calendar-header";
        calendar.appendChild(div);
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYear.textContent =
        new Date(year, month).toLocaleString("default", {
            month: "long",
            year: "numeric"
        });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++)
        calendar.appendChild(document.createElement("div"));

    for (let d = 1; d <= totalDays; d++) {
        const div = document.createElement("div");
        div.className = "calendar-day";
        div.textContent = d;

        const dateStr =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

        if (tasks.some(t => t.date === dateStr))
            div.classList.add("has-task");

        calendar.appendChild(div);
    }
}

/* =========================
   MONTH NAV
========================= */
prevMonthBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
};
nextMonthBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
};
