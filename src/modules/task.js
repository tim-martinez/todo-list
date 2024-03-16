import { Task, addTask, getTasks, toggleTaskCompleted } from './taskModel.js';

export function handleCheckboxChange(event) {
  // The logic here to handle checkbox changes...
  const checkbox = event.target;
  const taskId = parseInt(checkbox.getAttribute('data-task-id'), 10);
  toggleTaskCompleted(taskId);
}
