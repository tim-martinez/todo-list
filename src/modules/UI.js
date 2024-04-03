// import { unique } from 'webpack-merge';
import { Task, getTasks, pushTask, handleCheckboxChange, removeTaskById, editStorage } from './task.js';
import { format, addDays } from 'date-fns';

export function addTaskForm() {
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
  taskName.required = true;

  const description = document.createElement('input');
  description.placeholder = 'Description';
  description.id = 'description';
  description.name = 'description';
  description.required = true;

  //Priority
  const priority = document.createElement('select');
  priority.classList.add('priority');
  priority.id = 'priority';
  priority.name = 'priority';
  priority.required = true;

  const highPriority = document.createElement('option');
  highPriority.value = 'High Priority';
  highPriority.textContent = 'High Priority';
  priority.append(highPriority);

  const standardPriority = document.createElement('option');
  standardPriority.value = 'Standard Priority';
  standardPriority.textContent = 'Standard Priority';
  standardPriority.selected = true;
  priority.append(standardPriority);

  const lowPriority = document.createElement('option');
  lowPriority.value = 'Low Priority';
  lowPriority.textContent = 'Low Priority';
  priority.append(lowPriority);

  //Due Date
  const dueDate = document.createElement('input');
  dueDate.type = 'date';
  dueDate.id = 'dueDate';
  dueDate.name = 'dueDate';
  dueDate.required = true;

  //Submit Button
  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.id = 'submit';
  submit.value = 'Add Task';

  //Cancel Button
  const cancel = document.createElement('div');
  cancel.classList.add('cancel');
  cancel.textContent = 'x';

  form.append(taskName, description, priority, dueDate, submit, cancel);

  cancel.addEventListener('click', () => {
    content.removeChild(addTaskDiv);
  });
}

export function navEventDelegation() {
  const nav = document.querySelector('.nav');

  nav.addEventListener('click', (event) => {
    const target = event.target;
    if (target.matches('.addTask')) {
      addTaskForm();
      submitNewTask();
    }

    if (target.matches('.viewAll')) {
      viewAllTasks();
    }

    if (target.matches('.today')) {
      viewTodayTasks();
    }

    if (target.matches('.upcoming')) {
      viewUpcomingTasks();
    }
    if (target.matches('.createProject')) {
      projectForm();
      submitNewProject();
    }
    if (target.matches('.projects')) {
      viewProjects();
    }
  });
}

export function clearContent() {
  const content = document.querySelector('.content');
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
}

function submitNewTask() {
  document.querySelector('#newTask').addEventListener('submit', (event) => {
    event.preventDefault();

    // Collect form data
    const taskName = document.querySelector('#taskName').value;
    const description = document.querySelector('#description').value;
    const priority = document.querySelector('#priority').value;
    const dueDate = document.querySelector('#dueDate').value;
    const completed = false;

    // Create a new task and add it to local storage
    pushTask(new Task(undefined, taskName, description, priority, dueDate, completed, 'notProject'));

    // Clear form fields after submission
    event.target.reset();

    viewAllTasks();
  });
}

function taskPriorityColor(task) {
  let backgroundColor;
  switch (task.priority) {
    case 'High Priority':
      backgroundColor = '#d9534f';
      break;
    case 'Standard Priority':
      backgroundColor = '#f0ad4e';
      break;
    case 'Low Priority':
      backgroundColor = '#5cb85c';
      break;
    default:
      backgroundColor = '#e2e3e5';
      break;
  }
  return backgroundColor;
}

function getTodaysDateInLocalTimezone() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // JavaScript months are 0-indexed
  const day = today.getDate();

  // Format today's date as YYYY-MM-DD
  const dateStringToday = [year, month.toString().padStart(2, '0'), day.toString().padStart(2, '0')].join('-');

  return dateStringToday;
}

