const studyInput = document.getElementById("study-input");
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");

function createTodoItem(todoText) {
  const listItem = document.createElement("li");
  listItem.className = "study-plan__item";

  const text = document.createElement("span");
  text.className = "study-plan__text";
  text.textContent = todoText;

  const completeButton = document.createElement("button");
  completeButton.className =
    "study-plan__button study-plan__button--complete";
  completeButton.textContent = "완료";

  completeButton.addEventListener("click", function () {
    moveToDone(listItem, todoText);
  });

  listItem.append(text, completeButton);
  return listItem;
}

function createDoneItem(todoText) {
  const listItem = document.createElement("li");
  listItem.className = "study-plan__item study-plan__item--done";

  const text = document.createElement("span");
  text.className = "study-plan__text";
  text.textContent = todoText;

  const deleteButton = document.createElement("button");
  deleteButton.className =
    "study-plan__button study-plan__button--delete";
  deleteButton.textContent = "삭제";

  deleteButton.addEventListener("click", function () {
    listItem.remove();
  });

  listItem.append(text, deleteButton);
  return listItem;
}

function addTodo() {
  const todoText = studyInput.value.trim();

  if (todoText === "") {
    return;
  }

  const todoItem = createTodoItem(todoText);
  todoList.appendChild(todoItem);
  studyInput.value = "";
}

function moveToDone(todoItem, todoText) {
  todoItem.remove();

  const doneItem = createDoneItem(todoText);
  doneList.appendChild(doneItem);
}

studyInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});