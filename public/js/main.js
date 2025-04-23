// Initialize map
var map = L.map("map").setView([20, 0], 2); // Default global view

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

// Send landmarks to backend
function sendLandmarks(note) {
    fetch("http://localhost:8000/api/landmarks", {
        // Replace with actual backend URL
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ landmarks: landmarks, note: note }),
    })
        .then((response) => response.json())
        .then((data) =>
            alert("Data sent successfully: " + JSON.stringify(data))
        )
        .catch((error) => console.error("Error:", error));
}

function removeLandmark(lat, lng) {
    for (let i = 0; i < landmarks.length; i++) {
        const landmark = landmarks[i];
        if (landmark.latitude === lat && landmark.longitude === lng) {
            console.log("found it");
            landmarks.splice(i, 1);
        }
    }
}

const form_background = document.getElementById("form-background");
const add_notes_form_container = document.getElementById(
    "add-notes-form-container"
);
const add_notes_form = document.getElementById("add-notes-form");

function showAddNotesForm() {
    if (landmarks.length === 0) {
        alert("No landmarks selected!");
        return;
    }
    form_background.style.display = "block";
    add_notes_form_container.style.display = "flex";
    document.body.classList.add("stop-scrolling");
}

function closeAddNotesForm() {
    form_background.style.display = "none";
    add_notes_form_container.style.display = "none";
}

add_notes_form.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = add_notes_form.querySelector("textarea");
    sendLandmarks(note.value);

    closeAddNotesForm();
    note.value = "";
    landmarks = [];
    updateLandmarkList();
    for (let marker of markers) {
        marker.remove();
    }
});
