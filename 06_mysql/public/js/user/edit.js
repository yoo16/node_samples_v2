
(async () => {
    const userEdit = document.getElementById("user-edit");
    const idInput = document.getElementById("id");

    try {
        // URL から ID を取得
        const id = window.location.pathname.split('/')[2];
        // API の URI生成
        const uri = `/api/user/${id}/find`;

        // API からユーザーデータを取得
        const res = await fetch(uri);
        const data = await res.json();

        console.log(data);

        // ユーザーデータを取得
        const user = data.user;
        const sql = data.sql;

        // フォーム要素を取得
        userEdit.name.value = user.name;
        userEdit.email.value = user.email;
        // id を hidden input にセット
        idInput.value = id;

        document.getElementById("sql").textContent = sql;

        // フォームにデータをセット
        userEdit.action = `/user/${user.id}/update`;

    } catch (err) {
        console.error("Load User Failed:", err);
    }
})();

document.getElementById("user-edit").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const uri = `/api/user/${data.id}/update`;
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
});

// Avatar Preview
document.getElementById("avatar").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    document.getElementById("avatar-preview").src = URL.createObjectURL(file);
});