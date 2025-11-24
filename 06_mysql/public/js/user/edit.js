
async function loadUser() {
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

        // ユーザーデータを取得
        const user = data.user;

        // フォーム要素を取得
        userEdit.name.value = user.name;
        userEdit.email.value = user.email;
        // id を input hidden にセット
        idInput.value = id;

        displayStatus(data, uri);
    } catch (err) {
        console.error("Load User Failed:", err);
    }
}

// 更新処理
document.getElementById("user-edit").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const entries = Object.fromEntries(formData.entries());
    const uri = `/api/user/${entries.id}/update`;
    const res = await fetch(uri, {
        method: "POST",
        body: formData,
    });
    const data = await res.json();

    displayStatus(data, uri);
    displayErrors(data.errors);
});

// 再読み込み
document.getElementById("reload-btn").addEventListener("click", () => {
    loadUser();
});

loadUser();