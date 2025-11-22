const socket = io();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let lastX = 0, lastY = 0;
let color = document.getElementById("colorPicker").value;
let size = document.getElementById("sizePicker").value;

// 🎨 共通: 線を描く処理
function drawLine(x1, y1, x2, y2, color, size) {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// 🧹 共通: クリア処理
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ------------------------------
// 🎮 イベントリスナー
// ------------------------------
// 描画開始
canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

// 描画終了
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseout", () => drawing = false);

// マウス移動時
canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    const x = e.offsetX, y = e.offsetY;

    // 描画
    drawLine(lastX, lastY, x, y, color, size);

    // サーバ送信信
    socket.emit("draw", { x, y, lastX, lastY, color, size });

    [lastX, lastY] = [x, y];
});

// 色変更
document.getElementById("colorPicker").addEventListener("input", (e) => {
    color = e.target.value;
});

// 太さ変更
document.getElementById("sizePicker").addEventListener("input", (e) => {
    size = e.target.value;
});

// クリアボタン
document.getElementById("clearBtn").addEventListener("click", () => {
    clearCanvas();
    socket.emit("clear");
});

// ------------------------------
// 🌐 Socket.IO 受信イベント
// ------------------------------
socket.on("draw", (data) => {
    drawLine(data.lastX, data.lastY, data.x, data.y, data.color, data.size);
});

socket.on("clear", () => {
    clearCanvas();
});