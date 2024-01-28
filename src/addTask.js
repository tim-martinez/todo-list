const generateForm = function () {
  const content = document.querySelector('.content');
  const addTaskDiv = document.createElement('div');
  addTaskDiv.classList.add('addTaskDiv');
  content.classList.add('addTaskView');
  content.append(addTaskDiv);
};

export default generateForm;
