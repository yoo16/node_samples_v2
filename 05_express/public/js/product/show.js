// URL解析
const url = new URL(location.href);
const pathParts = url.pathname.split("/");
// 最後の部分が 商品ID
const productId = pathParts.pop();
console.log("Product ID:", productId);

try {
    // ✅ 商品データを API から取得
    const res = await fetch(`/api/product/show/${productId}`);
    const product = await res.json();
    // 商品詳細レンダリング
    renderProductDetail(product);
} catch (err) {
    console.error("API Fetch Error:", err);

    const detail = document.getElementById("product-detail");
    detail.innerHTML = `
            <p class="text-red-600 font-bold p-4 bg-red-100 rounded">
                商品情報を取得できませんでした
            </p>
        `;
}

// ✅ 商品詳細を描画（テンプレートHTML）
function renderProductDetail(p) {
    const detail = document.getElementById("product-detail");

    let tagHtml = "";
    if (p.tag) {
        tagHtml = `
                <span class="text-xs ${p.category === "men"
                ? "bg-pink-200 text-pink-800"
                : "bg-sky-200 text-sky-800"
            } px-2 py-1 rounded">${p.tag}</span>
            `;
    }

    detail.innerHTML = `
            <div class="p-4 bg-white shadow rounded-xl">
                <img src="../${p.image}" class="rounded-md mb-3">
                <h3 class="font-bold text-2xl mb-1">${p.name}</h3>
                <p class="text-gray-600 mb-2">${p.note}</p>
                <p class="text-xl font-bold">¥${p.price.toLocaleString()}</p>
                ${tagHtml}
            </div>
        `;
}