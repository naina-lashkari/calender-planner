// 🔒 Protect dashboard
if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
}

const body = document.getElementById("dashboardBody");

fetch("http://localhost:3000/tasks/all", {
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
    }
})
    .then(res => {
        if (!res.ok) {
            throw new Error("Unauthorized");
        }
        return res.json();
    })
    .then(tasks => {
        body.innerHTML = "";
        tasks.forEach(t => {
            body.innerHTML += `
                <tr>
                    <td>${t.text}</td>
                    <td>${t.date}</td>
                    <td>${t.createdBy?.name || "-"}</td>
                    <td>${t.assignedTo?.name || "-"}</td>
                    <td>${t.status}</td>
                </tr>
            `;
        });
    })
    .catch(() => {
        alert("Session expired");
        logout();
    });

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function goCalendar() {
    window.location.href = "index.html";
}
