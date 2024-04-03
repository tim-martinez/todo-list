class Task {
  constructor(id, name, description, priority, dueDate, completed, project) {
    this.id = id !== undefined ? id : currentTaskId++;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.completed = completed;
    this.project = project;
  }

  toggleCompleted() {
    this.completed = !this.completed;
    console.log(this.id + ' comp status: ' + this.completed);
  }
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentTaskId = JSON.parse(localStorage.getItem('currentTaskId')) || 0;

function pushTask(task) {
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('currentTaskId', JSON.stringify(currentTaskId)); // Save the new ID counter
}

function getTasks() {
  let storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // reinstate each task as a Task instance
  return storedTasks.map((taskData) => {
    const recreatedTask = new Task(
      taskData.id,
      taskData.name,
      taskData.description,
      taskData.priority,
      taskData.dueDate,
      taskData.completed,
      taskData.project
    );
    return recreatedTask;
  });
}

function toggleTaskCompleted(taskId) {
  // Find the task by its unique ID
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    const task = tasks[taskIndex];
    task.toggleCompleted();
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save the updated tasks array
  } else {
    console.error('Task not found or is not a Task instance:', taskId);
  }
}

function handleCheckboxChange(event) {
  const checkbox = event.target;
  const taskId = parseInt(checkbox.getAttribute('data-task-id'), 10);
  toggleTaskCompleted(taskId);
}

function removeTaskById(taskId) {
  // Find the index of the task with the given ID
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  // If the task is found, remove it from the array
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);

    // Update the tasks array in local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } else {
    console.error('Task with ID ' + taskId + ' not found.');
  }
}

function editStorage(taskId, { name, description, priority, dueDate }) {
  // Find the task by its unique ID
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    const task = tasks[taskIndex];

    // Only update if new values are provided and not empty
    task.name = name && name.trim() !== '' ? name : task.name;
    task.description = description && description.trim() !== '' ? description : task.description;
    task.priority = priority && priority.trim() !== '' ? priority : task.priority;
    task.dueDate = dueDate && dueDate.trim() !== '' ? dueDate : task.dueDate;

    // Save the updated tasks array to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } else {
    console.error('Task not found or is not a Task instance:', taskId);
  }
}

export { Task, pushTask, getTasks, toggleTaskCompleted, handleCheckboxChange, removeTaskById, editStorage };
