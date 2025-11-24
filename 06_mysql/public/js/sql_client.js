async function render(uri) {
    try {
        const response = await fetch(uri);
        const result = await response.json();

        const data = result.data || [];

        // SQL文の表示
        document.getElementById('sql').textContent = result.sql;

        renderTable(data);
    } catch (error) {
        console.error('データの取得に失敗しました:', error);
        const table = document.getElementById('result');
        if (table) {
            table.innerHTML = '<p class="text-red-500 p-4">エラーが発生しました</p>';
        }
    }
}

/**
 * データを動的にテーブル表示する汎用関数
 * 引数 rows の中身（キーと値）に応じてヘッダーとボディを自動生成します
 */
function renderTable(rows) {
    // DOM: Tableタグ
    const table = document.getElementById('result');
    if (!table) return;

    // データがない場合の表示
    if (!Array.isArray(rows) || rows.length === 0) {
        table.innerHTML = '<tr><td class="p-4 text-gray-500 text-center">データがありません</td></tr>';
        return;
    }

    let html = '';

    // カラム
    const keys = Object.keys(rows[0]);

    // ヘッダー
    let headerHtml = '';
    keys.forEach(key => {
        headerHtml += `<th class="border px-4 py-2 text-left text-gray-600 font-bold capitalize">${key}</th>`;
    });

    // ボディー
    let bodyHtml = '';
    rows.forEach((row) => {
        bodyHtml += `<tr>`;
        keys.forEach((key) => {
            const value = row[key];
            bodyHtml += `<td class="border px-4 py-2 text-gray-800">${value}</td>`;
        });
        bodyHtml += `</tr>`;
    });

    html += `<thead class="bg-gray-100">
                 <tr>
                    ${headerHtml}
                 </tr>
            </thead>
            <tbody>
                ${bodyHtml}
            </tbody>`;
    table.innerHTML = html;
}

function selectUsers() {
    const uri = '/api/users/list';
    render(uri);
}

function selectUserCount() {
    const uri = '/api/users/count';
    render(uri);
}

function selectUserByEmail() {
    const email = document.getElementById('email').value;
    const uri = '/api/users/by-email' + `?email=${email}`;
    render(uri);
}

function selectFeeds() {
    const uri = '/api/feeds/list';
    render(uri);
}

function searchFeeds() {
    const keyword = document.getElementById('keyword').value;
    const uri = '/api/feeds/search' + `?keyword=${keyword}`;
    render(uri);
}