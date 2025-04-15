document.getElementById("root").innerHTML = `
<main id="main">
    <form id="form">
        <input type="text" palceholder="Add a message" class="msgInput" id="messageField">
        <input type="submit" value="Add">
    </form>
    <ul id="todoList"></ul>
</main>`;

const formEl = document.getElementById("form");
const todoListEl = document.getElementById("todoList");
const messageFieldEl = document.getElementById("messageField");

const trashCanImage = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="20px" height="20px">
    <path
        fill="currentColor"
        d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z" />
</svg>`;

let lastIdIndex = 0;
let todoListArray = [];

function onListItemNameClick(event) {
  const itemObj = event.target.parentElement.parentElement.$data;
  itemObj.messageEl.classList.toggle("checked");
  itemObj.checked = !itemObj.checked;
  saveToLocal();
}

function addTodoItem(message, checked = false, skipSave = false) {
  const todoItemEl = document.createElement("li");
  const itemId = ++lastIdIndex;
  todoItemEl.dataset.itemId = itemId;
  todoItemEl.innerHTML = `
    <div class="todoMessage ${checked ? "checked" : ""}">${message}</div>
    <div class="todoButtons">
      <input type="checkbox" class="checkboxBtn" ${checked ? "checked" : ""}>
      <button class="removeBtn" data-item-id="${itemId}">
        ${trashCanImage}
      </button>
    </div>
  `;

  todoListEl.appendChild(todoItemEl);

  const itemObj = {
    message,
    checked,
    id: itemId,
    el: todoItemEl,
    messageEl: todoItemEl.querySelector(".todoMessage"),
    checkbox: todoItemEl.querySelector('input[type="checkbox"]'),
    removeBtn: todoItemEl.querySelector(".removeBtn"),
    removeBtnEvent: () => removeTodoItem(itemId),
  };

  todoItemEl.$data = itemObj;
  todoListArray.push(itemObj);

  itemObj.checkbox.addEventListener("change", onListItemNameClick);
  itemObj.removeBtn.addEventListener("click", itemObj.removeBtnEvent);

  if (!skipSave) saveToLocal();
}

function removeTodoItem(id) {
  const found = todoListArray.find((item) => item.id === id);
  if (!found) return console.error("item not found");

  found.checkbox.removeEventListener("change", onListItemNameClick);
  found.removeBtn.removeEventListener("click", found.removeBtnEvent);
  found.el.remove();
  todoListArray = todoListArray.filter((item) => item.id !== id);

  saveToLocal();
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();

  if (messageFieldEl.value.length > 1) {
    addTodoItem(messageFieldEl.value);
    messageFieldEl.value = "";
  }

  console.log(event);
});

function saveToLocal() {
  localStorage.setItem(
    "todoListBit",
    JSON.stringify(
      todoListArray.map(({ message, checked }) => ({
        message,
        checked,
      }))
    )
  );
}

function loadFromLocal() {
  const foundInLocal = localStorage.getItem("todoListBit");
  if (!foundInLocal) return;
  JSON.parse(foundInLocal).forEach(({ message, checked }) => {
    addTodoItem(message, checked, true);
  });
}

loadFromLocal();