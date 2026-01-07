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

/*=========================================================================================================================*/

/*============================================Donation Page View Toggle===================================================*/

/*=========================================================================================================================*/

// Donation Page View Toggle
function show(view) {
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  document.getElementById(view).classList.add("active");
}
