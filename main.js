if (window.localStorage.getItem("items") === null) {
    window.localStorage.setItem("items", "{}");
}

refreshList()

function addItem(value, updateStorage = false, {state = false, intensity = "low"}) {

    if (value !== "") {
        const container = document.getElementById("list");
        if (updateStorage) {
            var checked = []
            Array.from(container.querySelectorAll("input[type='checkbox']")).forEach(element => {
                checked.push(element.checked)
            });

            checked.push(false);
        }

        const item = document.createElement("div");
        item.className = `item ${intensity}`;
        
        item.innerHTML = 
        `<input class="btn ${state!=false ? (state ? "done" : "prog") : "none"}" type="checkbox" oninput="saveChange(this)">
        <a>${value}</a>
        <div class="btns">
        <button class="btn remove" onclick="removeItem(this)">
        <img src="images/trash.png">
        </button>
        <button class="btn edit" onclick="openInterface(true, this.parentElement.parentElement)">
        <img src="images/pencil.png">
        </button>
        </div>`;

        item.querySelector("input[type='checkbox']").checked = state !== false;

        container.appendChild(item);

        if (updateStorage) {
            saveItem(value, {state:state, intensity:intensity});
        }
    }
}

function removeItem(btn) {
    const elem = btn.parentElement.parentElement;
    const item = elem.querySelector("a").innerText;

    deleteItem(item);
    elem.remove();
}

function saveChange(elem) {
    elem.checked = !elem.checked;
    const state = cycleState(getState(elem.parentElement));
    const data = {"state":state};

    setState(elem, state);

    const key = elem.parentElement.querySelector("a").innerText;

    saveItem(key, data);
}

function getItems() {
    return JSON.parse(window.localStorage.getItem("items"));
}

function saveItem(item, data) {
    var obj = getItems();

    if (obj[item]) {
        for (const key of Object.keys(data)) {
            obj[item][key] = data[key];
        }
    } else {
        obj[item] = data;
    }

    window.localStorage.setItem("items", JSON.stringify(obj));
}

function deleteItem(item) {
    var obj = getItems();

    delete obj[item];

    window.localStorage.setItem("items", JSON.stringify(obj))
}

function getState(item) {
    const checkbox = item.querySelector("input[type='checkbox']");

    return checkbox.checked ? (checkbox.className.includes("done") ? true : null) : false;
}

function setState(checkbox, state) {
    checkbox.checked = state === null || state == true;

    const list = checkbox.classList;

    switch (state) {
        case false:
            list.replace("done", "none");

            break;

        case null:
            list.replace("none", "prog");

            break;

        case true:
            list.replace("prog", "done");

            break;

    }
}

function cycleState(state) {
    const states = [false, null, true];
    return states[(states.indexOf(state)+1) % 3]
}

function makeItem(form) {
    addItem(form.querySelector("[name=listitem]").value, true, {state:false,intensity:form.querySelector("[name=timeIntensity]").value});

    resetInterface();
}

function editItem(form, item) {
    const itemValue = item.querySelector("a").innerText;

    const state = getItems()[itemValue]["state"];

    deleteItem(itemValue);
    saveItem(form.querySelector("[name=listitem]").value, {state:state,intensity: form.querySelector("[name=timeIntensity]").value});
    refreshList();

    resetInterface();
}

function openInterface(edit = false, item = null) {
    const interface = document.getElementById("itemInterface");
    const get = interface.querySelector.bind(interface);

    interface.style.display = "block";

    if (edit) {
        const itemValue = item.querySelector("a").innerText;
        get("h2").innerText = "Edit item";
        const button = get("#addItem");
        button.innerText = "edit";
        button.onclick = () => editItem(interface, item);

        get("[name=listitem]").value = itemValue;
        get("[name=timeIntensity]").options.namedItem(getItems()[itemValue].intensity).selected = true;

        interface.addEventListener("keypress", (e) => {if (e.key == "Enter") editItem(interface, item)});
    } else {
        get("h2").innerText = "New item";
        const button = get("#addItem");
        button.innerText = "create";
        button.onclick = () => makeItem(interface);

        interface.addEventListener("keypress", (e) => {if (e.key == "Enter") makeItem(interface)});
    }
}
function displayItems(value) {
    const elems = document.getElementsByClassName("item");

    for (const elem of elems) {
        elem.style.display = elem.className.includes(value) ? "flex" : "none"
    }
}

function refreshList() {
    const obj = getItems();
    const list = document.getElementById("list");

    list.innerHTML = "";

    for (const item of Object.keys(obj)) {
        addItem(item, false, {state: obj[item]["state"], intensity: obj[item]["intensity"] != null ? obj[item]["intensity"] : "low"});
    }
}

function resetInterface() {
    const interface = document.getElementById("itemInterface");

    interface.querySelectorAll("input[type=text]").forEach((item) => item.value = "");
    interface.style.display = "none";
}