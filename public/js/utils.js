function create_label(value, label_for) {
    const element = document.createElement("label");
    element.textContent = value;
    element.setAttribute("for", label_for);
    return element;
}

function create_text_input(id, class_name) {
    const element = document.createElement("input");
    element.type = "text";
    element.id = id;
    element.classList.add(class_name);
    return element;
}

function create_select_input(id, class_name, ...options) {
    const element = document.createElement("select");
    element.id = id;
    for (let option of options) {
        const option_element = document.createElement("option");
        option_element.value = option;
        option_element.textContent = option;
        element.appendChild(option_element);
    }
    element.classList.add(class_name);
    return element;
}

function create_button(text, type, callback) {
    const element = document.createElement("button");
    element.textContent = text;
    element.type = type;
    if (callback) element.addEventListener("click", callback);
    return element;
}

function create_th(text) {
    const element = document.createElement("th");
    element.textContent = text;
    return element;
}

function create_tr_h(...headers) {
    const element = document.createElement("tr");
    for (let header of headers) element.appendChild(create_th(header));
    return element;
}

function create_tr_d(landmark) {
    const element = document.createElement("tr");
    element.id = landmark.id;

    const td_visited = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.classList.add("checkbox");
    checkbox.type = "checkbox";
    console.log(landmark.visited);
    if (landmark.visited) {
        checkbox.checked = true;
        checkbox.disabled = true;
    } else checkbox.checked = false;
    td_visited.appendChild(checkbox);
    element.appendChild(td_visited);

    const td_location = document.createElement("td");
    td_location.textContent = `${landmark.latitude} - ${landmark.longitude}`;
    element.appendChild(td_location);

    const td_name = document.createElement("td");
    const name_input = create_text_input("name-input", "name-input");
    name_input.value = landmark.name;
    td_name.appendChild(name_input);
    element.appendChild(td_name);

    const td_description = document.createElement("td");
    const description_input = create_text_input(
        "description-input",
        "description-input"
    );
    description_input.value = landmark.description;
    td_description.appendChild(description_input);
    element.appendChild(td_description);

    const td_category = document.createElement("td");
    const category_input = create_select_input(
        "category-input",
        "category-input",
        "cultural",
        "historical",
        "natural"
    );
    category_input.value = landmark.category;
    td_category.appendChild(category_input);
    element.appendChild(td_category);

    return element;
}
