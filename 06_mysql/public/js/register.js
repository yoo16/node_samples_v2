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

        // Errors
        displayErrors(result.errors);
        // Status
        displayStatus(result, uri);
    } catch (error) {
        console.error(error);
    }
});