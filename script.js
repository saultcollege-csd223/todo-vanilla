const $taskInput = $("#new-task"); 
const $addButton = $("#add-button"); 
const $todoList = $("#todo-list"); 

// Restore todos from a previos session if possible
loadFromLocalStorage();

// Set up handlers for the events that must cause a new TODO to be added
$addButton.click(addTask);
$taskInput.keypress((e) => {
    if ( e.key == "Enter" && $taskInput.val() != "") {
        addTask();
    }
});

/**
 * Adds a new task to the todo list
 */
 function addTask() {
    if ($taskInput.val() == "") {
        alert("Task to be added should not be empty!");
        return;
    }
    const task = $taskInput.val();
    let $listItem = createNewTask(task);
    $todoList.append($listItem);

    // Clear the todo input
    $taskInput.val("");

    updateLocalStorage();
}

/**
 * 
 * @param {string} taskName The name of the task
 * @param {boolean} completed Whether or not the task is completed
 * @returns A <li> element containing the UI for a task, with its 'check' and 'delete' buttons
 */
 function createNewTask(taskName, completed=false) {
    // create List Item
    const $listItem = $("<li>");
    // input (text)
    const $editInput = $(`<input type="text">`);
    // button.edit
    const $checkButton = $('<button class="check">✓</button>');
    // button.delete
    const $deleteButton = $('<button class="delete">X</button>');

    //Each element needs modified 
    $editInput.val(taskName);

    $checkButton.click(taskCompleted);
    $deleteButton.click(deleteTask);

    $listItem.append($checkButton)
             .append($editInput)
             .append($deleteButton);

    if ( completed ) {
        $listItem.addClass('done');
    }

    return $listItem;
}

/**
 * Handles the click of the delete button on a task
 * @param {Event} event The click event object
 */
 function deleteTask() {
    // Remove the list item corresponding to the clicked delete button
    $(this).parent().remove();

    updateLocalStorage();
}

/**
 * Handles the click of the 'check' button on a task when the task was not yet complete
 * @param {Event} event The click event
 */
 function taskCompleted(event) {
    // Mark task as completed
    const $checkButton = $(this);
    $checkButton.parent().addClass('done');

    // Clicking the check button now must mark it as incomplete again
    $checkButton.click(taskIncomplete)
                .html("＋"); // Change the text to better reflect the button's new purpose

    updateLocalStorage();
}

/**
 * Handles the click of the 'check' button on a task when it was already completed
 * @param {Event} event The click event
 */
 function taskIncomplete(event) {
    // Mark task as incomplete
    const $checkButton = $(this);
    $checkButton.parent().removeClass('done');
    
    // Clicking the button now must mark it as completed again
    $checkButton.click(taskCompleted)
                .html("✓"); // Change the text to better reflect its new purpose

    updateLocalStorage();
}

/**
 * Stores the current TODO list in localStorage
 */
 function updateLocalStorage() {
    let todos = []; // We'll make an array of { task, complete } objects and JSONify it

    $('#todo-list li').each(function() {
        let complete = false;
        if ( $(this).hasClass('done') ) {
            complete = true;
        }

        const task = $(this).find('input').val();

        todos.push({ task, complete});
    })

    localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * Loads a TODO list from localStorage and sets up the corresponding UI
 */
function loadFromLocalStorage() {
    let todos = JSON.parse(localStorage.getItem('todos')); // See updateLocalStorage

    if ( todos ) {
        for ( const todo of todos ) {
            // Make a new task list item for each item in the TODO list
            $todoList.append(createNewTask(todo.task, todo.complete));
        }
    }
}