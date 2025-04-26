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
    if (callback) {
        console.log("adding callback for ", text);
        element.addEventListener("click", callback);
    }
    return element;
}
