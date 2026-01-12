/* =========================================================== */
/* NAVIGATION BAR ACTIVE LINK HIGHLIGHTING */
/* =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".navbar a");
  const currentPagePath = window.location.pathname.split("/").pop();

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");

    if (
      linkPath === currentPagePath ||
      (currentPagePath === "" && linkPath === "index.html")
    ) {
      link.classList.add("active");
    }
  });
  /* Mobile menu toggle (SAFE) */
  const menuToggle = document.querySelector(".menu-toggle");
  const navbar = document.querySelector(".navbar");

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  }
});

/* =========================================================== */
/* RECIPE SEARCH FUNCTIONALITY */
/* =========================================================== */

const modal = document.getElementById("recipeModal");
const modalTitle = document.getElementById("modalTitle");
const modalImg = document.getElementById("modalImg");
const modalIngredients = document.getElementById("modalIngredients");
const modalSteps = document.getElementById("modalSteps");
const closeBtn = document.querySelector(".close");

// Ensure modal is hidden on page load
if (window.location.pathname.split("/").pop() === "recipe.html") {
  modal.style.display = "none";
  document.querySelectorAll(".recipe-card").forEach((card) => {
    card.addEventListener("click", () => {
      modalTitle.textContent = card.dataset.title;
      modalImg.src = card.dataset.img;
      modalImg.alt = card.dataset.title;

      // Ingredients
      modalIngredients.innerHTML = "";
      card.dataset.ingredients.split(",").forEach((ing) => {
        const li = document.createElement("li");
        li.textContent = ing.trim();
        modalIngredients.appendChild(li);
      });

      // Steps
      modalSteps.innerHTML = "";
      card.dataset.steps.split(".,").forEach((step) => {
        const trimmed = step.trim();
        if (trimmed) {
          const li = document.createElement("li");
          li.textContent = trimmed.replace(/\.$/, "");
          modalSteps.appendChild(li);
        }
      });

      modal.style.display = "flex";
    });
  });

  closeBtn.onclick = () => (modal.style.display = "none");
  window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
  };
}

function searchRecipe() {
  const input = document.getElementById("ingredientSearch").value.toLowerCase();
  const recipes = document.querySelectorAll(".recipe-card");
  const grid = document.querySelector(".recipe-grid");

  let visibleCount = 0;

  recipes.forEach((recipe) => {
    const title = recipe.getAttribute("data-title").toLowerCase();
    const ingredients = recipe.getAttribute("data-ingredients").toLowerCase();
    const steps = recipe.getAttribute("data-steps").toLowerCase();

    // Check if the input matches any part of title, ingredients, or steps
    if (
      title.includes(input) ||
      ingredients.includes(input) ||
      steps.includes(input)
    ) {
      recipe.classList.remove("hidden");
      visibleCount++;
    } else {
      recipe.classList.add("hidden");
    }
  });

  // If only one recipe is visible, center it and limit its width
  if (visibleCount === 1) {
    grid.classList.add("single-recipe");
  } else {
    grid.classList.remove("single-recipe");
  }
}

/* =========================================================== */
/* DONATION PAGE - VIEW TOGGLE */
/* =========================================================== */

function show(view) {
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  document.getElementById(view).classList.add("active");
}

/* =========================================================== */
/* DONATION PAGE - FOOD ITEMS MANAGEMENT */
/* =========================================================== */

let foodItems = [];
let editIndex = -1;

function addItem() {
  const name = document.getElementById("foodName").value.trim();
  const qty = document.getElementById("foodQty").value.trim();

  // Validation
  if (name === "" || qty === "") {
    alert("Food name and quantity are required.");
    return;
  }

  // Check for duplicates
  const duplicate = foodItems.some(
    (item, index) =>
      item.name.toLowerCase() === name.toLowerCase() && index !== editIndex
  );

  if (duplicate) {
    alert("This food item already exists.");
    return;
  }

  // Add or edit
  if (editIndex === -1) {
    foodItems.push({ name, qty });
  } else {
    foodItems[editIndex] = { name, qty };
    editIndex = -1;
  }

  // Clear inputs
  document.getElementById("foodName").value = "";
  document.getElementById("foodQty").value = "";

  renderItems();
}

function removeItem(index) {
  foodItems.splice(index, 1);
  renderItems();
}

