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
        console.log("errors: ", result.errors)
        console.log("message: ", result.message)

        // Errors
        displayErrors(result.errors);
        // Status
        displayStatus(result, uri);
        // Custom
        const userInfo = `${result.authUser?.name} (${result.authUser?.id})`;
        document.getElementById("auth-user").textContent = userInfo;
    } catch (error) {
        console.error(error);
    }
});