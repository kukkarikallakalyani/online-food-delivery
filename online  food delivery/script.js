/* =========================================
   FOOD EXPRESS - SCRIPT.JS
   Search + Categories + Cart + Checkout
   ========================================= */

const foodPrices = {
    "Margherita Pizza": 299,
    "Pepperoni Pizza": 349,
    "Cheese Burger": 199,
    "Veggie Burger": 179,
    "Paneer Butter Masala": 279,
    "Butter Chicken": 329,
    "Chicken Biryani": 299,
    "Dal Makhani": 219,
    "Ramen Noodles": 279,
    "Chicken Tacos": 249,
    "Healthy Salad": 249,
    "Chocolate Cake": 199,
    "Ice Cream Sundae": 169,
    "Cold Drink": 99,
    "Bubble Tea": 129
};

/* ================= CART ================= */

let cart = JSON.parse(localStorage.getItem("foodCart")) || [];

/* ================= SEARCH ================= */

function searchFood() {

    const searchBox = document.getElementById("searchBox");

    if (!searchBox) return;

    const text = searchBox.value.toLowerCase().trim();

    document.querySelectorAll(".card").forEach(function(card) {

        const title = card.querySelector("h3");

        if (!title) return;

        const name = title.textContent.toLowerCase();

        card.style.display =
            name.includes(text) ? "" : "none";

    });
}

/* ================= CATEGORY ================= */

function filterCategory(category) {

    document.querySelectorAll(".card").forEach(function(card) {

        const cardCategory =
            card.getAttribute("data-category");

        if (
            category === "all" ||
            cardCategory === category
        ) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });

}

function showAllFood() {

    document.querySelectorAll(".card").forEach(function(card) {
        card.style.display = "";
    });

}

/* ================= ADD TO CART ================= */

function addToCart(name) {

    const price = foodPrices[name] || 0;

    const existingItem =
        cart.find(function(item) {
            return item.name === name;
        });

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    saveCart();
    updateCart();

    showNotification(
        name + " added to cart 🛒"
    );
}

/* ================= REMOVE ================= */

function removeFromCart(index) {

    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart();
    updateCart();

}

/* ================= INCREASE ================= */

function increaseQuantity(index) {

    if (!cart[index]) return;

    cart[index].quantity++;

    saveCart();
    updateCart();

}

/* ================= DECREASE ================= */

function decreaseQuantity(index) {

    if (!cart[index]) return;

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    saveCart();
    updateCart();

}

/* ================= SAVE ================= */

function saveCart() {

    localStorage.setItem(
        "foodCart",
        JSON.stringify(cart)
    );

}

/* ================= UPDATE CART ================= */

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    if (!cartItems) return;

    const cartCount =
        document.getElementById("cartCount");

    const subtotalElement =
        document.getElementById("subtotal");

    const deliveryElement =
        document.getElementById("deliveryCharge");

    const discountElement =
        document.getElementById("discount");

    const totalElement =
        document.getElementById("totalPrice");

    cartItems.innerHTML = "";

    let totalItems = 0;
    let subtotal = 0;

    /* EMPTY CART */

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty 🛒</p>";

    }

    /* CART ITEMS */

    cart.forEach(function(item, index) {

        const itemTotal =
            item.price * item.quantity;

        totalItems += item.quantity;

        subtotal += itemTotal;

        const div =
            document.createElement("div");

        div.className = "cart-row";

        div.innerHTML = `
            <div class="cart-info">

                <strong>${item.name}</strong>

                <p>
                    ₹${item.price} × ${item.quantity}
                </p>

            </div>

            <div class="cart-controls">

                <button
                    type="button"
                    onclick="decreaseQuantity(${index})">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    type="button"
                    onclick="increaseQuantity(${index})">
                    +
                </button>

                <button
                    type="button"
                    onclick="removeFromCart(${index})">
                    🗑️
                </button>

            </div>

            <strong>
                ₹${itemTotal}
            </strong>
        `;

        cartItems.appendChild(div);

    });

    /* DELIVERY */

    let deliveryCharge = 0;

    if (subtotal > 0 && subtotal < 499) {
        deliveryCharge = 40;
    }

    /* DISCOUNT */

    let discount = 0;

    if (subtotal >= 999) {
        discount = 100;
    }

    /* FINAL TOTAL */

    const total =
        subtotal + deliveryCharge - discount;

    /* UPDATE HTML */

    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    if (subtotalElement) {
        subtotalElement.textContent = subtotal;
    }

    if (deliveryElement) {
        deliveryElement.textContent = deliveryCharge;
    }

    if (discountElement) {
        discountElement.textContent = discount;
    }

    if (totalElement) {
        totalElement.textContent = total;
    }

}

/* ================= CHECKOUT ================= */

function placeOrder() {

    if (cart.length === 0) {

        showNotification(
            "Please add food to your cart first 🛒"
        );

        return;

    }

    saveCart();

    window.location.href =
        "payment.html";

}

/* ================= NOTIFICATION ================= */

function showNotification(message) {

    const old =
        document.querySelector(".food-message");

    if (old) {
        old.remove();
    }

    const box =
        document.createElement("div");

    box.className = "food-message";

    box.textContent = message;

    box.style.position = "fixed";
    box.style.right = "20px";
    box.style.bottom = "20px";
    box.style.background = "#ff5722";
    box.style.color = "white";
    box.style.padding = "14px 20px";
    box.style.borderRadius = "30px";
    box.style.zIndex = "99999";
    box.style.fontWeight = "bold";
    box.style.boxShadow =
        "0 5px 15px rgba(0,0,0,0.25)";

    document.body.appendChild(box);

    setTimeout(function() {

        if (box) {
            box.remove();
        }

    }, 2500);

}

/* ================= PAGE LOAD ================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCart();

        const searchBox =
            document.getElementById("searchBox");

        if (searchBox) {

            searchBox.addEventListener(
                "input",
                searchFood
            );

        }

    }
);