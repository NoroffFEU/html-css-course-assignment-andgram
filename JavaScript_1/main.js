document.addEventListener('DOMContentLoaded', async function () {
  let allProducts = [];

  async function fetchProducts(url) {
    try {
      const response = await fetch(url);
      allProducts = await response.json();
      displayProducts(allProducts);
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

      // link to details page
      productElement.addEventListener('click', function () {
        window.location.href = `details.html?id=${product.id}`;
      });

      productInfo.appendChild(productName);
      productInfo.appendChild(productPrice);
      imageContainer.appendChild(productImg);
      productElement.appendChild(imageContainer);
      productElement.appendChild(productInfo);
      productElement.appendChild(detailsButton);
      container.appendChild(productElement);
    });
  }

  async function displayProductDetails(product) {
    const productDetailsContainer = document.getElementById('productDetails');
    productDetailsContainer.innerHTML = '';

    const productImage = document.createElement('img');
    productImage.src = product.image;
    productDetailsContainer.appendChild(productImage);

    const productName = document.createElement('h2');
    productName.textContent = product.title;
    productDetailsContainer.appendChild(productName);

    const productDescription = document.createElement('p');
    productDescription.textContent = product.description;
    productDetailsContainer.appendChild(productDescription);

    const productPrice = document.createElement('p');
    productPrice.textContent = `Price: ${product.price}`;
    productDetailsContainer.appendChild(productPrice);

    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.addEventListener('click', function () {
      addToCart(product);
    });
    productDetailsContainer.appendChild(addToCartButton);
  }

  // Function to add product to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay(); // Update cart display after adding product
  alert('Product added to cart');
}

// Function to remove product from cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay(); // Update cart display after removing product
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
  let cartInfo = document.getElementById('cart-info'); // Assuming there's an element with id 'cart-info' to display cart information
  let totalPriceDisplay = document.getElementById('total-price'); // Assuming there's an element with id 'total-price' to display total price
  
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
  totalPriceDisplay.textContent = 'Total Price: $' + calculateTotalPrice();
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

  // Fetch products and display details on DOMContentLoaded
  const productId = new URLSearchParams(window.location.search).get('id');
  if (productId) {
    fetchProductDetails(productId);
  } else {
    fetchProducts('https://api.noroff.dev/api/v1/rainy-days');
  }
});
