document.addEventListener('DOMContentLoaded', () => {
    // 画像のファイル名リスト（実際のファイル名に合わせてください）
    const images = [
        "/images/banner/1.png",
        "/images/banner/2.png",
        "/images/banner/3.png"
    ];

    let currentIndex = 0;
    const imgElement = document.getElementById('banner-image');
    const intervalTime = 5000; // 5秒ごとに切り替え

    // 画像を事前に読み込んでおく（ちらつき防止）
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    setInterval(() => {
        if (!imgElement) return;
        // 1. まず透明にする（フェードアウト）
        imgElement.classList.remove('opacity-100');
        imgElement.classList.add('opacity-0');

        // 2. 1秒待って画像パスを差し替え、再び不透明にする（フェードイン）
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % images.length; // 次のインデックスへ（最後なら最初に戻る）
            imgElement.src = images[currentIndex];

            // 画像が読み込まれたらフェードイン（念の為onloadを使う）
            imgElement.onload = () => {
                imgElement.classList.remove('opacity-0');
                imgElement.classList.add('opacity-100');
            };
        }, 1000); // CSSの duration-1000 と合わせる

    }, intervalTime);
});