function displayTasks(task) {
  if (task.project === 'notProject') {
    const content = document.querySelector('.content');

    const taskDiv = document.createElement('div');
    taskDiv.className = 'taskMainView';

    //set background color for priority
    taskDiv.style.borderLeft = '10px solid' + taskPriorityColor(task);

    //print task id for testing. remove when finished!
    const id = document.createElement('span');
    id.textContent = task.id;

    // Task completion checkbox
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = task.id + ' checkbox';
    checkBox.setAttribute('data-task-id', task.id); //set to task's unique ID
    checkBox.checked = task.completed;
    checkBox.addEventListener('change', (event) => {
      handleCheckboxChange(event);
      //cross out task name if completed
      if (event.target.checked) {
        name.classList.add('crossed-out');
      } else {
        name.classList.remove('crossed-out');
      }
    });

    const name = document.createElement('span');
    name.textContent = task.name;

    //cross out task name if completed
    if (task.completed === true) {
      name.classList.add('crossed-out');
    } else {
      name.className = 'taskName';
    }

    // Description
    const description = document.createElement('span');
    description.className = 'description';
    description.textContent = 'Description: ' + task.description;

    // Priority
    // const priority = document.createElement('span');
    // priority.className = 'priority';
    // priority.textContent = task.priority;

    // Due Date
    const dueDate = document.createElement('span');
    dueDate.className = 'dueDate';
    // Format the due date using date-fns
    if (task.dueDate) {
      // Assume task.dueDate is in the format 'YYYY-MM-DD'
      const [year, month, day] = task.dueDate.split('-').map((num) => parseInt(num, 10));
      // Create a Date object as UTC
      const dateAsUTC = new Date(Date.UTC(year, month - 1, day));
      // Add one day to the date
      const adjustedDate = addDays(dateAsUTC, 1);
      const formattedDueDate = format(adjustedDate, 'MMM dd, yyyy');
      dueDate.textContent = formattedDueDate;
    }

    const textWrapper = document.createElement('div');
    textWrapper.classList.add('textWrapper');
    textWrapper.append(name, description, dueDate);

    const actions = document.createElement('div');
    actions.classList.add('actions');

    const edit = document.createElement('img');
    edit.classList.add('edit');
    edit.src = '/assets/icons/edit.svg';
    edit.setAttribute('data-task-id', task.id);

    const deleteTask = document.createElement('img');
    deleteTask.classList.add('deleteTask');
    deleteTask.src = '/assets/icons/delete.svg';
    deleteTask.setAttribute('data-task-id', task.id);

    actions.append(edit, deleteTask);
    taskDiv.append(id, checkBox, textWrapper, actions);
    content.append(taskDiv);

    removeTask();
    editTask();
  }
}

function removeTask() {
  const content = document.querySelector('.content');
  const deleteTask = document.querySelectorAll('.deleteTask');

  function deleteTaskEventListener(btn) {
    btn.addEventListener('click', (event) => {
      console.log('deleted Task');
      const taskId = Number(event.target.dataset.taskId);
      removeTaskById(taskId);

      if (content.classList.contains('todayTasksView')) {
        viewTodayTasks();
      }

      if (content.classList.contains('allTasksView')) {
        viewAllTasks();
      }

      if (content.classList.contains('upcomingTasksView')) {
        viewUpcomingTasks();
      }
    });
  }

  deleteTask.forEach((btn) => deleteTaskEventListener(btn));
}

function editTask() {
  const content = document.querySelector('.content');
  const editBtn = document.querySelectorAll('.edit');

  const editTaskDiv = document.createElement('div');
  editTaskDiv.classList.add('editTaskDiv');

  function editEventListener(editBtn) {
    editBtn.addEventListener('click', (event) => {
      displayEditForm(event);
    });
  }

  function displayEditForm(event) {
    const taskId = Number(event.target.dataset.taskId);
    const task = getTasks().filter((task) => task.id === taskId)[0];

    const editForm = document.createElement('form');
    editForm.classList.add('editForm');
    editForm.id = 'editForm';

    const name = document.createElement('input');
    name.placeholder = task.name;
    name.id = 'editName';

    const description = document.createElement('input');
    description.placeholder = task.description;
    description.id = 'editDescription';

    //Priority
    const priority = document.createElement('select');
    priority.classList.add('priority');
    priority.id = 'editPriority';
    priority.name = 'priority';

    const highPriority = document.createElement('option');
    highPriority.value = 'High Priority';
    highPriority.textContent = 'High Priority';

    const standardPriority = document.createElement('option');
    standardPriority.value = 'Standard Priority';
    standardPriority.textContent = 'Standard Priority';

    const lowPriority = document.createElement('option');
    lowPriority.value = 'Low Priority';
    lowPriority.textContent = 'Low Priority';

    if (task.priority === 'High Priority') {
      highPriority.selected = true;
    }

    if (task.priority === 'Standard Priority') {
      standardPriority.selected = true;
    }

    if (task.priority === 'Low Priority') {
      lowPriority.selected = true;
    }

    priority.append(highPriority, standardPriority, lowPriority);

    //Due Date
    const dueDate = document.createElement('input');
    dueDate.type = 'date';
    dueDate.id = 'editDueDate';
    dueDate.classList = 'editDueDate';
    dueDate.name = 'dueDate';

    //Due Date overlay
    const dueDateOverlay = document.createElement('div');
    dueDateOverlay.classList = 'dueDateOverlay';
    // dueDateOverlay.textContent = task.dueDate;

    if (task.dueDate) {
      // Assume task.dueDate is in the format 'YYYY-MM-DD'
      const [year, month, day] = task.dueDate.split('-').map((num) => parseInt(num, 10));
      // Create a Date object as UTC
      const dateAsUTC = new Date(Date.UTC(year, month - 1, day));
      // Add one day to the date
      const adjustedDate = addDays(dateAsUTC, 1);
      const formattedDueDate = format(adjustedDate, 'MMM dd, yyyy');
      dueDateOverlay.textContent = formattedDueDate;
    }

    dueDateOverlay.addEventListener('click', () => {
      dueDateOverlay.style.display = 'none';
      dueDate.style.display = 'block';
      dueDate.click();
    });

    //Submit Button
    const submit = document.createElement('input');
    submit.type = 'submit';
    submit.id = 'editSubmit';
    submit.value = 'Save';

    // //Cancel Button
    // const cancel = document.createElement('div');
    // cancel.classList.add('cancel');
    // cancel.textContent = 'x';

    // cancel.addEventListener('click', () => {
    //   content.removeChild(editTaskDiv);
    //   console.log('clicked');
    // });

    editForm.append(name, description, priority, dueDate, dueDateOverlay, submit);
    editTaskDiv.append(editForm);
    content.append(editTaskDiv);

    saveTask(taskId);
    console.log(`correct id? ${taskId}`);
  }

  editBtn.forEach((editBtn) => editEventListener(editBtn));
}

