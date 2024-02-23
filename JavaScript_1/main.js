document.addEventListener('DOMContentLoaded', async function () {
  let allProducts = [];

  async function fetchProducts(url) {
    try {
      // Show loading bar
      const loadingBar = document.querySelector('.loading-bar');
      loadingBar.style.display = 'block';

      const response = await fetch(url);
      allProducts = await response.json();
      displayProducts(allProducts);
      hideLoadingBar();
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  async function fetchProductDetails(productId) {
    try {
      const url = `https://api.noroff.dev/api/v1/rainy-days/${productId}`;
      const response = await fetch(url);
      const product = await response.json();
      displayProductDetails(product);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  }

  // Function to hide loading bar
  function hideLoadingBar() {
    const loadingBar = document.querySelector('.loading-bar');
    loadingBar.style.display = 'none';
  }

  // function for displaying products in product grid
function displayProducts(products) {
  const container = document.getElementById('productGallery');
  container.innerHTML = '';

  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');

    const productInfo = document.createElement('div');
    productInfo.classList.add('info');

    const productName = document.createElement('h3');
    productName.textContent = product.title;
    productName.classList.add('title');

    const productPrice = document.createElement('p');
    productPrice.textContent = `$${product.price}`;
    productPrice.classList.add('price');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    const productImg = document.createElement('img');
    productImg.src = product.image;

    const detailsButton = document.createElement('button');
    detailsButton.textContent = 'Show details';
    detailsButton.classList.add('details-button');

    // Appending elements in containers
    productInfo.appendChild(productName);
    productInfo.appendChild(productPrice);
    imageContainer.appendChild(productImg);
    productElement.appendChild(imageContainer);
    productElement.appendChild(productInfo);
    productElement.appendChild(detailsButton);
    container.appendChild(productElement);

    // Add event listener to the product element
    productElement.addEventListener('click', function () {
      window.location.href = `details.html?id=${product.id}`;
    });
  });
}

// function for displaying details on product page
  async function displayProductDetails(product) {
    const productDetailsContainer = document.getElementById('productDetails');
    productDetailsContainer.innerHTML = '';
    const rightColContainer = document.createElement('div');
  
    // Create and append product image
    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.classList.add('prod-img');
    productDetailsContainer.appendChild(productImage);
  
    // Create and append details in the right column container
    appendDetails(rightColContainer, [
      { tag: 'h2', textContent: product.title },
      { tag: 'p', textContent: product.description },
      { tag: 'p', textContent: `Price: ${product.price}` }
    ]);

    // Create and append add to cart button
    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.classList.add('button-2');
    addToCartButton.setAttribute('id', 'addToCart');
    addToCartButton.addEventListener('click', function () {
      addToCart(product);
    });
    rightColContainer.classList.add('product-right-col');
    rightColContainer.appendChild(addToCartButton);
    productDetailsContainer.appendChild(rightColContainer);
  }
  
  function appendDetails(container, details) {
    details.forEach(detail => {
      const element = document.createElement(detail.tag);
      element.textContent = detail.textContent;
      container.appendChild(element);
    });
  }

  // Function to update cart indicator
function updateCartIndicator() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartIndicator = document.getElementById('cartIndicator');
  if (cartIndicator) {
    cartIndicator.textContent = cart.length.toString();
  }
}
  
 // Function to add product to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartIndicator();
  alert('Product added to cart');
}

// Function to remove product from cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartIndicator();
  updateCartDisplay();
}

// Function to calculate total price
function calculateTotalPrice() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let totalPrice = 0;
  cart.forEach(product => {
    totalPrice += product.price;
  });
  return totalPrice;
}

// Function to update cart display
function updateCartDisplay() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let cartInfo = document.getElementById('cart-info');
  let totalPriceDisplay = document.getElementById('total-price');

  // Clear previous cart info
  cartInfo.innerHTML = '';
  
  // Display each product in cart
  cart.forEach((product, index) => {
    let productInfo = document.createElement('div');
    productInfo.textContent = product.title + ' - $' + product.price;
    
    let removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', function() {
      removeFromCart(index);
    });
    
    productInfo.appendChild(removeButton);
    cartInfo.appendChild(productInfo);
  });
  
  // Update total price display
  if (calculateTotalPrice() === 0) {
    totalPriceDisplay.textContent = 'No items added to cart.';
} else {
    totalPriceDisplay.textContent = 'Total Price: $' + calculateTotalPrice().toFixed(2);
}

}

// Call updateCartDisplay when the page loads to display existing cart items
window.onload = function() {
  updateCartDisplay();
};

  // filter products by gender
  function filterProducts(gender) {
    const filteredProducts = allProducts.filter(product =>
      gender.toLowerCase() === 'show all' || product.gender.toLowerCase() === gender.toLowerCase()
    );
    displayProducts(filteredProducts);
  }
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => filterProducts(button.dataset.gender));
  });

  // Initialize loading bar
  const loadingBar = document.querySelector('.loading-bar');
  hideLoadingBar(); // Initially hide loading bar


  // Fetch products and display details on DOMContentLoaded
  const productId = new URLSearchParams(window.location.search).get('id');
  if (productId) {
    fetchProductDetails(productId);
  } else {
    fetchProducts('https://api.noroff.dev/api/v1/rainy-days');
  }
});

// display message when purchase complete
const completeButton = document.getElementById('completePurchase');
completeButton.addEventListener('click', function() {

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if the cart is empty
  if (cart.length === 0) {
    alert('Your cart is empty. Please add products before completing the purchase.');
    return;
  }

  completeButton.remove();
  localStorage.removeItem('cart');
  window.open('complete.html', '_blank');
});
  
