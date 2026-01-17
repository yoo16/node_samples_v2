const wsMessageInput = document.getElementById('ws-message');

// ログ表示
const appendLog = (id, message) => {
    const el = document.getElementById(`log-${id}`);
    if (!el) return;
    const time = new Date().toLocaleTimeString();
    const logItem = `
        <div class="border-l-2 border-gray-700 pl-3 py-1">
            <span class="text-gray-500 text-xs mr-2">[${time}]</span>
            <span class="text-emerald-400">${message}</span>
        </div>
    `;
    el.innerHTML += logItem;
    el.scrollTop = el.scrollHeight;
};

// 接続ステータス
const updateStatus = (id, isConnected) => {
    const el = document.getElementById(`status-${id}`);
    if (!el) return;
    if (isConnected) {
        el.innerText = 'Connected';
        el.className = 'text-[10px] bg-emerald-500 text-white px-3 py-1 rounded-full font-bold uppercase animate-pulse';
    } else {
        el.innerText = 'Disconnected';
        el.className = 'text-[10px] bg-red-500 text-white px-3 py-1 rounded-full font-bold uppercase';
    }
};

/**
 * WebSocket 設定
 */
const ws = new WebSocket('ws://localhost:3001');

ws.onopen = () => updateStatus('ws', true);
ws.onclose = () => updateStatus('ws', false);

ws.onmessage = (e) => {
    try {
        const data = JSON.parse(e.data);
        // IDの先頭6文字とメッセージを表示
        const sender = data.socketId ? data.socketId.substring(0, 6) : 'System';
        appendLog('ws', `${sender}: ${data.message}`);
    } catch (err) {
        appendLog('ws', `Error: ${e.data}`);
    }
};

function sendWS() {
    const text = wsMessageInput.value;
    if (!text) return;

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(text);
        wsMessageInput.value = '';
    } else {
        alert('サーバーに接続されていません');
    }
}