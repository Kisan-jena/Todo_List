let currentIndex = 1;
let deletedTodos = [];
let redoTodos = [];

// Load todos from localStorage
const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
const mainEl = document.getElementById("main");

function renderTodos() {
  // Sort by ID to maintain the correct order
  savedTodos.sort((a, b) => a.id - b.id);

  mainEl.innerHTML = "";
  savedTodos.forEach((todo, index) => {
    const todoEl = document.createElement("div");
    todoEl.id = `todo-${todo.id}`;
    todoEl.innerHTML = `
      <h4>${todo.id}. ${todo.text}</h4>
      <input type="checkbox" ${todo.completed ? "checked" : ""} onclick="markComplete(${todo.id})">
      <button onclick="deleteTodo(${todo.id})">Delete</button>
      <button onclick="editTodo(${todo.id})">Edit</button>
    `;
    mainEl.appendChild(todoEl);
  });

  // Save the current state in localStorage
  localStorage.setItem("todos", JSON.stringify(savedTodos));
}

function addTodo() {
  const inputEl = document.getElementById("inp");
  const todoText = inputEl.value.trim();
  if (todoText === "") {
    alert("Please enter a todo item.");
    return;
  }

  // If the list is empty, reset the numbering
  if (savedTodos.length === 0) {
    currentIndex = 1;
  }

  savedTodos.push({ id: currentIndex++, text: todoText, completed: false });
  renderTodos();
  inputEl.value = "";
}

function deleteTodo(id) {
  const todoIndex = savedTodos.findIndex(todo => todo.id === id);
  if (todoIndex > -1) {
    const deletedTodo = savedTodos[todoIndex];
    deletedTodos.push({ ...deletedTodo, position: todoIndex }); // Store original position
    redoTodos = []; // Clear redo history
    savedTodos.splice(todoIndex, 1);
    renderTodos();
  }
}

function markComplete(id) {
  const todo = savedTodos.find(todo => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    renderTodos();
  }
}

function editTodo(id) {
  const todo = savedTodos.find(todo => todo.id === id);
  const newText = prompt("Edit your todo:", todo.text);
  if (newText) {
    todo.text = newText;
    renderTodos();
  }
}

function undoDelete() {
  if (deletedTodos.length > 0) {
    const lastDeleted = deletedTodos.pop();
    redoTodos.push(lastDeleted);

    // Insert at the original position or at the end if out of bounds
    if (lastDeleted.position !== undefined && lastDeleted.position < savedTodos.length) {
      savedTodos.splice(lastDeleted.position, 0, lastDeleted);
    } else {
      savedTodos.push(lastDeleted);
    }

    renderTodos();
  }
}

function redoDelete() {
  if (redoTodos.length > 0) {
    const lastRedo = redoTodos.pop();
    deletedTodos.push(lastRedo);

    // Remove the todo from the list based on its ID
    const redoIndex = savedTodos.findIndex(todo => todo.id === lastRedo.id);
    if (redoIndex > -1) {
      savedTodos.splice(redoIndex, 1);
    }

    renderTodos();
  }
}

renderTodos();
