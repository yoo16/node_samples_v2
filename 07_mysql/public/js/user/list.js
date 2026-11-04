
(async () => {
    const userList = document.getElementById("user-list");
    try {
        const uri = "/api/user/list";
        const res = await fetch(uri);
        const data = await res.json();

        const users = data.users;

        // Tailwind カードで表示
        userList.innerHTML = users.map(user => `
            <div class="p-4 mb-2 border rounded-lg shadow bg-white">
                <div class="flex items-center gap-2">
                    <div class="text-lg font-semibold">${user.name}</div>
                    <div class="text-sm text-gray-500">${user.email}</div>
                </div>

                <div class="mt-2 text-sm text-gray-600">
                    <a href="/user/${user.id}/edit" class="text-blue-500 hover:underline">
                        <span class="font-medium">id:</span> ${user.id}
                    </a>
                    <div><span class="font-medium">created_at:</span> ${user.created_at}</div>
                </div>

            </div>
        `).join("");

        displayStatus(data, uri);
    } catch (err) {
        console.error("Load Users Failed:", err);
    }
})();