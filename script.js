let cart = [];
let totalItems = 0;
let totalPrice = 0;

let prices = {
    "Margherita Pizza": 299,
    "Cheese Burger": 199,
    "Healthy Salad": 249,
    "Cold Drink": 99,
    "Chicken Biryani": 249,
    "Veg Noodles": 179,
    "French Fries": 129,
    "Chocolate Cake": 299,
    "Pepperoni Pizza": 349,
    "Ice Cream": 149,
    "Paneer Butter Masala": 269,
    "Masala Dosa": 149,
    "Fried Rice": 199,
    "Chicken Curry": 289,
    "Veg Sandwich": 139,
    "Momos": 169,
    "Chicken Burger": 229,
    "White Sauce Pasta": 259,
    "Donut": 119,
    "Coffee": 99
};

function addToCart(item) {
    cart.push(item);
    totalItems++;
    totalPrice += prices[item];

    document.getElementById("cartItems").innerHTML = "";

    cart.forEach(function(food) {
        let li = document.createElement("li");
        li.innerHTML = food;
        document.getElementById("cartItems").appendChild(li);
    });

    document.getElementById("cartCount").innerHTML = totalItems;
    document.getElementById("totalPrice").innerHTML = totalPrice;
}

function searchFood() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    let cards = document.getElementsByClassName("card");

    for (let i = 0; i < cards.length; i++) {
        let foodName = cards[i].getElementsByTagName("h3")[0].innerText.toLowerCase();

        if (foodName.includes(input)) {
            cards[i].style.display = "block";
        } else {
            cards[i].style.display = "none";
        }
    }
}

function placeOrder() {
    if (totalItems === 0) {
        alert("🛒 Your cart is empty!");
    } else {
        alert("🎉 Order placed successfully!\n\nTotal Items: " + totalItems + "\nTotal Amount: ₹" + totalPrice);
        cart = [];
        totalItems = 0;
        totalPrice = 0;

        document.getElementById("cartItems").innerHTML = "";
        document.getElementById("cartCount").innerHTML = totalItems;
        document.getElementById("totalPrice").innerHTML = totalPrice;
    }
}