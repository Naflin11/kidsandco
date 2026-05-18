const productsContainer = document.getElementById("shop-products");

let allProducts = [];

async function loadProducts() {
  try {
    const response = await fetch("data/products.json");
    allProducts = await response.json();

    renderProducts(allProducts);
    setupFilters();
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function renderProducts(products) {
  if (!productsContainer) return;

  productsContainer.innerHTML = products
    .map(
      (product) => `
      <div class="product-card">
        <div class="product-card-image">
          <span class="product-badge">${product.badge}</span>
          <img src="${product.image}" alt="${product.name}">
        </div>

        <div class="product-info">
          <span class="product-id">ID: ${product.id}</span>
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.description}</p>

          <div class="product-bottom">
            <span class="product-price">${product.price}</span>
            <span class="product-stock">${product.stock}</span>
          </div>

          <div class="product-actions">
            <a href="product.html?id=${product.id}" class="btn secondary">View Details</a>
            <button class="btn primary" onclick='addToCart(${JSON.stringify(product)})'>
              Add to Cart
            </button>
            <a
              href="https://wa.me/947XXXXXXXX?text=Hi%2C%20I%20am%20interested%20in%20Product%20ID%3A%20${product.id}%20-%20${encodeURIComponent(product.name)}"
              target="_blank"
              class="btn whatsapp"
            >
              Inquire
            </a>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.dataset.category;

      if (category === "all") {
        renderProducts(allProducts);
      } else {
        const filteredProducts = allProducts.filter(
          (product) => product.category === category
        );
        renderProducts(filteredProducts);
      }
    });
  });
}

loadProducts();