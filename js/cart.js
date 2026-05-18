const WHATSAPP_NUMBER = "947XXXXXXXX";

function getCart() {
  return JSON.parse(localStorage.getItem("kidsCoCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("kidsCoCart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart(cart);
  window.location.href = "cart.html";
}

function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItemsContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <img src="assets/images/cart.jpg" alt="Empty cart">
        <h3>Your cart is empty</h3>
        <p>Browse products and add items before sending an inquiry.</p>
        <a href="shop.html" class="btn primary">Shop Now</a>
      </div>
    `;

    cartCount.textContent = "0";
    cartTotal.textContent = "LKR 0";
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">

          <div class="cart-item-info">
            <span class="product-id">ID: ${item.id}</span>
            <h3>${item.name}</h3>
            <p>${item.price}</p>

            <div class="quantity-control">
              <button onclick="updateQuantity('${item.id}', -1)">−</button>
              <span>${item.quantity}</span>
              <button onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
          </div>

          <button class="remove-btn" onclick="removeFromCart('${item.id}')">
            Remove
          </button>
        </div>
      `
    )
    .join("");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce((sum, item) => {
    const numericPrice = Number(String(item.price).replace(/[^\d]/g, ""));
    return sum + numericPrice * item.quantity;
  }, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = `LKR ${totalPrice.toLocaleString()}`;
}

function updateQuantity(productId, change) {
  const cart = getCart();
  const item = cart.find((product) => product.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart(cart);
  renderCart();
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  localStorage.removeItem("kidsCoCart");
  renderCart();
}

function sendCartInquiry() {
  const cart = getCart();

  if (cart.length === 0) {
    alert("Your cart is empty. Please add products first.");
    return;
  }

  let message = "Hi Kids & Co, I would like to inquire about these items:%0A%0A";

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}%0A`;
    message += `Product ID: ${item.id}%0A`;
    message += `Quantity: ${item.quantity}%0A`;
    message += `Price: ${item.price}%0A%0A`;
  });

  message += "Please confirm availability, final total, and delivery details.";

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", renderCart);