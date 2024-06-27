const taskList = document.getElementById("taskList");
const list = JSON.parse(localStorage.getItem('todoList')) || [];

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const tasktext = taskInput.value;

  if (tasktext === "") {
    return;
  }

  const obj = { value: tasktext };
  list.push(obj);
  createTaskElement(obj.value);
  updateLocalStorage();

  taskInput.value = "";
}

function createTaskElement(submittedInput) {
  const li = document.createElement("li");
  li.draggable = true; // Make the list item draggable



  li.onmousedown= function(event) {
  
    let shiftX = event.clientX - li.getBoundingClientRect().left;
    let shiftY = event.clientY - li.getBoundingClientRect().top;
    let width = li.getBoundingClientRect().width

    li.style.width = width + 'px';
    li.style.position = 'absolute';
    li.style.zindex = 10;

  moveAt(event.pageX, event.pageY);

  function moveAt(pageX, pageY) {
    li.style.left = pageX - shiftX + 'px';
    li.style.top = pageY - shiftY + 'px';
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  document.addEventListener('mousemove', onMouseMove);
  li.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    li.onmouseup = null;
  };

  };

  li.ondragstart = function() {
    return false;
  };
  
  const taskTextElement = document.createElement("span");
  taskTextElement.textContent = submittedInput;
  li.appendChild(taskTextElement);

  const input = document.createElement("input");
  input.type = "checkbox";
  input.onmousedown= function(e) {
    e.stopImmediatePropagation()
  }
  input.addEventListener("click", function(e) {
    taskTextElement.classList.toggle("strikethrough");
  });
  li.appendChild(input);

  const editButton = document.createElement("button");
  editButton.innerHTML = '<ion-icon name="pencil-outline"></ion-icon>';
  editButton.onmousedown= function(e) {
    e.stopImmediatePropagation()
  }
  editButton.onclick = function() {
    editTask(li, taskTextElement);
  };
  li.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
  deleteButton.onmousedown= function(e) {
    e.stopImmediatePropagation()
  }
  deleteButton.onclick = function() {
    taskList.removeChild(li);
    const index = list.findIndex((item) => item.value === submittedInput);
    if (index!== -1) {
      list.splice(index, 1);
    }
    updateLocalStorage();
  };
  li.appendChild(deleteButton);

  taskList.appendChild(li);
}

function editTask(li, taskTextElement) {
  const editText = prompt("Edit task:", taskTextElement.textContent);
  if (editText!== null) {
    taskTextElement.textContent = editText;
    const index = list.findIndex((item) => item.value === taskTextElement.textContent);
    if (index!== -1) {
      list[index].value = editText;
    }
    updateLocalStorage();
  }
}

function updateLocalStorage() {
  localStorage.setItem("todoList", JSON.stringify(list));
}

function displayTask() {
  for (let i = 0; i < list.length; i++) {
    createTaskElement(list[i].value);
  }
}

displayTask();


const submission = document.getElementById("submit-button");
submission.addEventListener("click", addTask);

taskList.addEventListener("dragover", (e) => {
  e.preventDefault();
});

taskList.addEventListener("drop", (e) => {
  e.preventDefault();
  const draggedTask = e.dataTransfer.getData("text");
  const draggedLi = document.querySelector(`li span:contains(${draggedTask})`).parentNode;
  const targetLi = e.target.closest("li");
  const targetIndex = Array.prototype.indexOf.call(taskList.children, targetLi);
  const draggedIndex = Array.prototype.indexOf.call(taskList.children, draggedLi);

  if (targetIndex!== -1 && draggedIndex!== -1) {
    list.splice(targetIndex, 0, list.splice(draggedIndex, 1)[0]);
    updateLocalStorage();
    taskList.removeChild(draggedLi);
    taskList.insertBefore(draggedLi, targetLi);
  }
});

