const token = localStorage.getItem("token");

fetch("http://localhost:3000/tasks/all", {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
    .then(res => res.json())
    .then(tasks => {
        const tbody = document.querySelector("#taskTable tbody");

        tasks.forEach(task => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
        <td>${task.text}</td>
        <td>${task.date}</td>
        <td>${task.createdBy.name}</td>
        <td class="status-${task.status.replace(" ", "\\ ")}">
          ${task.status}
        </td>
      `;

            tbody.appendChild(tr);
        });
    });
