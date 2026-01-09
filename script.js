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

// Initialize on page load
window.addEventListener("load", () => {
  populateDonationPlaces();
  renderDonationPlaces();
});

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

// Check admin session on dashboard page
if (window.location.pathname.includes("adminDashboard.html")) {
  if (localStorage.getItem("isAdminLoggedIn") !== "true") {
    alert("You must log in as admin to access this page.");
    window.location.href = "index.html";
  }
}

// Load and render admin data
window.addEventListener("load", () => {
  // Only run on admin dashboard
  if (!window.location.pathname.includes("adminDashboard.html")) return;

  let donations = JSON.parse(localStorage.getItem("foodDonations") || "[]");
  let pledges = JSON.parse(localStorage.getItem("pledges") || "[]");

  // Update counts
  const pledgeCount = document.getElementById("pledgeCount");
  const donationCount = document.getElementById("donationCount");

  if (pledgeCount) pledgeCount.innerText = pledges.length;
  if (donationCount) donationCount.innerText = donations.length;

  // Render tables
  renderDonations();
  renderPledges();
});

function renderDonations() {
  const table = document.getElementById("donationTable");
  if (!table) return;

  const tbody = table.querySelector("tbody");
  const donations = JSON.parse(localStorage.getItem("foodDonations") || "[]");

  tbody.innerHTML = "";
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
