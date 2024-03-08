import './style.css';
import * as UI from './modules/UI';

document.addEventListener('DOMContentLoaded', () => {
  UI.setupTaskListeners();
  UI.navEventDelegation();
  UI.setupTaskListeners();
  UI.viewAllTasks(JSON.parse(localStorage.getItem('tasks')) || []);
});
