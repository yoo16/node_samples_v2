const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const uri = `/api/user/login`;
    document.getElementById("success").textContent = "";
    document.getElementById("error").textContent = "";
    try {
        const res = await fetch(uri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        const sql = result.sql;
        document.getElementById("sql").textContent = sql;
        const authUser = result.authUser;
        if (authUser) {
            document.getElementById("success").textContent = "Login successful";
        } else {
            document.getElementById("error").textContent = "Login failed";
        }
    } catch (error) {
        console.error(error);
    }
});