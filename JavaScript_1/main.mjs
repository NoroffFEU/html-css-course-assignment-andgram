document.addEventListener('DOMContentLoaded', function () {
  const productContainer = document.getElementById('productGrid');
  const apiUrl = 'https://api.noroff.dev/api/v1/rainy-days';

  let allProducts = [];

  async function fetchProducts(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        allProducts = data; // Save products globally
        displayProducts(allProducts);
      } else {
        console.error('Unexpected data format:', data);
        displayError('Unexpected data format. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      displayError('Error fetching data. Please try again later.');
    }
  }

  function displayProducts(products) {
    // Clear existing content
    productContainer.innerHTML = '';

    products.forEach(product => {
      const productElement = createProductElement(product);
      productContainer.appendChild(productElement);
    });
  }

  function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.classList.add('card');
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.title} Image" class="card-img image-hover">
      <h3>${product.title}</h3>
      <p class="card-price">$<span>${product.price}</span></p>`;

    return productElement;
  }

  function displayError(message) {
    // Display error message to the user
    console.error(message);
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    productContainer.appendChild(errorElement);
  }

  function filterProducts(gender) {
    const filteredProducts = allProducts.filter(product => {
      // Assuming the property is named "gender"
      return gender === 'show all' || product.gender === gender;
    });

    displayProducts(filteredProducts);
  }

  // Filter buttons
  const mensButton = document.getElementById('mensButton');
  const womensButton = document.getElementById('womensButton');
  const showAllButton = document.getElementById('showAllButton');

  // Initial fetch
  fetchProducts(apiUrl);

  // Event listeners for filter buttons (added after the initial fetch)
  mensButton.addEventListener('click', () => filterProducts('Male'));
  womensButton.addEventListener('click', () => filterProducts('Female'));
  showAllButton.addEventListener('click', () => filterProducts('show all'));
});
