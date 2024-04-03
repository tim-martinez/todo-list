import './style.css';
import * as UI from './modules/UI';

document.addEventListener('DOMContentLoaded', () => {
  UI.viewAllTasks();
  UI.navEventDelegation();
});

//ISSUE:
//not sure how to handle local storage issue
//continue with other logic and revisit
//work around fix maybe just remove the class prototype method all together
//and move it somewhere else

//TODO:
// x - format date using date-fns
// x - add color for priority
// x - organize tasks in order by date
// x - Add feat: view all tasks due today
// x - view all upcoming tasks
// x - add cancel button to addtaskform
// x - make priority color show on the left edge of task instead of background color
// x - finish making sure the taskView size is correct min-width
// x - add feat: remove/ delete task - x button that turns red on hover then prompt user to confirm delete
// x - remove is working but need to fix logic for displaying upcoming tasks
// x - finish create project and Projects view.

//TODO:
//working on form for editing task
//need to add the task's information into the input placeholders.
//finish creating and handle submiting the form

//todo:
//issue with edit. only works on bottom most task in viewallTasks
// possible issue with event listeners being called incorrectly

//add footer with link to github portfolio
// add hamburger menu for side bar media query
//add prompt to create task or projects when empty
