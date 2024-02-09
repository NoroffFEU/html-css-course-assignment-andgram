

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



    // handlekurv funksjonalitet

    // Legg til funksjon for å legge til produkt i handlekurven
    function addToCart(product) {
      let cart = JSON.parse(localStorage.getItem('cart')) || []; // Hent handlekurv fra Local Storage, eller opprett en tom handlekurv hvis den ikke finnes
      cart.push(product); // Legg til produkt i handlekurv
      localStorage.setItem('cart', JSON.stringify(cart)); // Lagre handlekurv til Local Storage
      alert('Produktet ble lagt til i handlekurven.');
    }


    // "legg til handlekurv" -knapp
    const addButton = document.createElement('button');
    addButton.classList.add('button-2');
    addButton.textContent = 'Legg til handlekurv';
    addButton.addEventListener('click', () => {
      addToCart(product);
    });
    textDiv.appendChild(addButton);

    productElement.appendChild(textDiv);

    productDetailsContainer.appendChild(productElement);
  }

  fetchProductDetails(productId);
});

// handlekurv side

document.addEventListener('DOMContentLoaded', function () {
  const cartItemsContainer = document.getElementById('cartItems');
  const totalPriceElement = document.getElementById('totalPrice');

  // Hent handlekurv fra Local Storage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Vis handlekurvinnhold
  function displayCartItems() {
      cartItemsContainer.innerHTML = '';
      let total = 0;

      cart.forEach((product, index) => {
          const itemElement = document.createElement('li');
          itemElement.textContent = product.title + ' - $' + product.price;

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Slett';
          deleteButton.addEventListener('click', () => {
              removeFromCart(index);
          });
          itemElement.appendChild(deleteButton);

          cartItemsContainer.appendChild(itemElement);
          total += product.price;
      });

      totalPriceElement.textContent = total.toFixed(2);
  }

  // Fjern produkt fra handlekurv
  function removeFromCart(index) {
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCartItems();
  }

  displayCartItems();

});

// vis ordrebekreftelse ved klikk av "fullfør bestilling"
completeButton = document.getElementById('complete');
completeButton.addEventListener('click', () => {
  window.location.href = 'complete.html';
}); // Merk at parentesen er lagt til her




