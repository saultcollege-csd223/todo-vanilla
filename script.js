const taskInput = document.getElementById("new-task"); 
const addButton = document.getElementById("add-button"); 
const todoList = document.getElementById("todo-list"); 

// Restore todos from a previos session if possible
loadFromLocalStorage();

// Set up handlers for the events that must cause a new TODO to be added
addButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if ( e.key == "Enter" && taskInput.value != "") {
        addTask();
    }
});

/**
 * Adds a new task to the todo list
 */
function addTask() {
    if (taskInput.value == "") {
        alert("Task to be added should not be empty!");
        return;
    }
    const task = taskInput.value;
    let listItem = createNewTask(task);
    todoList.appendChild(listItem);

    // Clear the todo input
    taskInput.value = "";

    updateLocalStorage();
}

/**
 * 
 * @param {string} taskName The name of the task
 * @param {boolean} completed Whether or not the task is completed
 * @returns A <li> element containing the UI for a task, with its 'check' and 'delete' buttons
 */
function createNewTask(taskName, completed=false) {

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = taskName;

    const checkButton = document.createElement("button");
    checkButton.innerText = "✓";
    checkButton.className = "check";
    checkButton.onclick = taskCompleted;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "X";
    deleteButton.className = "delete";
    deleteButton.onclick = deleteTask;

    const listItem = document.createElement("li");
    listItem.appendChild(checkButton);
    listItem.appendChild(editInput);
    listItem.appendChild(deleteButton);
    if ( completed ) {
        listItem.classList.add('done');
    }

    return listItem;
}

/**
 * Handles the click of the delete button on a task
 * @param {Event} event The click event object
 */
function deleteTask(event) {
    const deleteButton = event.target
    // Remove the list item corresponding to the clicked delete button
    deleteButton.parentNode.parentNode.removeChild(deleteButton.parentNode);

    updateLocalStorage();
}

/**
 * Handles the click of the 'check' button on a task when the task was not yet complete
 * @param {Event} event The click event
 */
function taskCompleted(event) {
    
    const checkButton = event.target;
    
    // Mark task now as completed
    checkButton.parentNode.classList.add('done');

    // Clicking the check button now must mark it as incomplete again
    checkButton.onclick = taskIncomplete;
    checkButton.innerHTML = "＋";  // Change the text to better reflect the button's new purpose

    updateLocalStorage();
}

/**
 * Handles the click of the 'check' button on a task when it was already completed
 * @param {Event} event The click event
 */
function taskIncomplete(event) {

    const checkButton = event.target;
    
    // Mark task now as incomplete
    checkButton.parentNode.classList.remove('done');
    
    // Clicking the button now must mark it as completed again
    checkButton.onclick = taskCompleted;
    checkButton.innerHTML = "✓";  // Change the text to better reflect its new purpose

    updateLocalStorage();
}

/**
 * Stores the current TODO list in localStorage
 */
function updateLocalStorage() {
    let todos = [];  // We'll make an array of { task, complete } objects and JSONify it
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

/**
 * Loads a TODO list from localStorage and sets up the corresponding UI
 */
function loadFromLocalStorage() {
    let todos = JSON.parse(localStorage.getItem('todos'));  // See updateLocalStorage

    if ( todos ) {
        for ( const todo of todos ) {
            // Make a new task list item for each item in the TODO list
            todoList.appendChild(createNewTask(todo.task, todo.complete));
        }
    }
}