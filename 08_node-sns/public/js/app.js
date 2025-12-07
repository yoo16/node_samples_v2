const nonAvatar = "/images/no-avatar.png";

document.addEventListener("DOMContentLoaded", function () {
    // =====================
    // ハッシュタグ
    // =====================
    document.querySelectorAll(".feed-content").forEach(el => {
        const text = el.innerHTML;

        // ハッシュタグをリンク化
        const linked = text.replace(/#([一-龯ぁ-んァ-ンー\w]+)/gu, function (match, tag) {
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