function saveTask(taskId) {
  const form = document.querySelector('#editForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    console.log('id: ' + taskId);

    const name = document.querySelector('#editName').value;
    const description = document.querySelector('#editDescription').value;
    const priority = document.querySelector('#editPriority').value;
    const dueDate = document.querySelector('#editDueDate').value;

    editStorage(taskId, { name, description, priority, dueDate });
    viewAllTasks();
  });
}
function displayAllTasks() {
  const content = document.querySelector('.content');
  content.classList = 'content allTasksView';

  const tasks = getTasks().sort((b, a) => b.dueDate.localeCompare(a.dueDate));

  tasks.forEach((task) => displayTasks(task));

  if (tasks.length === 0) {
    content.classList = 'content noTasks';
    const noTasksMessage = document.createElement('div');
    noTasksMessage.classList.add('noTasksDiv');
    const message = document.createElement('div');
    message.classList.add('noTaskMessage');
    message.textContent = 'Create a Task or Project to get started';
    const toDoImg = document.createElement('img');
    toDoImg.src = 'assets/icons/todolist.svg';
    toDoImg.classList.add('mainImg');

    noTasksMessage.append(message, toDoImg);
    content.append(noTasksMessage);
  }
}

function displayTodayTasks() {
  const content = document.querySelector('.content');
  content.classList = 'content todayTasksView';

  const tasks = getTasks();
  const dateStringToday = getTodaysDateInLocalTimezone(); // Use the corrected method to get today's date
  // Filter tasks that are due today
  const tasksDueToday = tasks.filter((task) => task.dueDate === dateStringToday);

  clearContent();

  tasksDueToday.forEach((task) => displayTasks(task));

  if (tasksDueToday.length === 0) {
    const noTasksMessage = document.createElement('div');
    noTasksMessage.textContent = 'No tasks due today.';
    content.appendChild(noTasksMessage);
  }
}

function displayUpcomingTasks() {
  const content = document.querySelector('.content');
  content.classList = 'content upcomingTasksView';

  const tasks = getTasks();
  const dateStringToday = getTodaysDateInLocalTimezone(); // Use the corrected method to get today's date

  // Filter tasks that are due today
  const upcomingTasks = tasks.filter((task) => task.dueDate !== dateStringToday && task.dueDate > dateStringToday);

  clearContent();

  upcomingTasks.forEach((task) => displayTasks(task));

  if (upcomingTasks.length === 0) {
    const noTasksMessage = document.createElement('div');
    noTasksMessage.textContent = 'No upcoming tasks due.';
    content.appendChild(noTasksMessage);
  }
}

export function viewAllTasks() {
  clearContent();
  displayAllTasks();
}

function viewTodayTasks() {
  clearContent();
  displayTodayTasks();
}

function viewUpcomingTasks() {
  clearContent();
  displayUpcomingTasks();
}

