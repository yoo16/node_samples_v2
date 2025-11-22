(() => {
    const list = document.getElementById("product-list");
    const keywordElement = document.getElementById("keyword");

    let cartItems = [];

    // ============================
    // 商品 API 取得
    // ============================
    async function fetchProducts() {
        try {
            // 現在のURLから GETパラメータを読み取る
            const params = new URLSearchParams(location.search);
            const keyword = params.get("keyword");

            let res;

            if (keyword) {
                // keyword がある → 検索API
                res = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`);

                // 検索ボックスにキーワードをセット
                keywordElement.value = keyword;
            } else {
                // keyword がない → 商品一覧API
                res = await fetch("/api/product/list");

                // 検索ボックスをクリア
                keywordElement.value = "";
            }

            // JSON データを取得
            const data = await res.json();

            // 商品一覧をレンダリング
            renderProducts(data.products);

        } catch (e) {
            console.error("商品API取得エラー:", e);
        }
    }

    async function addCart(productId) {
        console.log("カート追加:", productId);
        try {
            const res = await fetch(`/api/cart/add/${productId}`, {
                method: "POST",
            });
            const data = await res.json();
            console.log("カート追加結果:", data);

            // カート内商品数を更新
            cartItems = data.cartItems;

            // カート個数表示を更新
            document.getElementById("cart-count").classList.remove("hidden");
            document.getElementById("cart-count").innerText = cartItems.length;
        } catch (e) {
            console.error("カート追加エラー:", e);
            alert("カートの追加に失敗しました。");
        }
    }

    // ============================
    // 商品カード生成
    // ============================
    function renderProducts(products) {
        list.innerHTML = "";
        let html = "";

        products.forEach((p) => {
            const cardClass = p.category === "men"
                ? "bg-sky-100 text-sky-600"
                : "bg-pink-100 text-pink-600";

            const tagHtml = p.tag
                ? `<span class="text-xs ${p.category === "men"
                    ? "bg-pink-200 text-pink-800"
                    : "bg-sky-200 text-sky-800"
                } px-2 py-1 mr-2 rounded">${p.tag}</span>`
                : "";

            html += `
            <div class="product ${p.category} bg-white rounded-xl shadow cursor-pointer
                        hover:shadow-lg transition transform hover:-translate-y-1 ${cardClass}">
                <div onclick="location.href='/product/${p.id}'">
                    <img src="${p.image}" class="rounded-t-md">
                    <div class="info p-3">
                        <h3 class="name font-semibold text-lg">${tagHtml}${p.name}</h3>
                        <p class="note text-sm text-gray-500">${p.note}</p>
                        <p class="price font-bold text-lg">¥${p.price.toLocaleString()}</p>
                    </div>
                </div>
                <div class="px-3 py-2 text-center border-t">
                    <button
                        class="add-cart-btn text-white text-sm bg-sky-500 px-3 py-1 rounded-lg"
                        data-id="${p.id}"
                        >
                        Add Cart
                    </button>
                </div>
            </div>
        `;
        });

        list.innerHTML = html;

        // NodeList 再取得
        productElements = document.querySelectorAll(".product");

        // class=add-cart-btn は動的に生成されるため、ここで登録する
        document.querySelectorAll(".add-cart-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                // 親要素の .product を辿る
                const productId = event.target.dataset.id;
                addCart(productId);
            });
        });
    }

    // ============================
    // フィルター処理
    // ============================
    let productElements = [];

    // All
    document.getElementById("all-filter-btn").addEventListener("click", () => {
        productElements.forEach(product => {
            product.classList.remove("hidden");
        });
    });

    // Men
    document.getElementById("men-filter-btn").addEventListener("click", () => {
        productElements.forEach(product => {
            product.classList.remove("hidden");
            if (!product.classList.contains('men')) {
                product.classList.add("hidden");
            }
        });
    });

    // Women
    document.getElementById("women-filter-btn").addEventListener("click", () => {
        productElements.forEach(product => {
            product.classList.remove("hidden");
            if (!product.classList.contains('women')) {
                product.classList.add("hidden");
            }
        });
    });

    // 初期表示（CSR: クライアントサイドレンダリング）
    document.addEventListener("DOMContentLoaded", fetchProducts);
})();