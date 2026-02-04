const nonAvatar = "/images/no-avatar.png";

document.addEventListener("DOMContentLoaded", function () {
    updateTimes();
    setInterval(updateTimes, 60000);

    // =====================
    // ハッシュタグ
    // =====================
    document.querySelectorAll(".feed-content").forEach(el => {
        const text = el.innerHTML;

        // ハッシュタグをリンク化
        const linked = text.replace(/#\s*([一-龯ぁ-んァ-ンー\w]+)/gu, function (match, tag) {
            const url = `/feed/search/?keyword=${encodeURIComponent(tag)}`;
            return `<a href="${url}" class="text-blue-500 hover:underline">${match}</a>`;
        });

        el.innerHTML = linked;

        // ハッシュタグ以外クリック → 投稿詳細へ
        el.addEventListener("click", function (e) {
            if (e.target.tagName.toLowerCase() !== 'a') {
                const id = el.dataset.id;
                window.location.href = `/feed/${id}/show`;
            }
        });
    });

    // =====================
    // いいねボタン処理
    // =====================
    document.querySelectorAll(".btn-like")?.forEach(btn => {

        btn.addEventListener("click", async function (e) {
            e.preventDefault();

            // ✔ this = btn（function() を使うのでOK）
            const postEl = this.closest("[data-id]");
            const postId = postEl?.dataset.id;
            if (!postId) return;

            try {
                // feedId を正しく取得
                const feedId = postId;

                const uri = `/api/feed/${feedId}/like`;

                const res = await fetch(uri, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });

                const data = await res.json();
                console.log("like result:", data);

                // =============================
                // UI 更新
                // =============================
                if (data.success) {
                    // いいね数
                    const countEl = this.querySelector(".like-count");
                    if (countEl) countEl.textContent = data.likesCount;

                    // アイコン更新
                    const img = this.querySelector("img");
                    if (img) {
                        img.src = data.liked
                            ? "/images/heart-fill.svg"
                            : "/images/heart.svg";
                    }
                }

            } catch (err) {
                console.error("Like failed:", err);
            }
        });
    });

    document.querySelectorAll('.avatar').forEach(el => {
        const realSrc = el.dataset.src;
        if (!realSrc) return;

        const img = new Image();
        img.src = realSrc;

        img.onload = () => {
            el.src = realSrc;
        };

        img.onerror = () => {
            el.src = nonAvatar;
        };
    });
});


// js/app.js

/**
 * 相対時間を計算する関数
 */
function getRelativeTime(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}秒前`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}分前`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}時間前`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}日前`;

    return past.toLocaleDateString('ja-JP');
}

/**
 * 画面上のすべての日時表示を更新する
 */
function updateTimes() {
    document.querySelectorAll('.relative-time').forEach(el => {
        const date = el.getAttribute('data-date');
        el.innerText = ' · ' + getRelativeTime(date);
    });
}
