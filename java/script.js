// Bella Bites - Restaurant Ordering System

document.addEventListener("DOMContentLoaded", function () {

    const cart = [];
    const deliveryFee = 20;

    const cartPanel = document.querySelector(".cart-panel");
    const cartCount = document.querySelector(".cart-count");
    const searchInput = document.querySelector(".search-box input");
    const checkoutButton = document.querySelector(".checkout-btn");

    const productCards = document.querySelectorAll(".product-card");

    // Get product information
    function getProduct(card) {

        const name = card.querySelector("h4").textContent;
        const description = card.querySelector("p").textContent;
        const priceText = card.querySelector(".product-bottom strong").textContent;
        const price = Number(priceText.replace(/[^\d.]/g, ""));
        const image = card.querySelector("img").src;

        return {
            name: name,
            description: description,
            price: price,
            image: image
        };
    }

    // Add product to cart
    function addToCart(product) {

        const existingProduct = cart.find(item => item.name === product.name);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        renderCart();
    }

    // Change product quantity
    function changeQuantity(productName, amount) {

        const item = cart.find(product => product.name === productName);

        if (!item) return;

        item.quantity += amount;

        if (item.quantity <= 0) {
            removeFromCart(productName);
        } else {
            renderCart();
        }
    }

    // Remove product from cart
    function removeFromCart(productName) {

        const index = cart.findIndex(item => item.name === productName);

        if (index !== -1) {
            cart.splice(index, 1);
        }

        renderCart();
    }

    // Display cart items and calculate total
    function renderCart() {

        const numberOfItems = cart.reduce(
            (sum, item) => sum + item.quantity, 0
        );

        cartCount.textContent = numberOfItems;

        const subtotal = cart.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        const delivery = cart.length > 0 ? deliveryFee : 0;
        const total = subtotal + delivery;

        cartPanel.querySelectorAll(".cart-item").forEach(item => item.remove());

        const summary = cartPanel.querySelector(".cart-summary");

        summary.innerHTML = `
            <div>
                <span>المجموع الفرعي:</span>
                <strong>${subtotal} ج.م</strong>
            </div>

            <div>
                <span>رسوم التوصيل:</span>
                <strong>${delivery} ج.م</strong>
            </div>

            <div class="total">
                <span>الإجمالي:</span>
                <strong>${total} ج.م</strong>
            </div>
        `;

        cart.forEach(item => {

            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";

            const image = document.createElement("img");
            image.src = item.image;
            image.alt = item.name;

            const details = document.createElement("div");
            details.className = "cart-item-details";

            const title = document.createElement("h4");
            title.textContent = item.name;

            const price = document.createElement("strong");
            price.textContent = `${item.price * item.quantity} ج.م`;

            const quantity = document.createElement("div");
            quantity.className = "quantity";

            const decreaseButton = document.createElement("button");
            decreaseButton.textContent = "−";
            decreaseButton.addEventListener("click", function () {
                changeQuantity(item.name, -1);
            });

            const quantityNumber = document.createElement("span");
            quantityNumber.textContent = item.quantity;

            const increaseButton = document.createElement("button");
            increaseButton.textContent = "+";
            increaseButton.addEventListener("click", function () {
                changeQuantity(item.name, 1);
            });

            quantity.append(decreaseButton, quantityNumber, increaseButton);

            details.append(title, price, quantity);

            const removeButton = document.createElement("button");
            removeButton.className = "remove";
            removeButton.textContent = "×";

            removeButton.addEventListener("click", function () {
                removeFromCart(item.name);
            });

            cartItem.append(image, details, removeButton);

            cartPanel.insertBefore(cartItem, summary);
        });

        let emptyMessage = cartPanel.querySelector(".empty-cart-message");

        if (cart.length === 0) {

            if (!emptyMessage) {
                emptyMessage = document.createElement("p");
                emptyMessage.className = "empty-cart-message";
                emptyMessage.textContent = "السلة فارغة حاليًا";
                cartPanel.insertBefore(emptyMessage, summary);
            }

        } else if (emptyMessage) {
            emptyMessage.remove();
        }
    }

    // Connect Add to Cart buttons
    productCards.forEach(card => {

        const button = card.querySelector(".product-bottom button");

        if (button) {
            button.addEventListener("click", function () {
                const product = getProduct(card);
                addToCart(product);
            });
        }
    });

    // Search for products
    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const searchTerm = searchInput.value.toLowerCase().trim();

            productCards.forEach(card => {

                const productName = card.textContent.toLowerCase();

                card.style.display =
                    productName.includes(searchTerm) ? "" : "none";
            });

            document.querySelectorAll(".food-group").forEach(group => {

                const visibleCards = group.querySelectorAll(
                    '.product-card:not([style*="display: none"])'
                );

                group.style.display =
                    visibleCards.length > 0 ? "" : "none";
            });
        });
    }

    // Checkout
    if (checkoutButton) {

        checkoutButton.addEventListener("click", function (event) {

            event.preventDefault();

            if (cart.length === 0) {
                alert("السلة فارغة! أضيفي وجبات أولًا.");
                return;
            }

            const subtotal = cart.reduce(
                (sum, item) => sum + item.price * item.quantity, 0
            );

            const total = subtotal + deliveryFee;

            alert(
                "تم تأكيد طلبك بنجاح!\n" +
                "الإجمالي: " + total + " ج.م\n" +
                "شكرًا لاختيار Bella Bites"
            );

            cart.length = 0;
            renderCart();
        });
    }

    // Start the application
    renderCart();

});