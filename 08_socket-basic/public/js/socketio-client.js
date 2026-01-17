const socketioMessageInput = document.getElementById('socketio-message');

// ログ表示共通関数
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

// ステータス更新共通関数
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

// Socket.io インスタンス (Port 3002)
const socketio = io('http://localhost:3002');

socketio.on('connect', () => {
    updateStatus('socketio', true);
});

socketio.on('disconnect', () => {
    updateStatus('socketio', false);
});

// サーバーからの初回接続通知
socketio.on('connected', (data) => {
    appendLog('socketio', `System: ${data.message} (ID: ${data.socketId})`);
});

// メッセージ受信
socketio.on('message', (data) => {
    const sender = data.socketId ? data.socketId.substring(0, 6) : 'System';
    appendLog('socketio', `${sender}: ${data.message}`);
});

// 送信関数
function sendSocketIO() {
    const text = socketioMessageInput.value;
    if (!text) return;

    socketio.emit('message', text);
    socketioMessageInput.value = '';
}