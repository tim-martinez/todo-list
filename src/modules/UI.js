import { Task, getTasks, pushTask, taskAdded } from './taskModel.js';
import { handleCheckboxChange } from './task.js';

export function addTask() {
  const content = document.querySelector('.content');

  //form container
  const addTaskDiv = document.createElement('div');
  addTaskDiv.classList.add('addTaskDiv');
  content.classList.add('allTasksView');
  content.append(addTaskDiv);

  //add task form
  const form = document.createElement('form');
  form.id = 'newTask';
  addTaskDiv.append(form);

  //Task name and Description
  const taskName = document.createElement('input');
  taskName.placeholder = 'Task Name';
  taskName.id = 'taskName';
  taskName.name = 'name';
  form.append(taskName);

  const description = document.createElement('input');
  description.placeholder = 'Description';
  description.id = 'description';
  description.name = 'description';
  form.append(description);

  //Priority
  const priority = document.createElement('select');
  priority.classList.add('priority');
  priority.id = 'priority';
  priority.name = 'priority';

  const defaultOption = document.createElement('option');
  defaultOption.textContent = 'Priority';
  defaultOption.value = 'default';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  priority.appendChild(defaultOption);

  const highPriority = document.createElement('option');
  highPriority.value = 'High Priority';
  highPriority.textContent = 'High Priority';
  priority.append(highPriority);

  const standardPriority = document.createElement('option');
  standardPriority.value = 'Standard Priority';
  standardPriority.textContent = 'default';
  priority.append(standardPriority);

  const lowPriority = document.createElement('option');
  lowPriority.value = 'Low Priority';
  lowPriority.textContent = 'Low Priority';
  priority.append(lowPriority);
  form.append(priority);

  //Due Date
  const dueDate = document.createElement('input');
  dueDate.type = 'date';
  dueDate.id = 'dueDate';
  dueDate.name = 'dueDate';
  form.append(dueDate);

  //Submit Button
  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.id = 'submit';
  submit.value = 'Add Task';
  form.append(submit);
}

//sidebar event delegation
export function navEventDelegation() {
  const nav = document.querySelector('.nav');

  nav.addEventListener('click', (event) => {
    const target = event.target;
    if (target.matches('.addTask')) {
      addTask();
      setupTaskListeners();
    }
  });
}

//clear all children inside content div
export function clearContent() {
  const content = document.querySelector('.content');
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
}

//remove add task form
export function removeAddTaskForm() {
  const content = document.querySelector('.content');
  const addTaskDiv = document.querySelector('.addTaskDiv');

  if (addTaskDiv && content.contains(addTaskDiv)) {
    content.removeChild(addTaskDiv);
  }
}

//event listener for custom event
export function setupTaskListeners() {
  document.querySelector('#newTask').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form from submitting traditionally

    // Collect form data
    const taskName = document.querySelector('#taskName').value;
    const description = document.querySelector('#description').value;
    const priority = document.querySelector('#priority').value;
    const dueDate = document.querySelector('#dueDate').value;

    // Create a new task and add it to local storage
    pushTask(new Task(taskName, description, priority, dueDate));

    // Emit custom event to signal a task has been added
    taskAdded();

    // Clear form fields after submission
    event.target.reset();

    viewAllTasks();

    // Optionally, you could directly call `viewAllTasks()` here to update the UI,
    // but using a custom event as shown keeps concerns separated.
  });
}

export function viewAllTasks() {
  const tasks = getTasks(); // Fetch tasks from taskModel.js
  // clearContent();
  const content = document.querySelector('.content');

  tasks.forEach((task, index) => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'taskMainView';

    // Task completion checkbox
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.setAttribute('data-task-id', index);
    checkBox.checked = task.completed;
    checkBox.addEventListener('change', handleCheckboxChange);

    // Name Span
    const name = document.createElement('span');
    name.className = 'taskName';
    name.textContent = task.name;

    // Description
    const description = document.createElement('span');
    description.className = 'description';
    description.textContent = task.description;

    // Priority
    const priority = document.createElement('span');
    priority.className = 'priority';
    priority.textContent = task.priority;

    // Due Date
    const dueDate = document.createElement('span');
    dueDate.className = 'dueDate';
    dueDate.textContent = task.dueDate;

    // Appending all elements to the taskDiv and then content
    taskDiv.append(checkBox, name, description, priority, dueDate);
    content.appendChild(taskDiv);
  });
}
