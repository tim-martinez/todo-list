export default function task() {
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

    console.log(task);
  });
}
