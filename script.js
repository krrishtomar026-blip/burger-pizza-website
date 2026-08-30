document.addEventListener("DOMContentLoaded", function () {

    console.log("🍔 Burger Pizza Website Loaded");

    // =========================
    // FOOD CARDS
    // =========================

    const foodCards = document.querySelectorAll(".food-card");
    const searchInput = document.getElementById("searchInput");
    const filterButtons = document.querySelectorAll(".filter-btn");

    console.log("TOTAL FOOD CARDS:", foodCards.length);


    // =========================
    // SEARCH
    // =========================

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const value = searchInput.value
                .trim()
                .toLowerCase();

            foodCards.forEach(function (card) {

                const title =
                    card.querySelector("h3")?.innerText.toLowerCase() || "";

                const description =
                    card.querySelector("p")?.innerText.toLowerCase() || "";

                if (
                    value === "" ||
                    title.includes(value) ||
                    description.includes(value)
                ) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });

        });

    }


    // =========================
    // CATEGORY FILTER
    // =========================

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const category = button.dataset.filter;

            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            foodCards.forEach(function (card) {

                const cardCategory =
                    card.dataset.category?.trim();

                if (
                    category === "all" ||
                    cardCategory === category
                ) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });

        });

    });


    // =========================
    // SHOPPING CART
    // =========================

