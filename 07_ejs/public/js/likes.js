document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('liked_products')) localStorage.setItem('liked_products', JSON.stringify([]));
    if (!localStorage.getItem('liked_channels')) localStorage.setItem('liked_channels', JSON.stringify([]));

    const toggleLike = (type, id) => {
        const storageKey = `liked_${type}s`;
        let likedItems = JSON.parse(localStorage.getItem(storageKey));
        const index = likedItems.indexOf(id);

        if (index > -1) {
            likedItems.splice(index, 1);
        } else {
            likedItems.push(id);
        }
        console.log(storageKey, likedItems)

        localStorage.setItem(storageKey, JSON.stringify(likedItems));
        updateLikeButtons();
    };

    const updateLikeButtons = () => {
        const likedProducts = JSON.parse(localStorage.getItem('liked_products'));
        const likedChannels = JSON.parse(localStorage.getItem('liked_channels'));

        document.querySelectorAll('.like-button').forEach(btn => {
            const type = btn.dataset.likeType;
            const id = parseInt(btn.dataset.id);
            const heartIcon = btn.querySelector('svg');

            let isLiked = false;
            if (type === 'product') isLiked = likedProducts.includes(id);
            if (type === 'channel') isLiked = likedChannels.includes(id);

            if (isLiked) {
                // Filled Heart
                heartIcon.setAttribute('fill', 'currentColor');
                heartIcon.classList.add('text-pink-500');
                heartIcon.classList.remove('text-gray-400', 'text-white');
            } else {
                // Outline Heart
                heartIcon.setAttribute('fill', 'none');
                heartIcon.classList.remove('text-pink-500');
                heartIcon.classList.add('text-gray-400');
            }
        });
    };

    // Attach Event Listeners
    document.querySelectorAll('.like-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const type = btn.dataset.likeType;
            const id = parseInt(btn.dataset.id);
            toggleLike(type, id);
        });
    });

    // Initial check
    updateLikeButtons();
});
