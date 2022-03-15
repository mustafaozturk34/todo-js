const form = document.querySelector("#form-todo");
const todoInput = document.querySelector("#form-input");
const todoList = document.querySelector("#todos");
const search = document.querySelector("#search-input");
const clearButton = document.querySelector("#clear");
const todosSide = document.querySelector("#todos-side");
const addButton = document.querySelector("#add");



eventListener();

function eventListener(e) {
    addButton.addEventListener("click", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUi);
    todoList.addEventListener("click", crudTodo);
    search.addEventListener("keyup", searchTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos() {
    if(confirm("Are you sure you want to delete all todos?")) {
        while(todoList.secondElementChild != null) {
            todoList.removeChild(todoList.secondElementChild);
        }
        localStorage.removeItem("todos");
    }
}

function searchTodos(e) {
    const searchValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".li-items");

    listItems.forEach((listItem) => {
        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(searchValue) === -1) {
            listItem.setAttribute("style", "display: none;")
        }
        else {
            listItem.setAttribute("style", "display: flex;")
        }
    })
}

function crudTodo(e) {
    if(e.target.className === "checkbox-class") {
        if(e.target.checked) {
            e.target.parentElement.style.textDecoration = "line-through";
        }else {
            e.target.parentElement.style.textDecoration = "none";
        }
    }else if(e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromLocalStorage(e.target.parentElement.parentElement.textContent)
        showAlert("success", "todo has been deleted successfully.")
    }

}

function deleteTodoFromLocalStorage(deleteTodo) {
    let todos = getTodosFromStorage();

    todos.forEach((todo, index) => {
        if(todo === deleteTodo) {
            todos.splice(index, 1);
        }
    })

    localStorage.setItem("todos", JSON.stringify(todos));
}


function loadAllTodosToUi() {
    let todos = getTodosFromStorage();
    todos.forEach((todo) => {
        addTodoToUI(todo);
    })
}

function addTodo(e) {
    const todos = getTodosFromStorage();
    const newTodo = todoInput.value.trim();
    let isSame = false;

    todos.forEach((todo) => {
        if(todo.toLowerCase() === newTodo.toLowerCase()) {
            isSame = true;
        }
    })
    if(newTodo === "") {
        showAlert("danger", "Please, enter a todo.");
    }else if(isSame) {
        showAlert("danger", "This todo is already on your list.");
    }else if(todos.length > 9) {
        showAlert("danger", "You can add a maximum of 10 todos.");
    }else if(newTodo.length > 26) {
        showAlert("danger", "You can add a todo with a maximum of 26 characters.");
    } 
    else {
        addTodoToUI(newTodo);
        addTodosFromStorage(newTodo);
        showAlert("success", "todo has been successfully added.")
    }


    e.preventDefault();
}

function getTodosFromStorage() {
    let todos;

    if(localStorage.getItem("todos") === null) {
        todos = [];
    }else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodosFromStorage(newTodo) {
    let todos = getTodosFromStorage();

    todos.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message,e) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} alert-message`;
    alert.textContent = message;

    todosSide.insertBefore(alert, todosSide.firstChild);


    setTimeout(function() {
        alert.remove();
    }, 2000)


}

function addTodoToUI(newTodo) {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    const checkbox = document.createElement("INPUT");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove' style = 'color: #ca2121;'></i>";
    listItem.className = "li-items"
    checkbox.setAttribute("type", "checkbox");;
    checkbox.setAttribute("class", "checkbox-class");
    
    listItem.appendChild(checkbox);
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    todoList.appendChild(listItem);
    todoInput.value = "";
}