function renderItems() {
  const list = document.getElementById("itemList");
  if (!list) return;

  list.innerHTML = "";

  foodItems.forEach((item, index) => {
    const li = document.createElement("li");

    // EDIT MODE
    if (editIndex === index) {
      li.innerHTML = `
        <input type="text" id="editName" value="${item.name}">
        <input type="text" id="editQty" value="${item.qty}">
        <button class="btn-save" onclick="saveEdit(${index})">Save</button>
        <button class="btn-cancel" onclick="cancelEdit()">Cancel</button>
      `;
    }
    // NORMAL MODE
    else {
      li.innerHTML = `
        <span>${item.name} - ${item.qty}</span>
        <div>
          <button class="btn-edit" onclick="editItem(${index})">Edit</button>
          <button class="btn-delete" onclick="removeItem(${index})">Remove</button>
        </div>
      `;
    }

    list.appendChild(li);
  });
}

function editItem(index) {
  editIndex = index;
  renderItems();
}

function saveEdit(index) {
  const newName = document.getElementById("editName").value;
  const newQty = document.getElementById("editQty").value;

  if (!newName || !newQty) {
    alert("Fields cannot be empty");
    return;
  }

  foodItems[index].name = newName;
  foodItems[index].qty = newQty;

  editIndex = -1;
  renderItems();
}

function cancelEdit() {
  editIndex = -1;
  renderItems();
}

function confirmFoodDonation() {
  if (foodItems.length === 0) {
    alert("Please add at least one food item");
    return;
  }

  const address1 = document.getElementById("address1");
  const address2 = document.getElementById("address2");
  const city = document.getElementById("city");
  const state = document.getElementById("state");
  const postcode = document.getElementById("postcode");
  const donationPlace = document.getElementById("donationPlace");

  if (!address1 || !city || !state || !postcode || !donationPlace) {
    alert("Please fill in all required fields");
    return;
  }

  const donation = {
    items: foodItems,
    address: {
      address1: address1.value,
      address2: address2.value,
      city: city.value,
      state: state.value,
      postcode: postcode.value,
    },
    place: donationPlace.value,
    date: new Date().toLocaleDateString(),
  };

  let donations = JSON.parse(localStorage.getItem("foodDonations") || "[]");
  donations.push(donation);
  localStorage.setItem("foodDonations", JSON.stringify(donations));

  // Clear form
  foodItems = [];
  renderItems();
  address1.value = "";
  address2.value = "";
  city.value = "";
  state.value = "";
  postcode.value = "";

  show("success");
}

/* =========================================================== */
/* MONEY DONATION VALIDATION */
/* =========================================================== */

function validateMoneyDonation() {
  // Get active payment form
  const onlineBankingForm = document.getElementById("online-banking");
  const cardForm = document.getElementById("card");

  const isOnlineBanking = onlineBankingForm.classList.contains("active");
  const isCard = cardForm.classList.contains("active");

  if (isOnlineBanking) {
    return validateOnlineBanking();
  } else if (isCard) {
    return validateCard();
  }

  alert("Please select a payment method");
  return false;
}

function validateOnlineBanking() {
  const amount = document.getElementById("bankAmount").value.trim();
  const bank = document.getElementById("bankSelect").value;
  const account = document.getElementById("bankAccount").value.trim();
  const pin = document.getElementById("bankPin").value.trim();

  // Validate amount
  if (!amount || amount === "") {
    alert("Please enter a donation amount");
    document.getElementById("bankAmount").focus();
    return false;
  }

  if (parseFloat(amount) <= 0) {
    alert("Donation amount must be greater than RM 0");
    document.getElementById("bankAmount").focus();
    return false;
  }

  if (parseFloat(amount) < 1) {
    alert("Minimum donation amount is RM 1");
    document.getElementById("bankAmount").focus();
    return false;
  }

  // Validate bank selection
  if (!bank || bank === "") {
    alert("Please select your bank");
    document.getElementById("bankSelect").focus();
    return false;
  }

  // Validate account number
  if (!account || account === "") {
    alert("Please enter your account number");
    document.getElementById("bankAccount").focus();
    return false;
  }

  if (account.length < 8) {
    alert("Account number must be at least 8 digits");
    document.getElementById("bankAccount").focus();
    return false;
  }

  // Validate PIN
  if (!pin || pin === "") {
    alert("Please enter your 6-digit PIN");
    document.getElementById("bankPin").focus();
    return false;
  }

  if (pin.length !== 6) {
    alert("PIN must be exactly 6 digits");
    document.getElementById("bankPin").focus();
    return false;
  }

  if (!/^\d+$/.test(pin)) {
    alert("PIN must contain only numbers");
    document.getElementById("bankPin").focus();
    return false;
  }

  // Save donation record
  saveMoneyDonation("Online Banking", amount, bank);
  return true;
}

