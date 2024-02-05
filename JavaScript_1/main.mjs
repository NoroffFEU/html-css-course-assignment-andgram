document.addEventListener('DOMContentLoaded', function() {
  async function fetchProducts(url) {
    try {
      let response = await fetch(url);
      let data = await response.json();

      // Check if the response contains an array of products
      if (Array.isArray(data)) {
        // Display the products
        displayProducts(data);
      } else {
        console.log('Unexpected data format:', data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Display products
  function displayProducts(products) {
    const container = document.getElementById('productGrid');

    // Clear existing content in container 
    container.innerHTML = '';

    // Loop through each product and create HTML elements
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.innerHTML =  
      `<h3>${product.title}</h3>
      <p class="card-price">$<span>${product.price}</span></p>`;

      container.appendChild(productElement);
    });
  }

  fetchProducts('https://api.noroff.dev/api/v1/rainy-days');
});

console.log('script running');