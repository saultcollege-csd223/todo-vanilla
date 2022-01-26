document.addEventListener('alpine:init', () => {
    Alpine.data('todoApp', () => ({
        newTaskName: "",
        todos: [],

        /**
         * Adds a new task to the todo list
         */
        addTask() {
            this.todos.push({task: this.newTaskName, complete: false});

            this.newTaskName = "";
        },

        /**
         * Handles the click of the delete button on a task
         * @param {int} i The index of the task to delete
         */
        deleteTask(i) {
            this.todos.splice(i, 1);
        },

        /**
         * Toggles the completeness of a given task item
         * @param {object} item The object representing the task to toggle completeness on
         */
        toggleComplete(item) {
            item.complete = !item.complete;
        },

        /**
         * Stores the current TODO list in localStorage
         */
        updateLocalStorage(todos) {
            localStorage.setItem('todos', JSON.stringify(todos));
        },

        /**
         * Loads a TODO list from localStorage and sets up the corresponding UI
         */
        init() {
            let data = JSON.parse(localStorage.getItem('todos'));
            if ( data ) {
                this.todos = data;
            } else {
                this.todos = [];
            }
        }
    }))
});
