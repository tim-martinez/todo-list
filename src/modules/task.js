export default function task() {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  class Task {
    constructor(name, description, priority, dueDate) {
      this.name = name;
      this.description = description;
      this.priority = priority;
      this.dueDate = dueDate;
    }
  }

  document.querySelector('#newTask').addEventListener('submit', (event) => {
    event.preventDefault();

    const { name, description, priority, dueDate } = event.target.elements;

    const task = new Task(
      name.value,
      description.value,
      priority.value,
      dueDate.value
    );
    tasks.push(task);

    //local storage
    const storeTasks = function (key, objects) {
      const objectsString = JSON.stringify(objects);
      localStorage.setItem(key, objectsString);
    };

    storeTasks('tasks', tasks);

    //custom event to share data with UI.js
    document.dispatchEvent(new CustomEvent('taskAdded', { detail: { tasks } }));
  });
}
