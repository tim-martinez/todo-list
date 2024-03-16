class Task {
  constructor(name, description, priority, dueDate, completed = false) {
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.dueDate = dueDate;
    this.completed = completed;
  }

  toggleCompleted() {
    this.completed = !this.completed;
    console.log('comp status: ' + this.completed);
  }
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// //custom event to share data with UI.js
// not sure if i need this anymore since my task has been refactored
function taskAdded() {
  document.dispatchEvent(new CustomEvent('taskAdded', { detail: { tasks } }));
}

function pushTask(task) {
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
  let storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  // Correctly reinstantiate each task as a Task instance
  return storedTasks.map((taskData) => {
    console.log('Recreating task from: ', taskData);
    const recreatedTask = new Task(
      taskData.name,
      taskData.description,
      taskData.priority,
      taskData.dueDate,
      taskData.completed
    );
    console.log('Recreated Task instance: ', recreatedTask);
    return recreatedTask;
  });
}

function toggleTaskCompleted(taskId) {
  const task = tasks[taskId];

  // Debugging logs
  console.log(
    'Inspecting the prototype of the task object:',
    Object.getPrototypeOf(task)
  );
  console.log(
    'Checking if task.toggleCompleted is defined:',
    task.toggleCompleted
  );
  console.log("Is 'task' an instance of Task?", task instanceof Task);

  if (task && task.toggleCompleted) {
    task.toggleCompleted(); // This should work if `task` is an instance of Task
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } else {
    console.error('Task not found or is not a Task instance:', taskId);
  }
}

export { Task, pushTask, getTasks, toggleTaskCompleted, taskAdded };
