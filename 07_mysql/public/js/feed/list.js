const feedList = document.getElementById("feed-list");

async function loadFeedList() {
    try {
        const uri = "/api/feed/list";
        // API 通信 
        const res = await fetch(uri);
        const data = await res.json();

        // フィード
        const feeds = data.feeds;

        feedList.innerHTML = "";
        // カードで表示
        if (feeds && feeds.length > 0) {
            feedList.innerHTML = feeds.map(feed => `
            <div class="p-4 mb-2 border rounded-lg shadow bg-white">
                <div class="flex items-center gap-2">
                    <div class="text-lg">${feed.user_name}</div>
                </div>
                <div class="mt-2 text-lg text-gray-600">
                    ${feed.content}
                </div>
                <div class="font-xs">
                    <span>created_at:</span>
                    ${feed.created_at}
                </div>
                <div class="font-xs">
                    <button onclick="deleteFeed('${feed.id}')" class="px-3 py-1 bg-red-600 text-sm text-white rounded-lg">Delete</button>
                </div>
            </div>`).join("");
        }
    } catch (err) {
        console.error("Load Users Failed:", err);
    }
}

async function loadUsers() {
    const userSelect = document.getElementById("user-select");
    try {
        const uri = "/api/user/list";
        // API 通信 
        const res = await fetch(uri);
        const data = await res.json();

        // ユーザー
        const users = data.users;

        // カードで表示
        userSelect.innerHTML = users.map(user => `
            <option value="${user.id}">${user.name}</option>
        `).join("");
    } catch (err) {
        console.error("Load Users Failed:", err);
    }
}

async function postFeed(e) {
    // デフォルトの送信を防ぐ
    e.preventDefault();

    const posts = {
        user_id: document.getElementById("user-select").value,
        content: document.getElementById("content").value,
    }
    try {
        const uri = "/api/feed/post";
        // API 通信 
        const res = await fetch(uri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(posts),
        });
        const result = await res.json();
        document.getElementById("content").value = "";

        displayStatus(result, uri);

        await loadFeedList();
    } catch (err) {
        console.error("Post Feed Failed:", err);
    }
}

async function deleteFeed(id) {
    try {
        const uri = `/api/feed/${id}/destroy`;
        // API 通信 
        const res = await fetch(uri, {
            method: "POST",
        });
        const result = await res.json();

        displayStatus(result, uri);

        await loadFeedList();
    } catch (err) {
        console.error("Delete Feed Failed:", err);
    }
}

async function postFeedInjection(e) {
    // デフォルトの送信を防ぐ
    e.preventDefault();

    // インジェクション用の内容を設定
    document.getElementById("content").value = document.getElementById("injection-content").textContent;

    const posts = {
        user_id: document.getElementById("user-select").value,
        content: document.getElementById("injection-content").textContent,
    }
    try {
        const uri = "/api/feed/post/injection";
        // API 通信 
        const res = await fetch(uri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(posts),
        });
        const result = await res.json();

        displayStatus(result, uri);

        await loadFeedList();
    } catch (err) {
        console.error("Post Feed Failed:", err);
    }
}

document.getElementById("post-button").addEventListener("click", postFeed);
document.getElementById("post-button-injection").addEventListener("click", postFeedInjection);

(async () => {
    await loadFeedList();
    await loadUsers();
})();