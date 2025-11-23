const displayErrors = (errors) => {
    if (!errors) return;
    // errorsを配列にして表示
    const errorElement = document.getElementById("errors");
    errorElement.textContent = "";
    errors.forEach((error) => {
        const errorItem = document.createElement("div");
        errorItem.textContent = error.msg;
        errorItem.className = "text-red-500 p-2";
        errorElement.appendChild(errorItem);
    });
}