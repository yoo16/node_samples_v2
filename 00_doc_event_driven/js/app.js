const stack = document.getElementById("stack");
const macroQueue = document.getElementById("macroQueue");
const microQueue = document.getElementById("microQueue");
const addMacroBtn = document.getElementById("addMacro");
const addMicroBtn = document.getElementById("addMicro");
const log = document.getElementById("log");

let caseId = 1;

// 事件リスト
const macroCases = [
    "黒の組織による爆破予告",
    "銀行強盗事件",
    "殺人事件（密室）",
    "列車ジャック事件",
    "名画盗難事件"
];

const microCases = [
    "蘭の宿題を手伝う",
    "猫を木から救出",
    "阿笠博士の発明が爆発",
    "歩美ちゃんの財布探し",
    "灰原のPC修理"
];

// ログ出力
function logMsg(msg) {
    log.innerHTML += msg + "<br>";
    log.scrollTop = log.scrollHeight;
}

// 🎬 大事件追加（マクロタスク）
addMacroBtn.addEventListener("click", () => {
    const name = macroCases[Math.floor(Math.random() * macroCases.length)];
    const task = document.createElement("div");
    task.className = "task macro";
    task.textContent = `大事件 #${caseId++}（${name}）`;
    macroQueue.appendChild(task);
    logMsg(`💥 事件発生！ → ${name}`);
});

// 🔎 小事件追加（マイクロタスク）
addMicroBtn.addEventListener("click", () => {
    const name = microCases[Math.floor(Math.random() * microCases.length)];
    const task = document.createElement("div");
    task.className = "task micro";
    task.textContent = `小事件 #${caseId++}（${name}）`;
    microQueue.appendChild(task);
    logMsg(`🔍 依頼発生 → ${name}`);
});

// 🧠 コナンの推理ループ（イベントループ）
setInterval(() => {
    if (stack.children.length === 0) {
        let task = null;
        let type = "";

        // 小事件（マイクロタスク）優先
        if (microQueue.children.length > 0) {
            task = microQueue.children[microQueue.children.length - 1];
            microQueue.removeChild(task);
            type = "micro";
        } else if (macroQueue.children.length > 0) {
            task = macroQueue.children[macroQueue.children.length - 1];
            macroQueue.removeChild(task);
            type = "macro";
        }

        if (task) {
            stack.appendChild(task);
            const text = task.textContent;
            logMsg(`🧠 コナンが推理開始 → ${text}`);

            // 擬似的な「事件解決」までの処理時間
            setTimeout(() => {
                logMsg(`✅ 事件解決！ → ${text}`);
                task.remove();
            }, 1500);
        }
    }
}, 1200);