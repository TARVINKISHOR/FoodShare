/*=========================================================================================================================*/

/*========================================Navigation Bar Active Link Highlighting===========================================*/

/*=========================================================================================================================*/

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
});

/*=========================================================================================================================*/

/*===========================================Recipe Search Functionality==================================================*/

/*=========================================================================================================================*/

function searchRecipe() {
  const input = document.getElementById("ingredientSearch").value.toLowerCase();

  const recipes = document.querySelectorAll(".recipe-card");

  recipes.forEach((recipe) => {
    const ingredients = recipe.getAttribute("data-ingredients");

    if (ingredients.includes(input)) {
      recipe.style.display = "block";
    } else {
      recipe.style.display = "none";
    }
  });
}

// Food donation centers with REAL coordinates for Malaysia
const donationCenters = [
  {
    name: "Food Bank Malaysia - Alor Setar",
    city: "Alor Setar",
    address: "Lot 2967E, Jalan Sultanah, Taman Aman, 05350 Alor Setar, Kedah",
    lat: 6.1248,
    lng: 100.3678,
    hours:
      "Open: Everyday 9:00 am – 5:00 pm<br>Closed: Public Holiday, Thursday & Sunday",
  },
  {
    name: "Food Bank Malaysia - Cyberjaya",
    city: "Cyberjaya",
    address: "Persiaran Rimba Permai, Cyber 10, 63000 Cyberjaya, Selangor",
    lat: 2.9213,
    lng: 101.6559,
    hours: "Via appointment only",
  },
];

/*=========================================================================================================================*/

/*===================================================Map Initialization====================================================*/

/*=========================================================================================================================*/

let map;
let markers = [];

// Initialize Leaflet Map (NO API KEY NEEDED!)
function initMap() {
  // Create map centered on Malaysia
  map = L.map("map").setView([4.2105, 101.9758], 7);

  // Add OpenStreetMap tiles (FREE!)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19,
    updateWhenZooming: false,
    updateWhenIdle: true,
    keepBuffer: 2,
  }).addTo(map);

  // Add markers for each donation center
  donationCenters.forEach((center, index) => {
    // Create custom icon with number
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="
                        background-color: #16a34a;
                        color: white;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        border: 3px solid white;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    ">${index + 1}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    // Create marker
    const marker = L.marker([center.lat, center.lng], {
      icon: customIcon,
    }).addTo(map);

    // Create popup content
    const popupContent = `
                    <div style="min-width: 200px;">
                        <h3>${center.name}</h3>
                        <p><strong>Address:</strong><br>${center.address}</p>
                        <p><strong>Hours:</strong><br>${center.hours}</p>
                    </div>
                `;

    marker.bindPopup(popupContent);

    // When marker is clicked, highlight the section
    marker.on("click", () => {
      highlightSection(index);
    });

    markers.push(marker);
  });

  setTimeout(() => {
    map.invalidateSize();
  }, 100);
}

// Function called when clicking food bank name
function showLocation(index) {
  const center = donationCenters[index];

  // Fly to location with smooth animation
  map.flyTo([center.lat, center.lng], 15, {
    duration: 1.5,
  });

  // Open popup
  markers[index].openPopup();

  // Highlight the section
  highlightSection(index);

  // Bounce effect (simple version)
  const markerElement = markers[index].getElement();
  if (markerElement) {
    markerElement.style.animation = "bounce 0.5s ease";
    setTimeout(() => {
      markerElement.style.animation = "";
    }, 500);
  }
}

function highlightSection(index) {
  // Remove highlight from all sections
  const sections = document.querySelectorAll(".section[data-index]");
  sections.forEach((section) => section.classList.remove("selected"));

  // Add highlight to selected section
  sections[index].classList.add("selected");
}

// Add bounce animation
const style = document.createElement("style");
style.textContent = `
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        `;
document.head.appendChild(style);

// Initialize map when page loads
window.addEventListener("load", initMap);

function searchLocation() {
  const query = document.getElementById("locationInput").value.toLowerCase();

  if (!query) return;

  const matchIndex = donationCenters.findIndex(
    (center) =>
      center.city.toLowerCase().includes(query) ||
      center.name.toLowerCase().includes(query)
  );

  if (matchIndex === -1) {
    alert("No donation center found for this location.");
    return;
  }

  showLocation(matchIndex);
}

document.addEventListener("DOMContentLoaded", populateDonationPlaces);

/*=========================================================================================================================*/

/*============================================Donation Page View Toggle===================================================*/

/*=========================================================================================================================*/

let foodItems = [];
let editIndex = -1;

