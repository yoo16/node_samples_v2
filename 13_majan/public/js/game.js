const socket = io();

const roomSelect = document.getElementById("room-select");
const joinBtn = document.getElementById("join-btn");
const lobby = document.getElementById("lobby");
const gameScreen = document.getElementById("game-screen");

const myHandContainer = document.getElementById("my-hand");
const actionsContainer = document.getElementById("actions");
const riverContainer = document.getElementById("river");

const TILE_MAP = {
    '1z': '東', '2z': '南', '3z': '西', '4z': '北',
    '5z': '白', '6z': '發', '7z': '中'
};

let mySeatIndex = -1;
let playerIds = [];

// 部屋への入室
joinBtn.onclick = () => {
    const roomId = roomSelect.value;
    socket.emit("join_room", roomId);

    lobby.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    console.log(`${roomId} に入室しました`);
};

// 1. サーバーから配牌を受け取る
socket.on("deal_hand", (handData) => {
    console.log("deal_hand", handData);
    renderHand(handData);
});

// 2. 手牌を描画する
function renderHand(hand) {
    myHandContainer.innerHTML = "";

    // 萬子(m) -> 筒子(p) -> 索子(s) -> 字牌(z) の順でソート
    hand.sort().forEach((tile) => {
        const tileEl = document.createElement("div");
        tileEl.className = "tile text-slate-800";

        // 字牌なら漢字に変換、それ以外（数牌）は数字+記号のまま表示
        const displayLabel = TILE_MAP[tile] || tile;
        tileEl.textContent = displayLabel;

        // 数牌の場合、見やすくするために「1m」の 'm' を消すなどの処理も可能
        if (!TILE_MAP[tile]) {
            tileEl.innerHTML = `${tile[0]}<span class="text-[10px] ml-0.5">${tile[1]}</span>`;
        }

        tileEl.onclick = () => {
            tileEl.style.opacity = "0.5";
            discardTile(tile);
        };

        myHandContainer.appendChild(tileEl);
    });
}

// サーバーから新しい手牌（捨てた後やツモった後）が届いたら再描画
socket.on("deal_hand", (handData) => {
    console.log("新しい手牌:", handData);
    myHandContainer.style.pointerEvents = "auto"; // 操作可能に戻す
    renderHand(handData);
});

// ゲーム開始時にプレイヤーリストを保存
socket.on("game_started", (data) => {
    playerIds = data.players.map(p => p.id);
    mySeatIndex = playerIds.indexOf(socket.id);
});

// 捨て牌が受理された時の通知（他人の捨て牌もここで受け取る）
socket.on("tile_discarded", (data) => {
    renderRivers(data.discards);
});

// 4. アクション（ポン・ロン）が必要な時に表示
socket.on("action_request", (actions) => {
    actionsContainer.classList.remove("hidden");
});

function renderRivers(discards) {
    // 全ての河を一旦クリア
    ["bottom", "right", "top", "left"].forEach(pos => {
        document.getElementById(`river-${pos}`).innerHTML = "";
    });

    discards.forEach(item => {
        // プレイヤーの相対位置を計算
        const seatIndex = playerIds.indexOf(item.playerId);
        const relativeSeat = (seatIndex - mySeatIndex + 4) % 4;
        const positions = ["bottom", "right", "top", "left"];
        const targetRiver = document.getElementById(`river-${positions[relativeSeat]}`);

        // 牌の生成
        const tileEl = document.createElement("div");
        // 牌のサイズを固定 (w-6 = 24px)
        tileEl.className = "w-6 h-9 bg-white border border-gray-400 rounded-sm text-[10px] flex items-center justify-center font-bold shadow-sm flex-shrink-0";

        // 字牌の漢字変換
        tileEl.textContent = TILE_MAP[item.tile] || item.tile.replace(/[mps]/, "");

        // 萬子・筒子・索子で色を変えると見やすくなります（オプション）
        if (item.tile.includes('m')) tileEl.classList.add("text-red-600");
        if (item.tile.includes('p')) tileEl.classList.add("text-blue-600");
        if (item.tile.includes('s')) tileEl.classList.add("text-green-600");

        targetRiver.appendChild(tileEl);
    });
}

function discardTile(tile) {
    // サーバーに捨てた牌を伝える
    socket.emit("discard_tile", { tile: tile });

    // UIを一時的に無効化（連打防止）
    myHandContainer.style.pointerEvents = "none";
}