let cart =
    JSON.parse(
        localStorage.getItem("burgerPizzaCart")
    ) || [];


    const cartCounter =
        document.getElementById("cart-count");

    const cartPopup =
        document.getElementById("cartPopup");

    const cartItems =
        document.getElementById("cartItems");

    const totalPrice =
        document.getElementById("totalPrice");

    const closeCart =
        document.getElementById("closeCart");

    const checkoutBtn =
        document.getElementById("checkoutBtn");


    // =========================
    // UPDATE CART
    // =========================

    function updateCart() {

        if (cartCounter) {

            let count = 0;

            cart.forEach(function (item) {
                count += item.quantity;
            });

            cartCounter.innerText = count;
        }


        if (!cartItems) return;

        cartItems.innerHTML = "";

        let total = 0;


        cart.forEach(function (item, index) {

            total += item.price * item.quantity;


            const cartItem =
                document.createElement("div");

            cartItem.className = "cart-item";


            cartItem.innerHTML = `

                <div>
                    <strong>${item.name}</strong>
                    <br>
                    ₹${item.price} × ${item.quantity}
                </div>

                <div class="qty-box">

                    <button
                        class="minus"
                        data-index="${index}">
                        −
                    </button>

                    <span class="qty">
                        ${item.quantity}
                    </span>

                    <button
                        class="plus"
                        data-index="${index}">
                        +
                    </button>

                    <button
                        class="remove-btn"
                        data-index="${index}">
                        ❌
                    </button>

                </div>

            `;


            cartItems.appendChild(cartItem);

        });


        if (totalPrice) {
            totalPrice.innerText = total;
        }


        localStorage.setItem(
            "burgerPizzaCart",
            JSON.stringify(cart)
        );

    }


    // =========================
    // ADD TO CART
    // =========================

    const addCartButtons =
        document.querySelectorAll(".add-cart");


    addCartButtons.forEach(function (button) {

        button.addEventListener("click", function (e) {

            e.preventDefault();
            e.stopPropagation();


            const card =
                button.closest(".food-card");


            if (!card) return;


            const nameElement =
                card.querySelector("h3");


            if (!nameElement) return;


            const itemName =
                nameElement.innerText.trim();


            // If size button clicked
            // use its own price

            let priceElement =
                button.querySelector("span");


            // If main Add to Cart button clicked,
            // use first price from size-box

            if (!priceElement) {

                const firstSize =
                    card.querySelector(".size-box button span");

                priceElement = firstSize;

            }


            if (!priceElement) {

                alert("Price not found for " + itemName);

                return;

            }


            const price =
                Number(
                    priceElement.innerText
                        .replace("₹", "")
                        .replace(",", "")
                        .trim()
                );


            if (isNaN(price)) {

                alert("Invalid price for " + itemName);

                return;

            }


            // Size name

            let size = "";

            if (
                button.parentElement &&
                button.parentElement.classList.contains("size-box")
            ) {

                size =
                    button.innerText
                        .replace(priceElement.innerText, "")
                        .trim();

            }


            const itemKey =
                itemName + (size ? " - " + size : "");


            // Find existing item

            const existingItem =
                cart.find(function (item) {

                    return item.key === itemKey;

                });


            if (existingItem) {

                existingItem.quantity++;

            } else {

                cart.push({

                    key: itemKey,

                    name: itemName,

                    size: size,

                    price: price,

                    quantity: 1

                });

            }


            updateCart();


            // Open cart automatically

            if (cartPopup) {
                cartPopup.style.display = "block";
            }


            console.log(
                "Added to cart:",
                itemKey,
                price
            );

        });

    });


    // =========================
    // PLUS / MINUS / REMOVE
    // =========================

    if (cartItems) {

        cartItems.addEventListener(
            "click",
            function (e) {

                const button =
                    e.target.closest("button");


                if (!button) return;


                const index =
                    Number(button.dataset.index);


                if (
                    isNaN(index) ||
                    !cart[index]
                ) {
                    return;
                }


                // PLUS

                if (
                    button.classList.contains("plus")
                ) {

                    cart[index].quantity++;

                }


                // MINUS

                else if (
                    button.classList.contains("minus")
                ) {

                    cart[index].quantity--;

                    if (cart[index].quantity <= 0) {

                        cart.splice(index, 1);

                    }

                }


                // REMOVE

                else if (
                    button.classList.contains("remove-btn")
                ) {

                    cart.splice(index, 1);

                }


                updateCart();

            }
        );

    }


    // =========================
    // OPEN CART
    // =========================

    const cartBox =
        document.querySelector(".cart-box");


    if (cartBox && cartPopup) {

        cartBox.addEventListener(
            "click",
            function () {

                cartPopup.style.display = "block";

            }
        );

    }


    // =========================
    // CLOSE CART
    // =========================

    if (closeCart && cartPopup) {

        closeCart.addEventListener(
            "click",
            function () {

                cartPopup.style.display = "none";

            }
        );

    }


    // =========================
    // CHECKOUT WHATSAPP
    // =========================

    if (checkoutBtn) {

        checkoutBtn.addEventListener(
            "click",
            function () {

                const customerName =
                    document.getElementById("customerName");

                const customerPhone =
                    document.getElementById("customerPhone");

                const customerAddress =
                    document.getElementById("customerAddress");


                if (
                    !customerName ||
                    !customerPhone ||
                    !customerAddress
                ) {

                    alert(
                        "⚠️ Customer details fields not found."
                    );

                    return;

                }


                if (
                    customerName.value.trim() === "" ||
                    customerPhone.value.trim() === "" ||
                    customerAddress.value.trim() === ""
                ) {

                    alert(
                        "⚠️ Please fill all customer details."
                    );

                    return;

                }


                const phone =
                    customerPhone.value.trim();


                if (!/^[0-9]{10}$/.test(phone)) {

                    alert(
                        "⚠️ Please enter a valid 10-digit mobile number."
                    );

                    customerPhone.focus();

                    return;

                }


                if (cart.length === 0) {

                    alert(
                        "🛒 Your cart is empty!"
                    );

                    return;

                }


                let message =
` BURGER PIZZA — NEW ORDER

 Customer Name:
${customerName.value.trim()}

 Mobile Number:
${customerPhone.value.trim()}

 Delivery Address:
${customerAddress.value.trim()}

 ORDER DETAILS
-------------------------
`;


                let finalTotal = 0;


                cart.forEach(function (item) {

                    const itemTotal =
                        item.price * item.quantity;

                    finalTotal += itemTotal;


                    message +=
`${item.name}${item.size ? " (" + item.size + ")" : ""} × ${item.quantity} = ₹${itemTotal}
`;

                });


                message +=
`
-------------------------
 TOTAL AMOUNT: ₹${finalTotal}

 Thank you for ordering from Burger Pizza!`;


                const whatsappLink =
                    "https://wa.me/919718660360?text=" +
                    encodeURIComponent(message);


                window.open(
                    whatsappLink,
                    "_blank"
                );

            }
        );

    }


    // =========================
    // INITIAL LOAD
    // =========================

    updateCart();


});
