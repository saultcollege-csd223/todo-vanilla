const taskInput = document.getElementById("new-task"); 
const addButton = document.getElementById("add-button"); 
const todoList = document.getElementById("todo-list"); 

loadFromLocalStorage();
addButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if ( e.key == "Enter" && taskInput.value != "") {
        addTask();
    }
});

function addTask() {
    if (taskInput.value == "") {
        alert("Task to be added should not be empty!");
        return;
    }
    const task = taskInput.value;
    let listItem = createNewTask(task);
    todoList.appendChild(listItem);

    taskInput.value = "";

    updateLocalStorage();
}

function createNewTask(taskName, completed=false) {
    // create List Item
    const listItem = document.createElement("li");
    // input (text)
    const editInput = document.createElement("input");
    // button.edit
    const checkButton = document.createElement("button");
    // button.delete
    const deleteButton = document.createElement("button");

    //Each element needs modified 
    editInput.type = "text";
    editInput.value = taskName;

    checkButton.innerText = "✓";
    checkButton.className = "check";
    checkButton.onclick = taskCompleted;

    deleteButton.innerText = "X";
    deleteButton.className = "delete";
    deleteButton.onclick = deleteTask;

    listItem.appendChild(checkButton);
    listItem.appendChild(editInput);
    listItem.appendChild(deleteButton);

    if ( completed ) {
        listItem.classList.add('done');
    }

    return listItem;
}

function deleteTask(event) {
    const deleteButton = event.target
    // Remove the list item corresponding to the clicked delete button
    deleteButton.parentNode.parentNode.removeChild(deleteButton.parentNode);

    updateLocalStorage();
}

function taskCompleted(event) {
    // Mark task as completed
    const checkButton = event.target;
    checkButton.parentNode.classList.add('done');
    checkButton.onclick = taskIncomplete;
    checkButton.innerHTML = "＋";

    updateLocalStorage();
}

function taskIncomplete(event) {
    // Mark task as incomplete
    const checkButton = event.target;
    checkButton.parentNode.classList.remove('done');
    checkButton.onclick = taskCompleted;
    checkButton.innerHTML = "✓";

    updateLocalStorage();
}

function updateLocalStorage() {
    let todos = [];
    for ( const listItem of todoList.children ) {
        let complete = false;
        if ( listItem.classList.contains('done') ) {
            complete = true;
        }

        const task = listItem.querySelector('input').value;

        todos.push({ task, complete });
    }

    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadFromLocalStorage() {
    let todos = JSON.parse(localStorage.getItem('todos'));

    if ( todos ) {
        for ( const todo of todos ) {
            todoList.appendChild(createNewTask(todo.task, todo.complete));
        }
    }
}