function validateCard() {
  const amount = document.getElementById("cardAmount").value.trim();
  const cardNumber = document.getElementById("cardNumber").value.trim();
  const cardName = document.getElementById("cardName").value.trim();
  const expiry = document.getElementById("cardExpiry").value.trim();
  const cvv = document.getElementById("cardCvv").value.trim();

  // Validate amount
  if (!amount || amount === "") {
    alert("Please enter a donation amount");
    document.getElementById("cardAmount").focus();
    return false;
  }

  if (parseFloat(amount) <= 0) {
    alert("Donation amount must be greater than RM 0");
    document.getElementById("cardAmount").focus();
    return false;
  }

  if (parseFloat(amount) < 1) {
    alert("Minimum donation amount is RM 1");
    document.getElementById("cardAmount").focus();
    return false;
  }

  // Validate card number
  if (!cardNumber || cardNumber === "") {
    alert("Please enter your card number");
    document.getElementById("cardNumber").focus();
    return false;
  }

  const cleanCardNumber = cardNumber.replace(/\s/g, "");
  if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
    alert("Card number must be between 13 and 19 digits");
    document.getElementById("cardNumber").focus();
    return false;
  }

  if (!/^\d+$/.test(cleanCardNumber)) {
    alert("Card number must contain only numbers");
    document.getElementById("cardNumber").focus();
    return false;
  }

  // Validate cardholder name
  if (!cardName || cardName === "") {
    alert("Please enter the cardholder name");
    document.getElementById("cardName").focus();
    return false;
  }

  if (cardName.length < 3) {
    alert("Cardholder name is too short");
    document.getElementById("cardName").focus();
    return false;
  }

  // Validate expiry date
  if (!expiry || expiry === "") {
    alert("Please enter the card expiry date");
    document.getElementById("cardExpiry").focus();
    return false;
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    alert("Expiry date must be in MM/YY format");
    document.getElementById("cardExpiry").focus();
    return false;
  }

  const [month, year] = expiry.split("/");
  if (parseInt(month) < 1 || parseInt(month) > 12) {
    alert("Invalid month. Please enter a month between 01 and 12");
    document.getElementById("cardExpiry").focus();
    return false;
  }

  // Check if card is expired
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  if (
    parseInt(year) < currentYear ||
    (parseInt(year) === currentYear && parseInt(month) < currentMonth)
  ) {
    alert("Card has expired");
    document.getElementById("cardExpiry").focus();
    return false;
  }

  // Validate CVV
  if (!cvv || cvv === "") {
    alert("Please enter the CVV");
    document.getElementById("cardCvv").focus();
    return false;
  }

  if (cvv.length !== 3 && cvv.length !== 4) {
    alert("CVV must be 3 or 4 digits");
    document.getElementById("cardCvv").focus();
    return false;
  }

  if (!/^\d+$/.test(cvv)) {
    alert("CVV must contain only numbers");
    document.getElementById("cardCvv").focus();
    return false;
  }

  // Save donation record
  saveMoneyDonation(
    "Credit/Debit Card",
    amount,
    "Card ending in " + cleanCardNumber.slice(-4)
  );
  return true;
}

function saveMoneyDonation(method, amount, details) {
  const donation = {
    method: method,
    amount: parseFloat(amount),
    details: details,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  };

  let moneyDonations = JSON.parse(
    localStorage.getItem("moneyDonations") || "[]"
  );
  moneyDonations.push(donation);
  localStorage.setItem("moneyDonations", JSON.stringify(moneyDonations));
}

function confirmMoneyDonation() {
  if (validateMoneyDonation()) {
    // Clear form fields
    clearMoneyDonationForms();
    show("success");
  }
}

function clearMoneyDonationForms() {
  // Clear online banking form
  document.getElementById("bankAmount").value = "";
  document.getElementById("bankSelect").value = "";
  document.getElementById("bankAccount").value = "";
  document.getElementById("bankPin").value = "";

  // Clear card form
  document.getElementById("cardAmount").value = "";
  document.getElementById("cardNumber").value = "";
  document.getElementById("cardName").value = "";
  document.getElementById("cardExpiry").value = "";
  document.getElementById("cardCvv").value = "";
}

