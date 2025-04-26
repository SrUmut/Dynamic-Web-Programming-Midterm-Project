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
function sendLandmarks(landmarks) {
    fetch(`http://localhost:${PORT}/api/landmarks`, {
        // Replace with actual backend URL
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(landmarks),
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
    for (let i = 0; i < landmarks.length; i++) {
        const lm = landmarks[i];
        const name_input_id = `add-notes-form-row-${i}-name-input`;
        const description_input_id = `add-notes-form-row-${i}-description-input`;
        const category_input_id = `add-notes-form-row-${i}-category-input`;

        const lm_container = document.createElement("span");
        lm_container.classList.add("add-notes-form-row");
        const lm_label = create_label(
            `lat: ${lm.latitude}\tlng: ${lm.longitude}`,
            ""
        );
        lm_label.style.fontWeight = "bold";
        const name_label = create_label("Name:", name_input_id);
        const name_input = create_text_input(name_input_id, "name-input");
        const description_label = create_label(
            "Description:",
            description_input_id
        );
        const description_input = create_text_input(
            description_input_id,
            "description-input"
        );
        const category_label = create_label("Category:", "");
        const category_input = create_select_input(
            category_input_id,
            "category-input",
            "cultural",
            "historical",
            "natural"
        );

        lm_container.appendChild(lm_label);
        lm_container.appendChild(name_label);
        lm_container.appendChild(name_input);
        lm_container.appendChild(description_label);
        lm_container.appendChild(description_input);
        lm_container.appendChild(category_label);
        lm_container.appendChild(category_input);

        add_notes_form.appendChild(lm_container);
    }
    const button_container = document.createElement("span");
    button_container.appendChild(create_button("Submit", "submit"));
    button_container.appendChild(
        create_button("Cancel", "", closeAddNotesForm)
    );
    add_notes_form.appendChild(button_container);

    form_background.style.display = "block";
    add_notes_form_container.style.display = "flex";
    document.body.classList.add("stop-scrolling");
}

function closeAddNotesForm() {
    form_background.style.display = "none";
    add_notes_form_container.style.display = "none";
    document.body.classList.remove("stop-scrolling");
    add_notes_form.innerHTML = "";
}

add_notes_form.addEventListener("submit", (event) => {
    event.preventDefault();
    landmarks_to_send = [];
    const rows = add_notes_form.querySelectorAll(".add-notes-form-row");
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const name_input = row.querySelector(".name-input");
        const description_input = row.querySelector(".description-input");
        const category_input = row.querySelector(".category-input");
        landmarks_to_send.push({
            latitude: landmarks[i].latitude,
            longitude: landmarks[i].longitude,
            name: name_input.value,
            description: description_input.value,
            category: category_input.value,
        });
    }
    sendLandmarks(landmarks_to_send);

    closeAddNotesForm();
    landmarks = [];
    updateLandmarkList();
    for (let marker of markers) {
        marker.remove();
    }
});

const show_landmarks_container = document.querySelector(
    "#show-landmarks-container"
);

const update_landmarks_pane = document.querySelector("#update-landmarks-pane");

function updateLandmarksFactory(landmarks) {
    return () => {
        const table = update_landmarks_pane.querySelector("table");
        const tr_list = table.querySelectorAll("tr");
        for (let i = 1; i < landmarks.length; i++) {
            const lm = landmarks[i - 1];
            const tr = tr_list[i];
            if (
                lm.visited !== tr.querySelector(".checkbox").checked ||
                lm.name !== tr.querySelector(".name-input").value ||
                lm.description !==
                    tr.querySelector(".description-input").value ||
                lm.category !== tr.querySelector(".category-input").value
            ) {
                fetch(`/api/landmarks/${lm.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        latitude: lm.latitude,
                        longitude: lm.longitude,
                        name: tr.querySelector(".name-input").value,
                        description:
                            tr.querySelector(".description-input").value,
                        category: tr.querySelector(".category-input").value,
                        visited: tr.querySelector(".checkbox").checked,
                    }),
                });
            }
        }

        closeLandmarkds();
    };
}

function showLandmarks(landmarks) {
    const table = document.createElement("table");
    let tr = create_tr_h(
        "Visited",
        "Location",
        "Name",
        "Description",
        "Category"
    );
    table.appendChild(tr);

    for (let landmark of landmarks) table.appendChild(create_tr_d(landmark));

    update_landmarks_pane.appendChild(table);
    update_landmarks_pane.appendChild(
        create_button("Update", "", updateLandmarksFactory(landmarks))
    );
    update_landmarks_pane.appendChild(
        create_button("Close", "", closeLandmarkds)
    );
    form_background.style.display = "block";
    show_landmarks_container.style.display = "flex";
    document.body.classList.add("stop-scrolling");
}

function closeLandmarkds() {
    form_background.style.display = "none";
    show_landmarks_container.style.display = "none";
    document.body.classList.remove("stop-scrolling");
    update_landmarks_pane.innerHTML = "";
}

function getLandmarks() {
    fetch(`http://localhost:${PORT}/api/landmarks`)
        .then((response) => response.json())
        .then((data) => {
            showLandmarks(data);
        })
        .catch((error) => console.error("Error:", error));
}
