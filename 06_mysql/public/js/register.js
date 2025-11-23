const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const uri = `/api/user/register`;
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
        const sql = result.sql;
        document.getElementById("sql").textContent = sql;
        document.getElementById("message").textContent = result.message;

        console.log(result.errors)
        // Errors
        displayErrors(result.errors);
    } catch (error) {
        console.error(error);
    }
});