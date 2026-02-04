const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const logContainer = document.getElementById('log');
const statusContainer = document.getElementById('status');
const socketIdContainer = document.getElementById('socketId');

let socketId = '';

// ログ表示
const appendLog = (message) => {
    if (!logContainer) return;
    const time = new Date().toLocaleTimeString();
    const logItem = `
        <div class="border-l-2 border-gray-700 pl-3 py-1">
            <span class="text-white text-xs mr-2">[${time}]</span>
            <span class="text-emerald-400">${message}</span>
        </div>
    `;
    logContainer.innerHTML += logItem;
    logContainer.scrollTop = logContainer.scrollHeight;
};

const clearLogs = () => {
    if (!logContainer) return;
    logContainer.innerHTML = '';
};

// 接続ステータス
const updateStatus = (isConnected) => {
    if (!statusContainer) return;
    if (isConnected) {
        statusContainer.innerText = 'Connected';
        statusContainer.className = 'text-[10px] bg-emerald-500 text-white px-3 py-1 rounded-full font-bold uppercase animate-pulse';
        clearLogs();
    } else {
        statusContainer.innerText = 'Disconnected';
        statusContainer.className = 'text-[10px] bg-red-500 text-white px-3 py-1 rounded-full font-bold uppercase';
    }
};

/**
 * WebSocket 設定
 */
const url = 'ws://localhost:3001';
const ws = new WebSocket(url);

// 接続完了時に呼ばれる
ws.onopen = (e) => {
    updateStatus(true);
    appendLog(`接続: ${url}`);
};

// 切断
ws.onclose = () => updateStatus(false);

// メッセージ受信
ws.onmessage = (e) => {
    try {
        const data = JSON.parse(e.data);
        // IDの先頭6文字とメッセージを表示
        const sender = data.socketId ? data.socketId.substring(0, 6) : 'System';

        // ID設定
        socketId = data.socketId;
        // ID表示
        socketIdContainer.innerText = socketId;

        // メッセージを表示
        const message = `${sender}: ${data.message}`;
        appendLog(message);
    } catch (err) {
        appendLog(`Error: ${e.data}`);
    }
};

// 送信
function send() {
    const text = messageInput.value;
    if (!text) return;

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(text);
        messageInput.value = '';
    } else {
        alert('サーバーに接続されていません');
    }
}

// 送信
sendBtn.addEventListener('click', send);

// Enterキーで送信
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        send();
    }
});