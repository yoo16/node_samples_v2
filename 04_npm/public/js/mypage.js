document.addEventListener("DOMContentLoaded", function () {
    // /api/user からユーザ情報を取得して表示
    const user = fetchUserData();
    document.getElementById('display-name').textContent = user.display_name;
    document.getElementById('email').textContent = user.email;
});

async function fetchUserData() {
    try {
        const response = await fetch('/api/user');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data:', data);
        const user = data.user
        // ここでユーザデータを画面に表示する処理を追加できます
        document.getElementById('user-id').textContent = user.id;
        document.getElementById('display-name').textContent = user.display_name;
        document.getElementById('email').textContent = user.email;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}