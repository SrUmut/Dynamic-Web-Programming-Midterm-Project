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
    if (typeof landmark.visited_date !== "undefined")
        td_visited.textContent = "✅";
    else td_visited.textContent = "❌";
    element.appendChild(td_visited);

    const td_location = document.createElement("td");
    td_location.textContent = `${landmark.latitude} | ${landmark.longitude}`;
    element.appendChild(td_location);

    const td_name = document.createElement("td");
    td_name.textContent = landmark.name;
    element.appendChild(td_name);

    const td_description = document.createElement("td");
    td_description.textContent = landmark.description;
    element.appendChild(td_description);

    const td_category = document.createElement("td");
    td_category.textContent = landmark.category;
    element.appendChild(td_category);

    const td_note = document.createElement("td");
    td_note.textContent = landmark.note;
    element.appendChild(td_note);

    return element;
}

function create_tr_d_visited(landmark) {
    const element = document.createElement("tr");
    element.id = landmark.id;

    const td_location = document.createElement("td");
    td_location.textContent = `${landmark.latitude} | ${landmark.longitude}`;
    element.appendChild(td_location);

    const td_name = document.createElement("td");
    td_name.textContent = landmark.name;
    element.appendChild(td_name);

    const td_description = document.createElement("td");
    td_description.textContent = landmark.description;
    element.appendChild(td_description);

    const td_category = document.createElement("td");
    td_category.textContent = landmark.category;
    element.appendChild(td_category);

    const td_visited_date = document.createElement("td");
    td_visited_date.textContent = landmark.visited_date;
    element.appendChild(td_visited_date);

    const td_visitor = document.createElement("td");
    td_visitor.textContent = landmark.visitor;
    element.appendChild(td_visitor);

    return element;
}
