import task from './task';

export function addTask() {
  const content = document.querySelector('.content');
  const addTaskDiv = document.createElement('div');
  addTaskDiv.classList.add('addTaskDiv');
  content.classList.add('allTasksView');
  content.append(addTaskDiv);

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

export function navEventDelegation() {
  const nav = document.querySelector('.nav');

  nav.addEventListener('click', (event) => {
    const target = event.target;
    if (target.matches('.addTask')) {
      addTask();
      task();
    }
  });
}

export function clearContent() {
  const content = document.querySelector('.content');
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
}

export function removeAddTaskForm() {
  const content = document.querySelector('.content');
  const addTaskDiv = document.querySelector('.addTaskDiv');

  if (addTaskDiv && content.contains(addTaskDiv)) {
    content.removeChild(addTaskDiv);
  }
}

//event listener for custom event
export function setupTaskListeners() {
  document.addEventListener('taskAdded', (event) => {
    removeAddTaskForm();
    viewAllTasks(event.detail.tasks);
  });
}

export function viewAllTasks(tasks) {
  console.log('UI: ', tasks);
  clearContent();

  // TODO Update content div with tasks
  const content = document.querySelector('.content');
  tasks.forEach((task) => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'taskMainView';
    taskDiv.textContent = `${task.name} ${task.description} ${task.priority} ${task.dueDate}`;
    content.append(taskDiv);
  });
}
