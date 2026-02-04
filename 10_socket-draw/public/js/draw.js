const socket = io();

// Room UI
const roomModal = document.getElementById("roomModal");
const roomSelect = document.getElementById("roomSelect"); // Select要素を取得
const joinBtn = document.getElementById("joinBtn");
const currentRoomNameDisp = document.getElementById("currentRoomName");

// 現在のルーム名
let currentRoom = "";

// Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// お絵描きUI
const colorPicker = document.getElementById("colorPicker");
const paintBtn = document.getElementById("paintBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");

// 描画状態
let drawing = false;
let lastX = 0, lastY = 0;

// 描画モード
let isEraser = false;
let color = colorPicker.value;
let lastColor = color;

let size = document.querySelector(".size-btn.active")?.dataset.size || 6;

// Room 管理
joinBtn.addEventListener("click", () => {
    // セレクトボックスから値を取得
    const roomName = roomSelect.value;

    currentRoom = roomName;
    currentRoomNameDisp.textContent = roomName;

    // サーバーにルーム参加を通知
    socket.emit("join-room", roomName);
});

// モード切り替え時のUI更新関数
function updateModeUI() {
    const activeClasses = ["active", "border-indigo-500", "bg-white", "shadow-sm"];

    if (isEraser) {
        eraserBtn.classList.add(...activeClasses);
        paintBtn.classList.remove(...activeClasses);
        eraserBtn.querySelector("svg").classList.replace("text-gray-400", "text-indigo-600");
        paintBtn.querySelector("svg").classList.replace("text-indigo-600", "text-gray-400");
    } else {
        paintBtn.classList.add(...activeClasses);
        eraserBtn.classList.remove(...activeClasses);
        paintBtn.querySelector("svg").classList.replace("text-gray-400", "text-indigo-600");
        eraserBtn.querySelector("svg").classList.replace("text-indigo-600", "text-gray-400");
    }
}

// マウスカーソルの位置を取得
function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
    };
}

// 描画処理
function drawLine(x1, y1, x2, y2, c, s, emit = true) {
    ctx.strokeStyle = c;
    ctx.lineWidth = s;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // emit する場合、currentRoom があればサーバに送信
    if (emit && currentRoom) {
        socket.emit("draw", { x1, y1, x2, y2, color: c, size: s });
    }
}

// ドロー開始
const start = (e) => {
    drawing = true;
    const p = getPointerPos(e);
    [lastX, lastY] = [p.x, p.y];
};

// ドロー中
const move = (e) => {
    if (!drawing) return;
    const p = getPointerPos(e);
    drawLine(lastX, lastY, p.x, p.y, color, size);
    [lastX, lastY] = [p.x, p.y];
};

// ドロー終了
const stop = () => drawing = false;

// マウスイベント
canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", move);
window.addEventListener("mouseup", stop);
canvas.addEventListener("touchstart", (e) => { e.preventDefault(); start(e); }, { passive: false });
canvas.addEventListener("touchmove", (e) => { e.preventDefault(); move(e); }, { passive: false });
canvas.addEventListener("touchend", stop);

// サイズ選択
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active', 'border-indigo-500', 'bg-white', 'shadow-sm'));
        btn.classList.add('active', 'border-indigo-500', 'bg-white', 'shadow-sm');
        size = btn.dataset.size;
    });
});

// カラーピッカー変更
colorPicker.addEventListener("input", (e) => {
    color = e.target.value;
    lastColor = color;
    isEraser = false;
    updateModeUI();
});

// クリア
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear");
});

// ペン機能切り替え
paintBtn.addEventListener("click", () => {
    isEraser = false;
    color = lastColor;
    updateModeUI();
});

// 消しゴム機能切り替え
eraserBtn.addEventListener("click", () => {
    isEraser = true;
    lastColor = color; // 現在の色を保存してから
    color = "#FFFFFF"; // 白にする
    updateModeUI();
});

// Socket通信
// 入室
socket.on("join-room", (roomName) => {
    currentRoom = roomName;
    currentRoomNameDisp.textContent = roomName;
    roomModal.classList.add("hidden");
});

// 描画データの受信
socket.on("draw", (d) => drawLine(d.x1, d.y1, d.x2, d.y2, d.color, d.size, false));
// 履歴データの受信
socket.on("history", (historyData) => {
    // 描画前に一度キャンバスを白紙にする（念のため）
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 履歴データを1つずつ描画
    historyData.forEach(d => {
        drawLine(d.x1, d.y1, d.x2, d.y2, d.color, d.size, false);
    });
});
// クリア
clearBtn.addEventListener("click", () => {
    if (!currentRoom) return;
    // 自分の画面を消す
    socket.emit("clear");
});

// 初期状態のUIを反映
updateModeUI();