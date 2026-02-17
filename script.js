// cart data
let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "all";

const cartCountElement = document.getElementById("cart-count");

// update cart count
function updateCartCount() {
  let totalCount = 0;
  for (let i = 0; i < cart.length; i++) {
    totalCount += cart[i].quantity || 1;
  }
  cartCountElement.textContent = totalCount;
}

// mobile menu toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuBtn.addEventListener("click", function () {
  mobileMenu.classList.toggle("hidden");
});

// load categories
async function loadCategories() {
  try {
    const res = await fetch("https://fakestoreapi.com/products/categories");
    const data = await res.json();
    showCategories(data);
  } catch (err) {
    console.log(err);
  }
}

const showCategories = (categories) => {
  const categoryFilters = document.getElementById("category-filters");

  categories.forEach((cat) => {
    const button = document.createElement("button");
    button.className =
      "category-btn px-6 py-2 rounded-full font-medium transition";
    button.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    button.dataset.category = cat;

    button.addEventListener("click", function () {
      filterByCategory(cat);
    });

    categoryFilters.appendChild(button);
  });
};

// filter products by category
async function filterByCategory(category) {
  currentCategory = category;

  // update active button
  const buttons = document.querySelectorAll(".category-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.category === category) {
      btn.classList.add("active");
    }
  });

  // show spinner
  document.getElementById("products-loading").classList.add("active");
  document.getElementById("products-grid").innerHTML = "";

  // load products
  if (category === "all") {
    showProducts(allProducts);
    document.getElementById("products-loading").classList.remove("active");
  } else {
    try {
      const res = await fetch(
        `https://fakestoreapi.com/products/category/${category}`,
      );
      const data = await res.json();
      showProducts(data);
      document.getElementById("products-loading").classList.remove("active");
    } catch (err) {
      console.log(err);
      document.getElementById("products-loading").classList.remove("active");
    }
  }
}

// create product card
function createProductCard(product) {
  let title = product.title;
  if (title.length > 50) {
    title = title.substring(0, 50) + "...";
  }

  const card = `
    <div class="product-card bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="bg-gray-100 p-6 flex items-center justify-center h-64">
        <img src="${product.image}" alt="${product.title}" class="max-h-full max-w-full object-contain">
      </div>
      <div class="p-4">
        <span class="inline-block bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-2">
          ${product.category}
        </span>
        <div class="flex items-center mb-2">
          <span class="star-rating text-sm mr-1">★</span>
          <span class="text-sm text-gray-600">${product.rating.rate} (${product.rating.count})</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2 h-14 overflow-hidden">${title}</h3>
        <p class="text-xl font-bold text-gray-800 mb-4">$${product.price}</p>
        <div class="flex gap-2">
          <button onclick="showProductDetails(${product.id})" class="flex-1 border border-gray-300 text-white bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg transition text-sm font-medium">
            <i class="fa-solid fa-eye mr-1"></i> Details
          </button>
          <button onclick="addToCart(${product.id})" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium">
            <i class="fa-solid fa-cart-plus mr-1"></i> Add
          </button>
        </div>
      </div>
    </div>
  `;

  return card;
}

// show products on page
function showProducts(products) {
  const productsGrid = document.getElementById("products-grid");
  let html = "";

  for (let i = 0; i < products.length; i++) {
    html += createProductCard(products[i]);
  }

  productsGrid.innerHTML = html;
}

// load all products
const loadAllProducts = async () => {
  document.getElementById("products-loading").classList.add("active");

  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    allProducts = data;
    showProducts(allProducts);
    document.getElementById("products-loading").classList.remove("active");
  } catch (err) {
    console.log(err);
    document.getElementById("products-loading").classList.remove("active");
  }
};

// load trending products for home page
const loadTrendingProducts = async () => {
  try {
    const res = await fetch("https://fakestoreapi.com/products?limit=4");
    const data = await res.json();
    allProducts = data;
    const trendingContainer = document.getElementById("trending-products");
    let html = "";

    for (let i = 0; i < data.length; i++) {
      html += createProductCard(data[i]);
    }

    trendingContainer.innerHTML = html;
    document.getElementById("trending-loading").classList.remove("active");
  } catch (err) {
    console.log(err);
    document.getElementById("trending-loading").classList.remove("active");
  }
};

