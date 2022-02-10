let form = document.querySelector(`div.container .form`);
let taskInput = document.querySelector(`[type="text"]`);
let addBtn = document.querySelector(`[type="submit"]`);
let resltArea = document.querySelector(`div.tasks-area`);
let clearAll = document.querySelector(`div.container span.clear`);

let tasksArr = [];

clearListBtn();

if (localStorage.getItem(`Tasks`)) {
    tasksArr = JSON.parse(localStorage.getItem(`Tasks`));
}

getFromStorage();

addBtn.onclick = () => {
    if (taskInput.value !== "") {
        pushTask(taskInput.value);
        taskInput.value = "";
    }
}

taskInput.onkeydown = (e) => {
    if (e.key == 'Enter' && taskInput.value !== "") {
        pushTask(taskInput.value);
        taskInput.value = "";
    }
}

resltArea.addEventListener("click", (e) => {
    if (e.target.classList.contains(`delete`)) {
        removeTask(e.target.parentElement.getAttribute(`data-id`));
        e.target.parentElement.remove();
    } else if (e.target.classList.contains(`fas`)) {
        removeTask(e.target.parentElement.parentElement.getAttribute(`data-id`));
        e.target.parentElement.parentElement.remove();
    } else if (e.target.classList.contains(`task`)) {
        taskProgress(e.target.getAttribute(`data-id`));
        e.target.classList.toggle(`done`);
    } else if (e.target.classList.contains(`txt`)) {
        taskProgress(e.target.parentElement.getAttribute(`data-id`));
        e.target.parentElement.classList.toggle(`done`);
    }
    clearListBtn();
});

clearAll.onclick = () => {
    resltArea.innerHTML = "";
    localStorage.removeItem(`Tasks`);
    clearListBtn();
}

function pushTask(taskData) {
    const task = {
        id: Date.now(),
        title: taskData,
        done: false
    };
    tasksArr.push(task);
    createTaskElement(tasksArr);
    addToStorage(tasksArr);
}

function createTaskElement(tasksEls) {
    resltArea.innerHTML = "";
    tasksEls.forEach(task => {
        let taskDiv = document.createElement(`div`);
        taskDiv.className = `task`;
        if (task.done) {
            taskDiv.className = `task done`;
        }
        taskDiv.setAttribute(`data-id`, task.id);
        let taskTxt = document.createElement(`p`);
        taskTxt.className = "txt";
        taskTxt.appendChild(document.createTextNode(task.title));
        taskDiv.prepend(taskTxt);
        let delBtn = document.createElement(`span`);
        delBtn.className = `delete`;
        let clearIcon = document.createElement(`i`);
        clearIcon.className = `fas fa-trash`;
        delBtn.prepend(clearIcon);
        delBtn.appendChild(document.createTextNode(`Delete!`));
        taskDiv.append(delBtn);
        resltArea.appendChild(taskDiv);
    });
    clearListBtn();
}

function addToStorage(tasksEls) {
    localStorage.setItem(`Tasks`, JSON.stringify(tasksEls));
}

function getFromStorage() {
    let tasksData = localStorage.getItem(`Tasks`);
    if (tasksData) {
        let tasks = JSON.parse(tasksData);
        createTaskElement(tasks);
    }
}

function taskProgress(taskId) {
    for (let i = 0; i < tasksArr.length; i++) {
        if (tasksArr[i].id == taskId) {
            tasksArr[i].done ? tasksArr[i].done = false : tasksArr[i].done = true;
        }
    }
    addToStorage(tasksArr);
}

function removeTask(taskId) {
    tasksArr = tasksArr.filter((task) => task.id != taskId);
    addToStorage(tasksArr);
}

function clearListBtn() {
    resltArea.children.length == 0 ? clearAll.classList.add(`hide`) : clearAll.classList.remove(`hide`);
}