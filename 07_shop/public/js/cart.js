document.addEventListener('DOMContentLoaded', () => {
    const minusBtn = document.querySelector('.quantity-minus');
    const plusBtn = document.querySelector('.quantity-plus');
    const input = document.querySelector('input[name="quantity"]'); // Visible input
    const hiddenInput = document.getElementById('hidden-quantity'); // Hidden input in form

    const updateHidden = () => {
        if (hiddenInput && input) {
            hiddenInput.value = input.value;
        }
    };

    if (minusBtn && plusBtn && input) {
        minusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let val = parseInt(input.value);
            if (val > 1) {
                input.value = val - 1;
                updateHidden();
            }
        });

        plusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let val = parseInt(input.value);
            input.value = val + 1;
            updateHidden();
        });
    }
});