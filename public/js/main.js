// Initialize map
var map = L.map("map").setView([20, 0], 2); // Default global view
const PORT = 8000;

// Add OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

let landmarks = [];
const markers = [];

const list = document.getElementById("landmarkList");

// Add landmark on map click
map.on("click", function (e) {
    var lat = e.latlng.lat.toFixed(6);
    var lng = e.latlng.lng.toFixed(6);

    // Create marker
    var marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`Lat: ${lat}, Lng: ${lng}`)
        .openPopup()
        // when clicked, remove marker and remove landmark from list
        .addEventListener("click", () => {
            marker.remove();
            removeLandmark(lat, lng);
            updateLandmarkList();
        });

    markers.push(marker);

    // Store landmark data
    landmarks.push({ latitude: lat, longitude: lng });
    updateLandmarkList();
});

function removeLandmark(lat, lng) {
    for (let i = 0; i < landmarks.length; i++) {
        const landmark = landmarks[i];
        if (landmark.latitude === lat && landmark.longitude === lng) {
            landmarks.splice(i, 1);
        }
    }
}

// Update landmark list in UI
function updateLandmarkList() {
    list.innerHTML = "";
    landmarks.forEach((point, index) => {
        let li = document.createElement("li");
        li.textContent = `Landmark ${index + 1}: Lat ${point.latitude}, Lng ${
            point.longitude
        }`;
        list.appendChild(li);
    });
}

const container = document.getElementById("container");
const add_notes_pane = document.getElementById("add_notes_pane");
const show_landmarks_pane = document.getElementById("show-landmarks-pane");

function showAddNotes() {
    const form = document.createElement("form");

    for (let landmark of landmarks) {
        const row = document.createElement("span");
        row.classList = "row";
    }
}

function showVisitedLandmarks() {
    fetch(`http://localhost:${PORT}/api/visited`)
        .then((response) => {
            return response.json();
        })
        .then((landmarks) => {
            const table = document.createElement("table");
            const header = create_tr_h(
                "Location",
                "Name",
                "Description",
                "Category",
                "Visited Date",
                "Visitor"
            );
            table.appendChild(header);
            for (let landmark of landmarks) {
                table.appendChild(create_tr_d_visited(landmark));
            }
            show_landmarks_pane.appendChild(table);
        });

    show_landmarks_pane.style.display = "block";
    container.style.display = "flex";
    container.addEventListener("click", closeVisitedLandmarks);
}

function closeVisitedLandmarks() {
    show_landmarks_pane.innerHTML = "";
    show_landmarks_pane.style.display = "none";
    container.style.display = "none";
    container.removeEventListener("click", closeVisitedLandmarks);
}

function showLandmarks() {
    fetch(`http://localhost:${PORT}/api/landmarks`)
        .then((response) => {
            return response.json();
        })
        .then((landmarks) => {
            const table = document.createElement("table");
            const header = create_tr_h(
                "Visited",
                "Location",
                "Name",
                "Description",
                "Category",
                "Note"
            );
            table.appendChild(header);
            for (let landmark of landmarks) {
                table.appendChild(create_tr_d(landmark));
            }
            show_landmarks_pane.appendChild(table);
        });

    show_landmarks_pane.style.display = "block";
    container.style.display = "flex";
    container.addEventListener("click", closeLandmarks);
}

function closeLandmarks() {
    show_landmarks_pane.innerHTML = "";
    show_landmarks_pane.style.display = "none";
    container.style.display = "none";
    container.removeEventListener("click", closeLandmarks);
}
