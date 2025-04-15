document.getElementById("root").outerHTML = /*html*/ `
<main id="main">
    <form id="form">
        <input type="text" placeholder="Enter a message..." class="msgInput" id="messageField">
        <input type="submit" value="Add">
    </form>
    <ul id="todoList"></ul>
    <footer id="footer">
      <div>Completed <span id="completeditemCount">0</span> out of <span id="itemCount">0</span> tasks</div>
    </div>
</main>`;

const formEl = document.getElementById("form");
const todoListEl = document.getElementById("todoList");
const messageFieldEl = document.getElementById("messageField");
const itemCountEl = document.getElementById("itemCount");
const completeditemCountEl = document.getElementById("completeditemCount");

const trashCanImage = /*html*/ `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" height="100%" width="18px">
    <path
        fill="currentColor"
        d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z" />
</svg>`;

let lastIdIndex = 0;
let todoListArray = [];

function onListItemCheckboxClick(event) {
  const itemObj = event.target.closest(".todoListItem").$data;
  itemObj.messageEl.classList.toggle("checked");
  itemObj.checked = !itemObj.checked;
  updateItemCountDisplay();
  saveToLocal();
}

function addTodoItem(message, checked = false, skipSave = false) {
  const todoItemEl = document.createElement("li");
  const itemId = ++lastIdIndex;
  todoItemEl.className = "todoListItem";
  todoItemEl.dataset.itemId = itemId;

  todoItemEl.innerHTML = `
    <div class="todoMessage ${checked ? "checked" : ""}">${message}</div>
    <div class="todoButtons">
      <input type="checkbox" class="checkboxBtn" title="Check/uncheck item" ${
        checked ? "checked" : ""
      }>
      <button class="removeBtn" title="Delete item" data-item-id="${itemId}">
        ${trashCanImage}
      </button>
    </div>
  `;

  todoListEl.prepend(todoItemEl);

  const itemObj = {
    message,
    checked,
    id: itemId,
    el: todoItemEl,
    messageEl: todoItemEl.querySelector(".todoMessage"),
    checkbox: todoItemEl.querySelector('input[type="checkbox"]'),
    removeBtn: todoItemEl.querySelector(".removeBtn"),
  };

  todoItemEl.$data = itemObj;
  todoListArray.push(itemObj);

  itemObj.checkbox.addEventListener("change", onListItemCheckboxClick);
  itemObj.removeBtn.addEventListener("click", onRemoveTodoClicked);

  updateItemCountDisplay();

  if (!skipSave) saveToLocal();
}

function onRemoveTodoClicked(event) {
  const itemObj = event.target.closest(".todoListItem").$data;
  itemObj.el.remove();
  todoListArray = todoListArray.filter((item) => item.id !== itemObj.id);

  updateItemCountDisplay();

  saveToLocal();
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  if (messageFieldEl.value.length > 1) {
    addTodoItem(messageFieldEl.value);
    messageFieldEl.value = "";
  }
});

function updateItemCountDisplay() {
  itemCountEl.innerText = todoListArray.length;
  completeditemCountEl.innerText = todoListArray.filter((item) => item.checked).length;
}

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
