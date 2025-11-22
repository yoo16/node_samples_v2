const ctx = document.getElementById("chart").getContext("2d");
const priceBox = document.getElementById("priceBox");
const timeBox = document.getElementById("timeBox");

const maxPoints = 30;

// Chart.js 初期設定
const chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: Array(maxPoints).fill(""),
        datasets: [
            {
                label: "Stock Price",
                data: Array(maxPoints).fill(null),
                borderColor: "#2563eb",
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 0,
            },
        ],
    },
    options: {
        responsive: false,
        animation: false,
        scales: {
            y: { beginAtZero: false },
            x: { ticks: { color: "#777" } },
        },
        plugins: {
            legend: { display: false },
        },
    },
});

// ✅ SSE 接続
const eventSource = new EventSource("/stream");
eventSource.onmessage = (e) => {
    try {
        const data = JSON.parse(e.data);
        if (data.type === "price") {
            const price = parseFloat(data.value);
            const time = data.time;

            // 価格表示を更新
            priceBox.textContent = price.toFixed(2);
            timeBox.textContent = `更新時刻：${time}`;

            // チャートに追加
            chart.data.labels.push(time);
            chart.data.datasets[0].data.push(price);
            if (chart.data.labels.length > maxPoints) {
                chart.data.labels.shift();
                chart.data.datasets[0].data.shift();
            }

            // 値上がり／値下がりの色変化
            const prev = chart.data.datasets[0].data.at(-2);
            if (prev != null) {
                if (price > prev) {
                    priceBox.className = "text-5xl font-extrabold text-green-600 mb-4";
                    priceBox.append(" ▲");
                } else if (price < prev) {
                    priceBox.className = "text-5xl font-extrabold text-red-600 mb-4";
                    priceBox.append(" ▼");
                } else {
                    priceBox.className = "text-5xl font-extrabold text-indigo-600 mb-4";
                    priceBox.append("  ");
                }
            }

            chart.update();
        }
    } catch (err) {
        console.warn("Invalid JSON:", e.data);
    }
};

eventSource.onerror = () => {
    console.error("❌ Connection lost. Retrying...");
};
