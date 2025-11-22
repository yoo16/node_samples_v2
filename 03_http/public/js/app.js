document.getElementById("message").textContent = "ここはJSで処理しました！";

async function loadFileList() {
    const listElem = document.getElementById("file-list");

    try {
        const res = await fetch("/api/list");
        if (!res.ok) throw new Error("通信エラー");

        const data = await res.json();

        // 初期メッセージをクリア
        listElem.innerHTML = "";

        // ファイルが空だった場合
        if (!data.files || data.files.length === 0) {
            listElem.innerHTML = `<li class="text-gray-400 italic">ファイルがありません</li>`;
            return;
        }

        // ファイル一覧を追加
        data.files.forEach((file) => {
            const li = document.createElement("li");
            li.className = "border-b list-none py-1";
            li.innerHTML = file;
            listElem.appendChild(li);
        });
    } catch (err) {
        listElem.innerHTML = `<li class="text-red-500">⚠️ エラー: ${err.message}</li>`;
    }
}