/* =========================================================== */
/* DONATION PLACES MANAGEMENT */
/* =========================================================== */

let donationPlaces = JSON.parse(
  localStorage.getItem("donationPlaces") ||
    '["Community Center A","Shelter B","Food Bank C"]'
);

function populateDonationPlaces() {
  const select = document.getElementById("donationPlace");
  if (select) {
    select.innerHTML = donationPlaces
      .map((p) => `<option value="${p}">${p}</option>`)
      .join("");
  }
}

function renderDonationPlaces() {
  const table = document.getElementById("donationPlaceTable");
  if (!table) return;

  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";

  donationPlaces.forEach((place, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${place}</td>
      <td>
        <button class="btn-edit" onclick="editDonationPlace(${index})">Edit</button>
        <button class="btn-delete" onclick="removeDonationPlace(${index})">Remove</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Update dropdown
  populateDonationPlaces();
}

function addDonationPlace() {
  const input = document.getElementById("newPlaceName");
  if (!input) return;

  const place = input.value.trim();
  if (!place) {
    alert("Please enter a place name");
    return;
  }

  donationPlaces.push(place);
  localStorage.setItem("donationPlaces", JSON.stringify(donationPlaces));
  input.value = "";
  renderDonationPlaces();
}

function editDonationPlace(index) {
  const newPlace = prompt(
    "Enter new donation place name:",
    donationPlaces[index]
  );
  if (newPlace && newPlace.trim() !== "") {
    donationPlaces[index] = newPlace.trim();
    localStorage.setItem("donationPlaces", JSON.stringify(donationPlaces));
    renderDonationPlaces();
  }
}

function removeDonationPlace(index) {
  if (confirm("Are you sure you want to remove this place?")) {
    donationPlaces.splice(index, 1);
    localStorage.setItem("donationPlaces", JSON.stringify(donationPlaces));
    renderDonationPlaces();
  }
}

function showPaymentMethod(method) {
  // Remove active class from all buttons and forms
  document
    .querySelectorAll(".payment-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".payment-form")
    .forEach((form) => form.classList.remove("active"));

  // Add active class to selected button and form
  event.target.closest(".payment-btn").classList.add("active");
  document.getElementById(method).classList.add("active");
}

/* =========================================================== */
/* ADMIN LOGIN */
/* =========================================================== */

// Show login on keyboard shortcut (Ctrl+Shift+A)
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.shiftKey && event.code === "KeyA") {
    window.location.href = "adminLogin.html";

    event.preventDefault();
  }
});

const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

function adminLogin() {
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password");
    return;
  }

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    localStorage.setItem("isAdminLoggedIn", "true");
    alert("Login successful!");
    window.location.href = "adminDashboard.html";
  } else {
    alert("Invalid username or password");
  }
}

function adminLogout() {
  localStorage.removeItem("isAdminLoggedIn");
  alert("You have been logged out");
  window.location.href = "index.html";
}

/* =========================================================== */
/* ADMIN DASHBOARD */
/* =========================================================== */

// Hello Admin message
if (window.location.pathname.includes("adminDashboard.html")) {
  const adminGreeting = document.getElementById("adminGreeting");
  if (adminGreeting) {
    adminGreeting.innerText = `Hello, ${ADMIN_USER}!`;
  } 
}

// Check admin session on dashboard page
if (window.location.pathname.includes("adminDashboard.html")) {
  if (localStorage.getItem("isAdminLoggedIn") !== "true") {
    alert("You must log in as admin to access this page.");
    window.location.href = "index.html";
  }
}


// Load and render admin data
window.addEventListener("load", () => {
  // Initialize donation places for donate page
  populateDonationPlaces();
  renderDonationPlaces();

  // Only run admin dashboard code on admin dashboard page
  if (!window.location.pathname.includes("adminDashboard.html")) return;

  let donations = JSON.parse(localStorage.getItem("foodDonations") || "[]");
  let moneyDonations = JSON.parse(
    localStorage.getItem("moneyDonations") || "[]"
  );
  let pledges = JSON.parse(localStorage.getItem("pledges") || "[]");

  // Calculate total money donated
  let totalMoney = moneyDonations.reduce((sum, d) => sum + d.amount, 0);

  // Update counts
  const pledgeCount = document.getElementById("pledgeCount");
  const donationCount = document.getElementById("donationCount");
  const moneyDonationCount = document.getElementById("moneyDonationCount");
  const totalMoneyAmount = document.getElementById("totalMoneyAmount");

  if (pledgeCount) pledgeCount.innerText = pledges.length;
  if (donationCount) donationCount.innerText = donations.length;
  if (moneyDonationCount) moneyDonationCount.innerText = moneyDonations.length;
  if (totalMoneyAmount)
    totalMoneyAmount.innerText = `RM ${totalMoney.toFixed(2)}`;

  // Render tables
  renderDonations();
  renderMoneyDonations();
  renderPledges();
});

