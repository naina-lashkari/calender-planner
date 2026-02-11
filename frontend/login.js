document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        // ✅ SAVE JWT
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);

        alert("Login successful");
        window.location.href = "index.html";

    } catch (err) {
        alert("Server error");
        console.error(err);
    }
});
