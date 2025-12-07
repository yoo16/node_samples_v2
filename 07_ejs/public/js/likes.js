document.addEventListener('DOMContentLoaded', () => {
    // Initialize storage if empty
    if (!localStorage.getItem('liked_products')) localStorage.setItem('liked_products', JSON.stringify([]));
    if (!localStorage.getItem('liked_channels')) localStorage.setItem('liked_channels', JSON.stringify([]));

    const toggleLike = (type, id) => {
        const storageKey = `liked_${type}s`; // liked_products or liked_channels
        let likedItems = JSON.parse(localStorage.getItem(storageKey));
        const index = likedItems.indexOf(id);

        if (index > -1) {
            likedItems.splice(index, 1); // Remove
        } else {
            likedItems.push(id); // Add
        }

        localStorage.setItem(storageKey, JSON.stringify(likedItems));
        updateLikeButtons();
    };

    const updateLikeButtons = () => {
        const likedProducts = JSON.parse(localStorage.getItem('liked_products'));
        const likedChannels = JSON.parse(localStorage.getItem('liked_channels'));

        document.querySelectorAll('.like-button').forEach(btn => {
            const type = btn.dataset.likeType;
            const id = parseInt(btn.dataset.id); // ids are integers
            const heartIcon = btn.querySelector('svg');

            let isLiked = false;
            if (type === 'product') isLiked = likedProducts.includes(id);
            if (type === 'channel') isLiked = likedChannels.includes(id);

            if (isLiked) {
                // Filled Heart
                heartIcon.setAttribute('fill', 'currentColor');
                heartIcon.classList.add('text-pink-500');
                heartIcon.classList.remove('text-gray-400', 'text-white');
                // If it was white before (on image), we handle it. But standard helper classes are better.
                // Let's assume text-gray-400 is default empty state color for list view
            } else {
                // Outline Heart
                heartIcon.setAttribute('fill', 'none');
                heartIcon.classList.remove('text-pink-500');
                heartIcon.classList.add('text-gray-400'); // Default color
            }
        });
    };

    // Attach Event Listeners
    document.querySelectorAll('.like-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent link navigation if inside <a>
            e.stopPropagation(); // Stop bubbling
            const type = btn.dataset.likeType;
            const id = parseInt(btn.dataset.id);
            toggleLike(type, id);
        });
    });

    // Initial check
    updateLikeButtons();
});