function renderDonations() {
  const table = document.getElementById("donationTable");
  if (!table) return;

  const tbody = table.querySelector("tbody");
  const donations = JSON.parse(localStorage.getItem("foodDonations") || "[]");

  tbody.innerHTML = "";

  if (donations.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #999;">No food donations yet</td>
      </tr>
    `;
    return;
  }

  donations.forEach((d, index) => {
    const itemsList = d.items.map((i) => `${i.name} (${i.qty})`).join(", ");
    const address = `${d.address.address1}, ${d.address.city}, ${d.address.state} ${d.address.postcode}`;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${itemsList}</td>
      <td>${address}</td>
      <td>
        <span id="place-${index}">${d.place}</span>
        <button class="btn-edit" onclick="editPlace(${index})">Edit</button>
      </td>
      <td>${d.date}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderMoneyDonations() {
  const table = document.getElementById("moneyDonationTable");
  if (!table) return;

  const tbody = table.querySelector("tbody");
  const moneyDonations = JSON.parse(
    localStorage.getItem("moneyDonations") || "[]"
  );

  tbody.innerHTML = "";

  if (moneyDonations.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #999;">No money donations yet</td>
      </tr>
    `;
    return;
  }

  moneyDonations.forEach((d, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${d.method}</td>
      <td>RM ${d.amount.toFixed(2)}</td>
      <td>${d.details}</td>
      <td>${d.date} ${d.time}</td>
    `;
    tbody.appendChild(row);
  });
}

function editPlace(index) {
  let donations = JSON.parse(localStorage.getItem("foodDonations") || "[]");
  const current = donations[index].place;
  const newPlace = prompt("Enter new donation location:", current);

  if (newPlace && newPlace.trim() !== "") {
    donations[index].place = newPlace;
    localStorage.setItem("foodDonations", JSON.stringify(donations));

    if (!donationPlaces.includes(newPlace)) {
      donationPlaces.push(newPlace);
      localStorage.setItem("donationPlaces", JSON.stringify(donationPlaces));
    }

    renderDonations();
    renderDonationPlaces();
  }
}

function renderPledges() {
  const table = document.getElementById("pledgeTable");
  if (!table) return;

  const tbody = table.querySelector("tbody");
  const pledges = JSON.parse(localStorage.getItem("pledges") || "[]");

  tbody.innerHTML = "";

  if (pledges.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: #999;">No pledges yet</td>
      </tr>
    `;
    return;
  }

  pledges.forEach((p, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${p.name}</td>
      <td>${p.email}</td>
      <td>${p.pledge}</td>
      <td>${p.story || ""}</td>
      <td>${p.feedback || ""}</td>
    `;
    tbody.appendChild(row);
  });
}

function goHome() {
  window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem("isAdminLoggedIn");
  alert("You have been logged out.");
  window.location.href = "index.html";
}
/* =========================================================== */
/* GET INVOLVED - FORM VALIDATION & SUBMISSION */
/* =========================================================== */

function validateForm(event) {
  event.preventDefault();

  const pledge = document.getElementById("pledgeSelect").value;
  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("email").value.trim();
  const story = document.getElementById("userStory").value.trim();
  const feedback = document.getElementById("userFeedback").value.trim();

  if (!pledge || !name || !email || !story || !feedback) {
    alert("Please fill in all required fields");
    return false;
  }

  // Save to localStorage
  const pledgeData = {
    pledge: pledge,
    name: name,
    email: email,
    story: story,
    feedback: feedback,
    date: new Date().toLocaleDateString(),
  };

  let pledges = JSON.parse(localStorage.getItem("pledges") || "[]");
  pledges.push(pledgeData);
  localStorage.setItem("pledges", JSON.stringify(pledges));

  // Show success message
  alert("Thank you for your pledge! Your commitment has been saved.");

  // Clear form
  document.getElementById("pledgeForm").reset();

  return false;
}
