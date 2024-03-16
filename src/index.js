import './style.css';
import * as UI from './modules/UI';
import { finder } from '@medv/finder';

//css finder by https://github.com/antonmedv/finder
document.addEventListener('click', (event) => {
  const selector = finder(event.target);
  console.log(selector);
});

document.addEventListener('DOMContentLoaded', () => {
  // UI.setupTaskListeners();
  UI.navEventDelegation();
  // UI.setupTaskListeners();

  UI.viewAllTasks();

  if (document.querySelector('#newTask')) {
    UI.setupTaskListeners;
  }
});

//need to fix what happens when click on add task right now nothing happens
//because a ton of logic was changed
//the add task button doest even store anything in local memory
//need to modify the add task submit to also redisplay all the tasks

//still working on handling the submit task button