function projectForm() {
  const content = document.querySelector('.content');

  const projectFormDiv = document.createElement('div');
  projectFormDiv.classList.add('projectFormDiv');

  const projectForm = document.createElement('form');
  projectForm.id = 'newProject';

  const projectName = document.createElement('input');
  projectName.placeholder = 'Project Name';
  projectName.id = 'projectName';
  projectName.name = 'projectName';
  projectName.required - true;

  const projectDescription = document.createElement('input');
  projectDescription.placeholder = 'Description';
  projectDescription.id = 'projectDescription';
  projectDescription.name = 'projectDescription';
  projectDescription.required = true;

  const projectPriority = document.createElement('select');
  projectPriority.classList.add('priority');
  projectPriority.id = 'projectPriority';
  projectPriority.name = 'projectPriority';
  projectPriority.required = true;

  const highPriority = document.createElement('option');
  highPriority.value = 'High Priority';
  highPriority.textContent = 'High Priority';

  const standardPriority = document.createElement('option');
  standardPriority.value = 'Standard Priority';
  standardPriority.textContent = 'Standard Priority';
  standardPriority.selected = true;

  const lowPriority = document.createElement('option');
  lowPriority.value = 'Low Priority';
  lowPriority.textContent = 'Low Priority';

  projectPriority.append(highPriority, standardPriority, lowPriority);

  const projectDueDate = document.createElement('input');
  projectDueDate.type = 'date';
  projectDueDate.id = 'projectDueDate';
  projectDueDate.name = 'projectDueDate';
  projectDueDate.required = true;

  //Submit Button
  const submitProject = document.createElement('input');
  submitProject.type = 'submit';
  submitProject.id = 'submitProject';
  submitProject.value = 'Add Project';

  //Cancel Button
  const cancel = document.createElement('div');
  cancel.classList.add('cancel');
  cancel.textContent = 'x';

  cancel.addEventListener('click', () => content.removeChild(projectFormDiv));

  projectForm.append(projectName, projectDescription, projectPriority, projectDueDate, submitProject, cancel);
  projectFormDiv.append(projectForm);
  content.append(projectFormDiv);
}

function submitNewProject() {
  document.querySelector('#newProject').addEventListener('submit', (event) => {
    event.preventDefault();

    // Collect form data
    const projectName = document.querySelector('#projectName').value;
    const projectDescription = document.querySelector('#projectDescription').value;
    const projectPriority = document.querySelector('#projectPriority').value;
    const projectDueDate = document.querySelector('#projectDueDate').value;
    const completed = false;

    // Create a new task and add it to local storage
    pushTask(
      new Task(undefined, projectName, projectDescription, projectPriority, projectDueDate, completed, projectName)
    );

    // Clear form fields after submission
    event.target.reset();

    viewProjects();
  });
}

function viewProjects() {
  clearContent();

  const content = document.querySelector('.content');
  content.classList = 'content projectView';

  const projects = getTasks().filter((task) => task.project === task.name);
  const tasks = projects.sort((b, a) => b.dueDate.localeCompare(a.dueDate));

  const projectWrapper = document.createElement('div');
  projectWrapper.classList.add('projectWrapper');
  tasks.forEach((task) => {
    if (task.project !== 'notProject' && task.project !== `${task.project}task`) {
      const projectDiv = document.createElement('div');
      projectDiv.classList.add('card');

      //set background color for priority
      projectDiv.style.borderTop = '10px solid' + taskPriorityColor(task);

      const projectName = document.createElement('div');
      projectName.textContent = task.project;

      const projectDescription = document.createElement('div');
      projectDescription.textContent = task.description;

      const projectDueDate = document.createElement('div');

      const actions = document.createElement('div');
      actions.classList.add('projectActions');

      const deleteBtn = document.createElement('img');
      deleteBtn.classList.add('deleteTask');
      deleteBtn.src = '/assets/icons/delete.svg';

      const editBtn = document.createElement('img');
      editBtn.classList.add('edit');
      editBtn.src = '/assets/icons/edit.svg';

      actions.append(editBtn, deleteBtn);

      // Format the due date using date-fns
      if (task.dueDate) {
        const [year, month, day] = task.dueDate.split('-').map((num) => parseInt(num, 10));
        // Create a Date object as UTC
        const dateAsUTC = new Date(Date.UTC(year, month - 1, day));
        // Add one day to the date
        const adjustedDate = addDays(dateAsUTC, 1);
        const formattedDueDate = format(adjustedDate, 'MMM dd, yyyy');
        projectDueDate.textContent = formattedDueDate;
      }

      projectDiv.append(projectName, projectDescription, projectDueDate, actions);
      projectWrapper.append(projectDiv);
      content.append(projectWrapper);

      projectDiv.addEventListener('click', () => {
        viewSingleProject(task);
      });
    }
  });
}