function show(view) {
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  document.getElementById(view).classList.add("active");
}
function addItem() {
  const name = document.getElementById("foodName").value.trim();
  const qty = document.getElementById("foodQty").value.trim();

  // Empty check
  if (name === "" || qty === "") {
    alert("Food name and quantity are required.");
    return;
  }

  // Quantity must be positive number
  if (isNaN(qty) || qty <= 0) {
    alert("Quantity must be a valid number greater than 0.");
    return;
  }

  // Duplicate food name check
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

function validatePostcode() {
  const postcode = document.getElementById("postcode").value;

  if (postcode.length < 4 || postcode.length > 5) {
    alert("Please enter a valid postcode.");
    return false;
  }
  return true;
}

function removeItem(index) {
  foodItems.splice(index, 1);
  renderItems();
}

function renderItems() {
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  foodItems.forEach((item, index) => {
    const li = document.createElement("li");

    // EDIT MODE
    if (editIndex === index) {
      li.innerHTML = `
                <input type="text" id="editName" value="${item.name}">
                <input type="text" id="editQty" value="${item.qty}">
                <button onclick="saveEdit(${index})">Save</button>
                <button onclick="cancelEdit()">Cancel</button>
            `;
    }
    // NORMAL MODE
    else {
      li.innerHTML = `
                ${item.name} - ${item.qty}
                <button onclick="editItem(${index})">Edit</button>
                <button onclick="removeItem(${index})">Remove</button>
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

  foodItems = [];
  renderItems();
  show("success");
}

// Load donation places from localStorage or default list
let donationPlaces = JSON.parse(
  localStorage.getItem("donationPlaces") ||
    '["Community Center A","Shelter B","Food Bank C"]'
);

function renderDonationPlaces() {
  const tbody = document
    .getElementById("donationPlaceTable")
    .querySelector("tbody");
  tbody.innerHTML = "";
  donationPlaces.forEach((place, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${place}</td>
            <td>
                <button onclick="editDonationPlace(${index})">Edit</button>
                <button onclick="removeDonationPlace(${index})">Remove</button>
            </td>
        `;
    tbody.appendChild(row);
  });

  // Also update the dropdown in donation form
  const select = document.getElementById("donationPlace");
  if (select) {
    select.innerHTML = donationPlaces
      .map((p) => `<option>${p}</option>`)
      .join("");
  }
}

// Add new donation place
function addDonationPlace() {
  const input = document.getElementById("newPlaceName");
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

// Edit existing donation place
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

// Remove donation place
function removeDonationPlace(index) {
  if (confirm("Are you sure you want to remove this place?")) {
    donationPlaces.splice(index, 1);
    localStorage.setItem("donationPlaces", JSON.stringify(donationPlaces));
    renderDonationPlaces();
  }
}

// Initialize table on page load
window.addEventListener("load", renderDonationPlaces);

// Call on page load
populateDonationPlaces();
/*=====================================================================================================================*/

/*===================================================== ADMIN LOGIN =====================================================*/

/*=====================================================================================================================*/

// Show login on shortcut
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.shiftKey && event.code === "KeyA") {
    const adminDiv = document.getElementById("adminLogin");
    if (adminDiv) adminDiv.style.display = "block";
  }
});

// Hide admin login
function hideAdminLogin() {
  const adminDiv = document.getElementById("adminLogin");
  if (adminDiv) adminDiv.style.display = "none";
}

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
    // set session flag
    localStorage.setItem("isAdminLoggedIn", "true");
    alert("Login successful!");
    window.location.href = "adminDashboard.html"; // redirect to dashboard
  } else {
    alert("Invalid username or password");
  }
}

/*=========================================================================================================================*/

/*================================================== Admin Dashboard View ==================================================*/

/*=========================================================================================================================*/

// --- Sample data retrieval from localStorage ---
let donations = JSON.parse(localStorage.getItem("foodDonations") || "[]");
let pledges = JSON.parse(localStorage.getItem("pledges") || "[]");

// Update summary counts
document.getElementById("pledgeCount").innerText = pledges.length;
document.getElementById("donationCount").innerText = donations.length;

// Populate donation table
function renderDonations() {
  const tbody = document.getElementById("donationTable").querySelector("tbody");
  tbody.innerHTML = "";
  donations.forEach((d, index) => {
    const itemsList = d.items.map((i) => `${i.name} (${i.qty})`).join(", ");
    const address = `${d.address.address1}, ${d.address.address2}, ${d.address.city}, ${d.address.state}, ${d.address.postcode}`;
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${itemsList}</td>
            <td>${address}</td>
            <td>
                <span id="place-${index}">${d.place}</span>
                <button onclick="editPlace(${index})">Edit</button>
            </td>
            <td>${d.date}</td>
        `;
    tbody.appendChild(row);
  });
}

// Edit donation place
function editPlace(index) {
  const current = donations[index].place;
  const newPlace = prompt("Enter new donation location:", current);
  if (newPlace && newPlace.trim() !== "") {
    donations[index].place = newPlace;

    // Save donations
    localStorage.setItem("foodDonations", JSON.stringify(donations));

    // Update global donation places list
    if (!donationPlaces.includes(newPlace)) {
      donationPlaces.push(newPlace);
      localStorage.setItem("donationPlaces", JSON.stringify(donationPlaces));
    }

    // Re-render donations table
    renderDonations();
  }
}

// Populate pledge table
function renderPledges() {
  const tbody = document.getElementById("pledgeTable").querySelector("tbody");
  tbody.innerHTML = "";
  pledges.forEach((p, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${p.name}</td>
            <td>${p.email}</td>
            <td>${p.pledge}</td>
            <td>${p.story || p.feedback || ""}</td>
        `;
    tbody.appendChild(row);
  });
}

// Go back to home (replace with your home page redirect if needed)
function goHome() {
  window.location.href = "index.html";
}

// Initial render
renderDonations();
renderPledges();

// Check admin session on page load
if (localStorage.getItem("isAdminLoggedIn") !== "true") {
  alert("You must log in as admin to access this page.");
  window.location.href = "index.html"; // redirect home
}
