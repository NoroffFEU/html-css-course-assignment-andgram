

// hente informasjon fra API

document.addEventListener('DOMContentLoaded', function () {
  const productContainer = document.getElementById('productGrid');
  const apiUrl = 'https://api.noroff.dev/api/v1/rainy-days';

  let allProducts = [];

  async function fetchProducts(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        allProducts = data;
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
    productContainer.innerHTML = '';

    products.forEach(product => {
      const productElement = createProductElement(product);
      productContainer.appendChild(productElement);
    });
  }

  function createProductElement(product) {
    const productElement = document.createElement('a');
    productElement.classList.add('card');
    productElement.href = `product-details.html?id=${product.id}`; // Legg til ID i lenken
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.title} Image" class="card-img image-hover">
      <h3>${product.title}</h3>
      <p class="card-price">$<span>${product.price}</span></p>`;
      productElement.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = productElement.href; // Gå til lenken definert i href
      });

    return productElement;
  }

  function displayError(message) {
    console.error(message);
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    productContainer.appendChild(errorElement);
  }




// filtrering av produkt



  function filterProducts(gender) {
    const filteredProducts = allProducts.filter(product => {
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

  // Event listeners for filter buttons
  mensButton.addEventListener('click', () => filterProducts('Male'));
  womensButton.addEventListener('click', () => filterProducts('Female'));
  showAllButton.addEventListener('click', () => filterProducts('show all'));
});



// ny side med produktinfo

document.addEventListener('DOMContentLoaded', function () {
  const productDetailsContainer = document.getElementById('productDetails');

  // Hent produkt-ID fra URL-parameteren
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  // Hent produktinformasjon fra API-en basert på produkt-ID
  async function fetchProductDetails(productId) {
      const apiUrl = `https://api.noroff.dev/api/v1/rainy-days/${productId}`;
      try {
          const response = await fetch(apiUrl);
          const product = await response.json();
          displayProductDetails(product);
      } catch (error) {
          console.error('Error fetching product details:', error);
      }
  }

  // Vis produktinformasjonen på siden
  function displayProductDetails(product) {
      const productElement = document.createElement('div');
      productElement.classList.add('split', 'about');

      // div for bildet
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('prod-img');
      const imageElement = document.createElement('img');
      imageElement.src = product.image;
      imageElement.alt = product.title;
      imageDiv.appendChild(imageElement);
      productElement.appendChild(imageDiv);

      // div for resten av innholdet
      const textDiv = document.createElement('div');
      textDiv.classList.add('product-right-col');
      
      //  tittel
      const titleElement = document.createElement('h3');
      titleElement.textContent = product.title;
      textDiv.appendChild(titleElement);

      //  beskrivelse
      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = product.description;
      textDiv.appendChild(descriptionElement);

      //  pris
      const priceElement = document.createElement('p');
      priceElement.textContent = `$${product.price}`;
      textDiv.appendChild(priceElement);

      // "legg til handlekurv" -knapp
      const addButton = document.createElement('button');
      addButton.textContent = 'Legg til handlekurv';
      addButton.addEventListener('click', () => {
          // logikk for å legge til produktet i handlekurven
          alert('Produktet ble lagt til i handlekurven.');
      });
      textDiv.appendChild(addButton);

      productElement.appendChild(textDiv);

      productDetailsContainer.appendChild(productElement);
  }

  fetchProductDetails(productId);
});