// show product details in modal
async function showProductDetails(productId) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
    const product = await res.json();

    const modalContent = document.getElementById("modal-content");
    const html = `
  <div class="flex flex-col md:flex-row gap-6 bg-white text-gray-800 p-4 rounded-lg">
    <div class="md:w-1/2 bg-gray-100 p-6 rounded-lg flex items-center justify-center">
      <img src="${product.image}" alt="${product.title}" class="max-h-80 object-contain">
    </div>

    <div class="md:w-1/2">
      <span class="inline-block bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-2">
        ${product.category}
      </span>

      <h3 class="text-2xl font-bold mb-2">${product.title}</h3>

      <div class="flex items-center mb-4">
        <span class="star-rating text-lg mr-1 text-yellow-500">★</span>
        <span class="text-gray-600">${product.rating.rate} (${product.rating.count} reviews)</span>
      </div>

      <p class="text-3xl font-bold text-gray-900 mb-4">$${product.price}</p>

      <p class="text-gray-700 mb-6">${product.description}</p>

      <button onclick="addToCart(${product.id}); document.getElementById('product-modal').close();" 
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition font-semibold">
        <i class="fa-solid fa-cart-plus mr-2"></i> Add to Cart
      </button>
    </div>
  </div>
`;

    modalContent.innerHTML = html;
    document.getElementById("product-modal").showModal();
  } catch (err) {
    console.log(err);
  }
}

// add product to cart
function addToCart(productId) {
  let product = null;

  for (let i = 0; i < allProducts.length; i++) {
    if (allProducts[i].id === productId) {
      product = allProducts[i];
      break;
    }
  }

  if (product) {
    let existingIndex = -1;

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === productId) {
        existingIndex = i;
        break;
      }
    }

    if (existingIndex === -1) {
      const cartItem = { ...product, quantity: 1 };
      cart.push(cartItem);
    } else {
      cart[existingIndex].quantity += 1;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    if (document.getElementById("cart-sidebar")) {
      renderCartItems();
    } else {
      alert("Product added to cart! Go to Products page to view your cart.");
    }
  }
}

// render cart items in sidebar
function renderCartItems() {
  const cartItemsContainer = document.getElementById("cart-items-container");
  const emptyMessage = document.getElementById("empty-cart-message");
  const cartSummary = document.getElementById("cart-summary");

  if (!cartItemsContainer || !emptyMessage || !cartSummary) {
    return;
  }

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "";
    emptyMessage.classList.remove("hidden");
    cartSummary.classList.add("hidden");
    return;
  }

  emptyMessage.classList.add("hidden");
  cartSummary.classList.remove("hidden");

  let html = "";

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    let itemTitle = item.title;

    if (itemTitle.length > 50) {
      itemTitle = itemTitle.substring(0, 50) + "...";
    }

    const quantity = item.quantity || 1;
    html += `
      <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div class="w-20 h-20 bg-white p-2 rounded flex items-center justify-center">
          <img src="${item.image}" alt="${item.title}" class="max-w-full max-h-full object-contain">
        </div>
        <div class="flex-1">
          <h4 class="font-semibold text-gray-800 mb-1">${itemTitle}</h4>
          <p class="text-sm text-gray-600 mb-1">Category: ${item.category}</p>
          <p class="text-lg font-bold text-indigo-600">$${item.price}</p>
          <div class="flex items-center gap-2 mt-2">
            <button onclick="decreaseQuantity(${item.id})" class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 font-bold transition">-</button>
            <span class="font-semibold text-gray-800 w-8 text-center">${quantity}</span>
            <button onclick="increaseQuantity(${item.id})" class="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white font-bold transition">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition">
          <i class="fa-solid fa-trash text-xl"></i>
        </button>
      </div>
    `;
  }

  cartItemsContainer.innerHTML = html;
  calculateTotal();
}

// remove item from cart
function removeFromCart(productId) {
  const newCart = [];

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id !== productId) {
      newCart.push(cart[i]);
    }
  }

  cart = newCart;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// clear cart
function clearCart() {
  if (confirm("Are you sure you want to clear your cart?")) {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
  }
}

// calculate total price
function calculateTotal() {
  let totalItems = 0;
  let totalPrice = 0;

  for (let i = 0; i < cart.length; i++) {
    const quantity = cart[i].quantity || 1;
    totalItems += quantity;
    totalPrice += cart[i].price * quantity;
  }

  document.getElementById("total-items").textContent = totalItems;
  document.getElementById("total-price").textContent =
    "$" + totalPrice.toFixed(2);
}

// increase quantity
function increaseQuantity(productId) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].quantity += 1;
      break;
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// decrease quantity
function decreaseQuantity(productId) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      if (cart[i].quantity > 1) {
        cart[i].quantity -= 1;
      } else {
        removeFromCart(productId);
        return;
      }
      break;
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  // load trending products on home page
  if (document.getElementById("trending-products")) {
    loadTrendingProducts();
  }

  // load categories on products page
  if (document.getElementById("category-filters")) {
    loadCategories();
  }

  // load all products on products page
  if (document.getElementById("products-grid")) {
    loadAllProducts();
  }

  // render cart if sidebar exists
  if (document.getElementById("cart-sidebar")) {
    renderCartItems();
  }
});
