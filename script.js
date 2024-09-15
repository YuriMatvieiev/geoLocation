// Get the company locations based on the fetched coordinates
function getCoordinates() {
  return [
    {
      lat: Number(coordinates.latitude) + 0.01,
      lon: Number(coordinates.longitude),
      logoFull: "1-full.webp",
      name: "Guardian Homestead Assurance",
      description:
        "Coverage: Comprehensive, safeguarding against various perils",
      numbers: "Insured 1,500+ homes",
      reviews: "700+ reviews",
      rating: "4.9",
      id: 1,
    },
    {
      lat: Number(coordinates.latitude) - 0.02,
      lon: Number(coordinates.longitude) + 0.005,
      logoFull: "2-full.webp",
      name: "SafeHaven Coverage",
      description:
        "Coverage: Extensive, protecting against accidents, natural disasters, and more",
      numbers: "Insured 900+ homes",
      reviews: "450+ reviews",
      rating: "4.7",
      id: 2,
    },
    {
      lat: Number(coordinates.latitude) - 0.02,
      lon: Number(coordinates.longitude) - 0.02,
      logoFull: "3-full.webp",
      name: "Liberty Home Assurance",
      description: "Coverage: Thorough, with options for customizable packages",
      numbers: "Insured 1,200+ homes",
      reviews: "500+ reviews",
      rating: "4.6",
      id: 3,
    },
    {
      lat: Number(coordinates.latitude),
      lon: Number(coordinates.longitude) + 0.025,
      logoFull: "4-full.webp",
      name: "ShieldSure Home Insurance",
      description:
        "Coverage: Comprehensive, including natural disasters and theft",
      numbers: "Insured 1,000+ homes",
      reviews: "500+ reviews",
      rating: "4.8",
      id: 4,
    },
    {
      lat: Number(coordinates.latitude),
      lon: Number(coordinates.longitude) - 0.028,
      logoFull: "5-full.webp",
      name: "HomeGuard Insurance",
      description:
        "Coverage: Comprehensive, including natural disasters and theft",
      numbers: "Insured 1,000+ homes",
      reviews: "500+ reviews",
      rating: "4.9",
      id: 5,
    },
  ];
}

const infoPopup = document.querySelector("#generalPopup"),
  firstPopup = document.querySelector("#firstPopup"),
  pathToImages = "./img/", // Path to image assets
  coordinates = { latitude: 1, longitude: 1 }, // Default coordinates in case the geolocation fetch fails
  // Function to fill the popup with the company data
  fillPopup = function (
    companyName,
    description,
    logo,
    numbers,
    reviews,
    rating
  ) {
    let popup = document.querySelector("#generalPopup"),
      nameField = popup.querySelector("#companyName"),
      descField = popup.querySelector("#description"),
      numbersField = popup.querySelector("#companyNumbers"),
      reviewsField = popup.querySelector("#companyReviews"),
      ratingField = popup.querySelector("#companyRating");

    // Assign the values to the appropriate fields
    (nameField.innerHTML = companyName),
      (descField.innerHTML = description),
      (numbersField.innerHTML = numbers),
      (reviewsField.innerHTML = reviews),
      (ratingField.innerHTML = rating);

    let lastStar = document.querySelector(".popup__star:last-of-type");

    // Reset star class and apply correct class based on rating
    (lastStar.classList = ""),
      5 === Number(rating)
        ? lastStar.classList.add("popup__star")
        : Number(rating) > 4.6
        ? lastStar.classList.add("popup__star", "popup__star-nofull")
        : lastStar.classList.add("popup__star", "popup__star-half");
  },
  // Function to close the popup and reset view to the first popup
  closePopup = () => {
    infoPopup.classList.add("hide"), // Hide current popup
      firstPopup.classList.remove("hide"), // Show the first popup
      infoPopup.classList.remove("animate"),
      infoPopup.classList.remove("animated");
  };

// Fetch geolocation data from ipapi.co API
async function getGeolocation() {
  try {
    let response = await fetch("https://ipapi.co/json/"),
      data = await response.json();
    // Update coordinates with the received data
    coordinates.latitude = data.latitude.toFixed(3);
    coordinates.longitude = data.longitude.toFixed(3);
  } catch (error) {
    console.log(error);
  }
}

// Initialize the map and add markers
const setMap = async function (locations) {
    let map = await L.map("map", {
      attributionControl: false,
      zoomControl: false,
      closePopupOnClick: 0,
    }).setView([coordinates.latitude, coordinates.longitude], 14); // Set initial map view to fetched coordinates

    // Add OpenStreetMap tiles to the map
    await L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 16,
      zoomControl: false,
      attributionControl: false,
    }).addTo(map),
      // Add markers to the map
      locations.forEach((location) => {
        if (location.lat && location.lon) {
          L.popup()
            .setLatLng([location.lat, location.lon]) // Set marker's coordinates
            .setContent(
              `<div class="marker" data-index=${location.id}>
                 <div class="marker__image-wrapper">
                   <img src="${pathToImages}${location.logoFull}" class="marker__image" />
                 </div>
              </div>`
            )
            .addTo(map)
            ._container.addEventListener("click", (event) => {
              let target = event.target.closest(".marker"),
                selectedLocation = locations.find(
                  (loc) => loc.id === Number(target.dataset.index)
                );

              fadeModal(); // Animate the popup
              setTimeout(() => {
                fillPopup(
                  selectedLocation.name,
                  selectedLocation.description,
                  selectedLocation.logo,
                  selectedLocation.numbers,
                  selectedLocation.reviews,
                  selectedLocation.rating
                );
              }, 150);
              infoPopup.classList.remove("hide"); // Show the detailed popup
              firstPopup.classList.add("hide"); // Hide the initial popup
            });
        }
      });
  },
  // Main page initialization
  InitPage = async function () {
    await getGeolocation(); // Fetch user geolocation first
    const locations = getCoordinates(); // Get company data based on the fetched coordinates
    await setMap(locations); // Set the map with markers for each company
  };

// Animate the modal
function fadeModal() {
  let popup = document.querySelector("#generalPopup");
  popup.classList.add("animate"),
    setTimeout(() => {
      popup.classList.remove("animate");
    }, 300);
}

InitPage(); // Start the page initialization process
