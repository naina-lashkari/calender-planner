async function signup() {
    const name = document.querySelector("input[type='text']").value;
    const email = document.querySelector("input[type='email']").value;
    const password = document.querySelector("input[type='password']").value;

    if (!name || !email || !password) {
        alert("All fields are required");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        alert(data.message);

        if (res.ok) {
            window.location.href = "login.html";
        }

    } catch (err) {
        alert("Server error");
        console.error(err);
    }
}
