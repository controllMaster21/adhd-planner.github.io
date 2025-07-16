if (window.localStorage.getItem("items") === null) {
    window.localStorage.setItem("items", "{}");
}

const items = window.localStorage.getItem("items");
const obj = JSON.parse(items);

for (const item of Object.keys(obj)) {
    addItem(item, false, obj[item]["state"])
}

const input = document.getElementById("idk");
input.addEventListener("keypress", (e) =>
    {if (e.key == "Enter") {
        addItem(input.value, true);
    }}
)

function addItem(value, updateStorage = false, state = false) {

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
        item.className = "item";
        
        item.innerHTML = 
        `<input class="btn ${state!=false ? (state ? "done" : "prog") : "none"}" type="checkbox" oninput="saveChange(this)">
        <a>${value}</a>
        <div class="btns">
        <button class="btn remove" onclick="removeItem(this)">
        <img src="images/trash.png">
        </button>
        <button class="btn edit" onclick="editItem(this.parentNode.parentNode)">
        <img src="images/pencil.png">
        </button>
        </div>`;

        item.querySelector("input[type='checkbox']").checked = state !== false;

        container.appendChild(item);

        const input = document.getElementById("idk");
        input.value = "";

        if (updateStorage) {
            saveItem(value, {state:false});
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

function editItem(item) {
    const text = item.getElementsByTagName("a")[0];

    deleteItem(text.innerText);

    const input = document.createElement("input");
    input.type = "text";
    input.value = text.innerText;

    item.replaceChild(input, text);
    input.focus();

    const save = (e) => {
        try {
            item.replaceChild(text, input);
            text.innerText = input.value;
            saveItem(text.innerText, {"state":getState(item)});
        } catch {
            return;
        }
    }

    input.addEventListener("keypress", (e) => {if (e.key == "Enter") save(e)})
    
    input.addEventListener("focusout", save)
}

function getItems() {
    return JSON.parse(window.localStorage.getItem("items"));
}

function saveItem(item, data) {
    var obj = getItems();

    obj[item] = data;

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