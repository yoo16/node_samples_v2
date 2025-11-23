const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const uri = `/api/user/login`;
    document.getElementById("message").textContent = "";
    try {
        const res = await fetch(uri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();

        // SQL
        const sql = result.sql;
        document.getElementById("sql").textContent = sql;
        // Message
        const message = result.message;
        if (message) {
            document.getElementById("message").textContent = message;
        }
        const authUser = result.authUser;
        // Errors
        displayErrors(result?.errors);
    } catch (error) {
        console.error(error);
    }
});