const pTitle = document.getElementById("Product-Title");
const pPrice = document.getElementById("Product-Price");
const pCategory = document.getElementById("Product-Category");
const pDescription = document.getElementById("Product-Description");
const pImage = document.getElementById("Product-Image");
const tbody = document.getElementById("tbody");
const searchField = document.getElementById("Product-Search");
const productsContainer = document.getElementById("show-products-list");
const addButton = document.getElementById("add-Button");
const updateButton = document.getElementById("update-Button");
var products;
var validProductName = false;
var validProductPrice = false;
var validProductDesc = false;
var validProductCategory = false;
var currentProductIndextoEdit = 0;

if (localStorage.getItem("plist")) {
  products = JSON.parse(localStorage.getItem("plist"));
  displayProducts(products);
} else {
  products = [];
}

function showToast(message, hasError = false, duration = 3000) {
  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.classList.toggle("toast-msg-error", hasError);

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

function addProduct() {
  if (pImage.files.length == 0) {
    showToast("No image selected", true);
    return false;
  }

  var product = {
    name: pTitle.value,
    price: pPrice.value,
    category: pCategory.value,
    description: pDescription.value,
    image: pImage.files[0].name,
  };

  if (
    !validProductName &&
    !validProductPrice &&
    !validProductDesc &&
    !validProductCategory
  ) {
    return false;
  }

  if (!ValidateEmptyInputs(pTitle, pPrice, pCategory, pDescription)) {
    return false;
  }

  ClearForm(pTitle, pPrice, pCategory, pDescription, pImage);

  products.push(product);
  displayProducts(products);
  saveToLocalStorage(products);
  showToast("Product added successfully!");
}

function ClearForm(...inputs) {
  for (var input of inputs) {
    input.value = "";
  }
}

function displayProducts(products) {
  var box = "";

  if (products.length > 0) {
    for (var i = 0; i < products.length; i++) {
      box += ` <tr id="row-${i}">
                <td>
                
                ${i + 1}
               
                </td>
                <td>
                
                  <img
                    class="object-fit-cover"
                    src="./images/${products[i].image}"
                    alt=""
                  />
                 
                </td>
                <td>${products[i].name}</td>
                <td>${products[i].price} $ </td>
                <td>${products[i].category}</td>
                <td>${products[i].description}</td>
                <td> 
                
                  <button class="btn p-0" onclick="deleteProduct(${i})">
                    <i class="fa-solid fa-trash text-red-500"></i>
                  </button>
                     <button class="btn p-0" onclick="setUpdateForm(${i})">
                    <i class="fa-solid fa-pencil text-yellow-600"></i>
                  </button>
                
                </td>
              </tr>`;
    }
  } else {
    box = ` <tr>
                <td colspan="7" id="empty-row" class="text-center py-4">
                  No products available
                </td>
              </tr>`;
  }

  tbody.innerHTML = box;
}
function showProducts() {
  productsContainer.style.visibility = "visible";
  productsContainer.style.opacity = 1;
}

function hideProducts() {
  productsContainer.style.opacity = 0;

  productsContainer.addEventListener(
    "transitionend",
    () => {
      productsContainer.style.visibility = "hidden";
    },
    { once: true }
  );
}

function deleteProduct(index) {
  products.splice(index, 1);
  saveToLocalStorage(products);
  displayProducts(products);

  showToast("Product deleted successfully!");
}

function setUpdateForm(index) {
  hideProducts();
  pTitle.value = products[index].name;
  pPrice.value = products[index].price;
  pCategory.value = products[index].category;
  pDescription.value = products[index].description;
  updateButton.classList.replace("d-none", "d-block");
  addButton.classList.add("d-none");
  currentProductIndextoEdit = index;
}

function updateProduct() {
  products[currentProductIndextoEdit].name = pTitle.value;
  products[currentProductIndextoEdit].price = pPrice.value;
  products[currentProductIndextoEdit].category = pCategory.value;
  products[currentProductIndextoEdit].description = pDescription.value;
  if (pImage.files.length > 0) {
    products[currentProductIndextoEdit].image = pImage.files[0].name;
  }

  updateButton.classList.replace("d-block", "d-none");
  addButton.classList.remove("d-none");

  saveToLocalStorage(products);
  displayProducts(products);
  ClearForm(pTitle, pPrice, pCategory, pDescription, pImage);
  showToast("Product updated successfully!");
}

function seed() {
  const sampleProducts = [
    {
      name: "Luminous Liquid Foundation",
      price: 29.99,
      category: "Foundation",
      description:
        "Lightweight liquid foundation that provides buildable coverage with a natural, radiant finish. Suitable for all skin types.",
      image: "1.jpg",
    },
    {
      name: "Velvet Matte Lipstick",
      price: 19.5,
      category: "Lipstick",
      description:
        "Long-lasting matte lipstick in rich, bold colors. Smooth application with a velvety finish.",
      image: "2.png",
    },
    {
      name: "Radiance Highlighter Palette",
      price: 34.0,
      category: "Highlighter",
      description:
        "Multi-shade highlighter palette for face and body. Blends easily for a glowing finish.",
      image: "3.jpg",
    },
    {
      name: "Revitalizing Face Serum",
      price: 42.75,
      category: "Serum",
      description:
        "Anti-aging serum with hyaluronic acid and vitamin C. Hydrates, brightens, and smooths skin.",
      image: "4.jpg",
    },
    {
      name: "Smoky Eyeshadow Palette",
      price: 28.0,
      category: "Eyeshadow",
      description:
        "12-color eyeshadow palette with matte and shimmer finishes. Perfect for day-to-night looks.",
      image: "5.jpg",
    },
  ];

  sampleProducts.forEach((product) => {
    products.push(product);
  });

  displayProducts(products);
}

function saveToLocalStorage(plist) {
  localStorage.setItem("plist", JSON.stringify(plist));
}

function searchFilter(value) {
  var filteredProducts = [];
  for (let i = 0; i < products.length; i++) {
    if (products[i].name.toLowerCase().includes(value.toLowerCase())) {
      filteredProducts.push(products[i]);
    }
  }
  displayProducts(filteredProducts);
}

searchField.addEventListener("input", function (event) {
  searchFilter(event.target.value);
});

seed();

function ValidateEmptyInputs(...inputs) {
  for (var input of inputs) {
    var validationText =
      input.parentElement.getElementsByClassName("validation-output");

    var nameValue = validationText[0].getAttribute("id");
    nameValue = nameValue.split("-");

    if (input.value === "") {
      validationText[0].innerHTML = `Product ${nameValue[1]} is Required`;
      validationText[0].classList.replace("d-none", "d-block");
      return false;
    } else {
      validationText[0].classList.replace("d-block", "d-none");
      return true;
    }
  }
}

function ValidateProductInput(input, index) {
  var regex;
  var msg;
  switch (index) {
    //Product Name
    case 0: {
      var regex = /^[A-Za-z ]{3,}$/;
      var msg = `Required 4 chars at least first char is Uppercase`;
      ValidateRegex(input, regex, msg)
        ? (validProductName = true)
        : (validProductName = false);
      break;
    }
    //Product Price
    case 1: {
      var regex = /^[1-9][0-9]*/;
      var msg = `Required only positive numbers but not zero`;
      ValidateRegex(input, regex, msg)
        ? (validProductPrice = true)
        : (validProductPrice = false);
      break;
    }
    //Product Category
    case 2: {
      var regex = /^[a-zA-Z0-9]{3,16}$/;
      var msg = `Required category between 3 and 16 letters`;
      ValidateRegex(input, regex, msg)
        ? (validProductCategory = true)
        : (validProductCategory = false);
      break;
    }
    //Product Description
    case 3: {
      var regex = /^[a-zA-Z0-9]{3,100}$/;
      var msg = `Required description between 3 and 100 letters`;
      ValidateRegex(input, regex, msg)
        ? (validProductDesc = true)
        : (validProductDesc = false);
      break;
    }
  }
}

function ValidateRegex(productInput, regex, msg) {
  var validationText =
    productInput.parentElement.getElementsByClassName("validation-output");
  validationText[0].innerHTML = msg;

  if (regex.test(productInput.value)) {
    validationText[0].classList.replace("d-block", "d-none");
    productInput.classList.add("is-valid");
    productInput.classList.remove("is-invalid");
    return true;
  } else {
    validationText[0].classList.replace("d-none", "d-block");
    productInput.classList.add("is-invalid");
    productInput.classList.remove("is-valid");
    return false;
  }
}