function viewSingleProject(project) {
  clearContent();
  const content = document.querySelector('.content');
  const projectId = project.id;

  const singleProjectDiv = document.createElement('div');
  singleProjectDiv.classList.add('singleProject');

  const title = document.createElement('div');
  title.textContent = project.name;
  title.style.backgroundColor = taskPriorityColor(project);

  const descriptionDiv = document.createElement('div');
  const description = document.createElement('div');
  description.textContent = 'Description: ' + project.description;

  const detailsDiv = document.createElement('div');
  detailsDiv.classList.add('details');
  const priority = document.createElement('div');
  priority.textContent = project.priority;
  const dueDate = document.createElement('div');
  // Format the due date using date-fns
  if (project.dueDate) {
    const [year, month, day] = project.dueDate.split('-').map((num) => parseInt(num, 10));
    // Create a Date object as UTC
    const dateAsUTC = new Date(Date.UTC(year, month - 1, day));
    // Add one day to the date
    const adjustedDate = addDays(dateAsUTC, 1);
    const formattedDueDate = format(adjustedDate, 'MMM dd, yyyy');
    dueDate.textContent = 'Due: ' + formattedDueDate;
  }

  detailsDiv.append(priority, dueDate);
  descriptionDiv.append(detailsDiv);

  //display project tasks here
  const projectTasks = getTasks().filter((task) => task.project.includes(project.name + 'task'));

  const projectTasksDiv = document.createElement('div');
  projectTasksDiv.classList.add('projectTasksDiv');

  projectTasks.forEach((task) => {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('taskProjectView');
    const taskName = document.createElement('div');
    taskName.textContent = task.name;

    // Task completion checkbox
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.setAttribute('data-task-id', task.id); //set to task's unique ID
    checkBox.checked = task.completed;
    checkBox.addEventListener('change', (event) => {
      handleCheckboxChange(event);
      //cross out task name if completed
      if (event.target.checked) {
        taskName.classList.add('crossed-out');
      } else {
        taskName.classList.remove('crossed-out');
      }
    });

    taskDiv.append(checkBox, taskName);
    projectTasksDiv.append(taskDiv);
  });

  console.log(projectTasks);

  const addTaskDiv = document.createElement('div');
  addTaskDiv.classList.add('project-addTaskDiv');
  const addProjectTaskBtn = document.createElement('div');
  addProjectTaskBtn.textContent = 'Add Task';
  addProjectTaskBtn.classList.add('addProjectTaskBtn');

  addProjectTaskBtn.addEventListener('click', () => {
    singleProjectDiv.removeChild(addTaskDiv);
    const addTaskSection = document.createElement('div');
    addTaskSection.classList.add('addTaskSection');

    const form = document.createElement('form');
    form.id = 'projectTask';

    const taskName = document.createElement('input');
    taskName.placeholder = 'Task Name';
    taskName.id = 'projectTaskName';
    taskName.name = 'name';
    taskName.required = true;

    //Submit Button
    const submit = document.createElement('input');
    submit.type = 'submit';
    submit.id = 'submitProjectTask';
    submit.value = 'Add';

    submit.addEventListener('click', () => {
      submitProjectTask(project);
    });

    form.append(taskName, submit);
    addTaskSection.append(form);
    singleProjectDiv.append(addTaskSection);
  });

  addTaskDiv.append(addProjectTaskBtn);

  // descriptionDiv.append(description, priority, dueDate);
  singleProjectDiv.append(title, descriptionDiv, projectTasksDiv, addTaskDiv);
  content.append(singleProjectDiv);
}

function submitProjectTask(project) {
  document.querySelector('#projectTask').addEventListener('submit', (event) => {
    event.preventDefault();

    // Collect form data
    const taskName = document.querySelector('#projectTaskName').value;
    const taskId = project.name + 'task';
    // const description = document.querySelector('#description').value;
    // const priority = document.querySelector('#priority').value;
    // const dueDate = document.querySelector('#dueDate').value;
    const completed = false;

    // Create a new task and add it to local storage
    pushTask(new Task(undefined, taskName, undefined, undefined, project.dueDate, completed, taskId));

    // Clear form fields after submission
    event.target.reset();

    viewSingleProject(project);
  });
}
