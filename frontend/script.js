const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
let current = new Date();

/* CALENDAR */
function renderCalendar() {
    calendar.innerHTML = "";
    const year = current.getFullYear();
    const month = current.getMonth();

    monthYear.innerText = current.toLocaleString("default", {
        month: "long",
        year: "numeric"
    });

    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(d => {
        const h = document.createElement("div");
        h.className = "day header";
        h.innerText = d;
        calendar.appendChild(h);
    });

    const first = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < first; i++) {
        calendar.appendChild(document.createElement("div"));
    }

    for (let d = 1; d <= total; d++) {
        const cell = document.createElement("div");
        cell.className = "day";
        cell.innerText = d;
        calendar.appendChild(cell);
    }
}
renderCalendar();

document.getElementById("prevMonth").onclick = () => {
    current.setMonth(current.getMonth() - 1);
    renderCalendar();
};
document.getElementById("nextMonth").onclick = () => {
    current.setMonth(current.getMonth() + 1);
    renderCalendar();
};

/* CREATE MENU */
const menu = document.getElementById("createMenu");
document.getElementById("createBtn").onclick = () => {
    menu.classList.toggle("show");
};

/* MODALS */
function openEvent() {
    closeAll();
    document.getElementById("eventModal").style.display = "flex";
}

function openTask() {
    closeAll();
    document.getElementById("taskModal").style.display = "flex";
}

function closeAll() {
    document.getElementById("eventModal").style.display = "none";
    document.getElementById("taskModal").style.display = "none";
    menu.classList.remove("show");
}

/* THEME */
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
};

/* SAVE EVENT → DB */
async function saveEvent() {
    const inputs = document.querySelectorAll("#eventModal input");

    const event = {
        title: inputs[0].value,
        date: inputs[1].value,
        startTime: inputs[2].value,
        endTime: inputs[3].value,
        location: inputs[4].value
    };

    const res = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(event)
    });

    if (!res.ok) {
        alert("Event save failed");
        return;
    }

    alert("✅ Event saved to database");
    closeAll();
}

/* SAVE TASK → DB */
async function saveTask() {
    const inputs = document.querySelectorAll("#taskModal input, #taskModal textarea");

    const task = {
        title: inputs[0].value,
        description: inputs[1].value,
        dueDate: inputs[2].value
    };

    const res = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(task)
    });

    if (!res.ok) {
        alert("Task save failed");
        return;
    }

    alert("✅ Task saved to database");
    closeAll();
}

/* LOGOUT */
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
