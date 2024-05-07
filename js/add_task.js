let subtask = [];
let taskData = [];
let taskIdCounter = 0;
let selectedPrio = '';
let newTask = [];
let users = [];
let contacts = [];

async function init () {
    includeHTML();
    await loadTasksData();
    await loadUsers();
    await getContact();
}

/**
 * Setze alle Buttons zurück auf die Standardfarben und Schriftfarben
 *
 * @param {*} priority
 */
function changePriorityColor(priority) {
    document.getElementById("btnPrioUrgent").style.backgroundColor = "#ffffff";
    document.getElementById("btnPrioUrgent").style.color = "#000000";
    document.getElementById("btnPrioUrgent").style.borderColor = "#D1D1D1";
    document.getElementById("btnPrioUrgent").getElementsByTagName("img")[0].src = "assets/img/urgent_red_AddTask.svg";

    document.getElementById("btnPrioMedium").style.backgroundColor = "#ffffff";
    document.getElementById("btnPrioMedium").style.color = "#000000";
    document.getElementById("btnPrioMedium").style.borderColor = "#D1D1D1";
    document.getElementById("btnPrioMedium").getElementsByTagName("img")[0].src = "assets/img/medium_orange_AddTask.svg";

    document.getElementById("btnPrioLow").style.backgroundColor = "#ffffff";
    document.getElementById("btnPrioLow").style.color = "#000000";
    document.getElementById("btnPrioLow").style.borderColor = "#D1D1D1";
    document.getElementById("btnPrioLow").getElementsByTagName("img")[0].src = "assets/img/low_green_AddTask.svg";
 /**
 * Ändere die Farben des angeklickten Buttons entsprechend der Priorität
 *
 */   
    if (priority === 'urgent') {
        document.getElementById("btnPrioUrgent").style.backgroundColor = "#FF3D00";
        document.getElementById("btnPrioUrgent").style.color = "#FFFFFF";
        document.getElementById("btnPrioUrgent").style.borderColor = "#FF3D00";
        document.getElementById("btnPrioUrgent").getElementsByTagName("img")[0].src = "assets/img/urgent_white_AddTask.svg";
        selectedPrio = 'urgent';
    } else if (priority === 'medium') {
        document.getElementById("btnPrioMedium").style.backgroundColor = "#FFA800";
        document.getElementById("btnPrioMedium").style.color = "#FFFFFF";
        document.getElementById("btnPrioMedium").style.borderColor = "#FFA800";
        document.getElementById("btnPrioMedium").getElementsByTagName("img")[0].src = "assets/img/medium_white_AddTask.svg";
        selectedPrio = 'medium';
    } else if (priority === 'low') {
        document.getElementById("btnPrioLow").style.backgroundColor = "#7AE229";
        document.getElementById("btnPrioLow").style.color = "#FFFFFF";
        document.getElementById("btnPrioLow").style.borderColor = "#7AE229";
        document.getElementById("btnPrioLow").getElementsByTagName("img")[0].src = "assets/img/low_white_AddTask.svg";
        selectedPrio = 'low';
    }
}

function checkDueDate() {
    let selectedDate = new Date(document.getElementById('dueDate').value);
    let currentDate = new Date();

    if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
        alert('Please select a date that is today or later for the due date.');
        document.getElementById('dueDate').value = ''; // Zurücksetzen des Eingabefelds
    }
}

function handleCategoryChange(selectElement) {
    var selectedCategory = selectElement.value;
    // Hier können Sie die gewählte Kategorie weiterverarbeiten, z. B. sie in einer Variable speichern oder eine Funktion aufrufen
    console.log("Selected category: " + selectedCategory);
}

function changeBorderColor() {
    let categoryContainer = document.getElementById('categoryContainer');
    categoryContainer.style.borderColor = "rgba(41, 171, 226, 1)";
}

function toggleSubtasks() {
    const subtasksDiv = document.getElementById('subtasks');
    const plusIcon = document.getElementById('plusIcon');
    const cancelSubtask = document.getElementById('cancelSubtask');

    if (subtasksDiv.classList.contains('d-none')) {
        subtasksDiv.classList.remove('d-none');
        plusIcon.classList.add('d-none');
    } else {
        subtasksDiv.classList.add('d-none');
        plusIcon.classList.remove('d-none');
    }
}

function cancelSubtaskClick() {
    const subtasksDiv = document.getElementById('subtasks');
    const plusIcon = document.getElementById('plusIcon');
    const cancelSubtask = document.getElementById('cancelSubtask');

    subtasksDiv.classList.add('d-none');
    plusIcon.classList.remove('d-none');
    
}

function handleInputFocus() {
    let subtasksInput = document.querySelector("addSubtaskMain");
    subtasksInput.style.borderColor = "rgba(41, 171, 226, 1)";
}

function saveSubtask() {
    let subtaskInput = document.getElementById('addsubtask');
    let subtaskText = subtaskInput.value;
    
    if (subtaskText !== '') {
        // Erstellen des HTML-Codes für den Subtask mit einer eindeutigen ID
        const subtaskCount = document.querySelectorAll('.subtask-item').length; // Anzahl der vorhandenen Subtasks
        const subtaskHTML = renderSubtaskItem(subtaskText, subtaskCount);

        // Hinzufügen des Subtask-HTML-Codes zum Element mit der ID 'showsubtasks'
        const showSubtasksContainer = document.getElementById('showsubtasks');
        showSubtasksContainer.insertAdjacentHTML('beforeend', subtaskHTML);

        // Clear subtask input
        subtaskInput.value = '';

        // Hier entfernst du die Klasse d-none, um die Subtasks anzuzeigen
        showSubtasksContainer.classList.remove('d-none');
    }
}

function renderSubtaskItem(subtask, i) {
    return `
        <div class="subtask-item">
            <div id="subtask${i}" class="subtask-content">
                <span>\u2022 ${subtask}</span>
            </div>
            <div id="subtaskEditInput${i}" class="subtask-content d-none">
                <input value="${subtask}" class="subtask-input subtaskEditText" id="subtaskInput${i}">
                <div class="subtask-bounding-box">
                    <img onclick="subtaskDelete(${i})" src="assets/img/subtask_trash_AddTask.svg" alt="Delete Subtask" class="subtask-icon">
                    <img src="assets/img/subtask_seperator_AddTask.svg" alt="Separator" class="subtask-icon">
                    <img onclick="subtaskSaveEdit(${i})" src="assets/img/subtask_check_AddTask.svg" alt="Check Subtask" class="subtask-icon">
                </div>
            </div>
            <div id="mainBoundingBox${i}" class="subtask-bounding-box">
                <img onclick="subtaskEdit(${i})" src="assets/img/subtask_edit_AddTask.svg" alt="Edit Subtask" class="subtask-icon">
                <img src="assets/img/subtask_seperator_AddTask.svg" alt="Separator" class="subtask-icon">
                <img onclick="subtaskDelete(${i})" src="assets/img/subtask_trash_AddTask.svg" alt="Delete Subtask" class="subtask-icon">
            </div>
        </div>
    `;
}

function subtaskEdit(i) {
    let subtaskContent = document.getElementById(`subtask${i}`);
    let subtaskEditInput = document.getElementById(`subtaskEditInput${i}`);
    document.getElementById(`mainBoundingBox${i}`).classList.add('d-none');

    subtaskContent.classList.toggle('d-none');
    subtaskEditInput.classList.toggle('d-none');
}

function subtaskSaveEdit(i) {
    let subtaskContent = document.getElementById(`subtask${i}`);
    let subtaskEditInput = document.getElementById(`subtaskEditInput${i}`);
    let subtaskInput = document.getElementById(`subtaskInput${i}`);
    document.getElementById(`mainBoundingBox${i}`).classList.remove('d-none');

    subtaskContent.querySelector('span').textContent = `\u2022 ${subtaskInput.value}`;
    subtaskContent.classList.toggle('d-none');
    subtaskEditInput.classList.toggle('d-none');
}

function subtaskDelete(i) {
    let subtaskContainer = document.getElementById(`subtask${i}`).parentNode;
    subtaskContainer.remove();

    // Nach dem Entfernen eines Subtasks werden die verbleibenden Subtasks neu nummeriert
    let subtaskItems = document.querySelectorAll('.subtask-item');
    subtaskItems.forEach((item, index) => {
        item.querySelector('.subtask-content').id = `subtask${index}`;
        item.querySelector('.subtask-content input').id = `subtaskInput${index}`;
        item.querySelector('.subtask-bounding-box img').setAttribute('onclick', `subtaskEdit(${index})`);
        item.querySelector('.subtask-bounding-box img:last-child').setAttribute('onclick', `subtaskDelete(${index})`);
    });
}


function clearEntries() {
    // Clear-Eingaben für die Titel-Section
    document.getElementById('titleAddTask').value = '';
    // Clear-Eingaben für die Description-Section
    document.querySelector('.padding-description textarea').value = '';
    // Clear-Eingaben für die Assigned To-Section
    document.getElementById('assignAddTask').value = '';
    // Clear-Eingaben für die Due Date-Section
    document.getElementById('dueDate').value = '';
    // Clear-Eingaben für die Priority-Section
    resetPriorityButtons();
    // Clear-Eingaben für die Category-Section
    resetCategorySection();
    // Clear-Eingaben für die Subtasks-Section
    document.getElementById('addsubtask').value = '';
    // Clear-Einträge in der Show Subtasks-Section
    clearShowSubtasks();
    subtaskDelete();
}

function clearShowSubtasks() {
    const showSubtasks = document.getElementById('showsubtasks');
    // Lösche alle untergeordneten Elemente der showSubtasks-DIV
    while (showSubtasks.firstChild) {
        showSubtasks.removeChild(showSubtasks.firstChild);
    }
}

// // Eventlistener für den Clear-Button
// document.getElementById('clear-btn').addEventListener('click', clearEntries);

function resetPriorityButtons() {
    // Array mit den IDs der Priority-Buttons und ihren Standardbildern
    const priorityButtons = [
        { id: 'btnPrioUrgent', imgSrc: 'assets/img/urgent_red_AddTask.svg' },
        { id: 'btnPrioMedium', imgSrc: 'assets/img/medium_orange_AddTask.svg' },
        { id: 'btnPrioLow', imgSrc: 'assets/img/low_green_AddTask.svg' }
    ];

    // Schleife über alle Button-IDs
    priorityButtons.forEach(button => {
        const buttonElement = document.getElementById(button.id);
        // Zurücksetzen der Hintergrundfarbe
        buttonElement.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        // Zurücksetzen der Border Color
        buttonElement.style.borderColor = "#D1D1D1";
        // Zurücksetzen der Schriftfarbe
        buttonElement.style.color = 'rgba(0, 0, 0, 1)';
        // Zurücksetzen des Bildes
        const imgElement = buttonElement.querySelector('img');
        imgElement.src = button.imgSrc;
    });
}

function resetCategorySection() {
    const categoryDropdown = document.getElementById('categoryAddTask');
    // Setze den ausgewählten Index auf den Index des `<option>`-Elements mit dem Wert ""
    categoryDropdown.selectedIndex = 0;
    // Setze die Border Color zurück
    categoryDropdown.style.borderColor = "#D1D1D1";
    // Füge das onchange-Event wieder hinzu
    categoryDropdown.onchange = handleCategoryChange;
}


async function createTask() {
    // Erforderliche Felder prüfen
    let title = document.getElementById('titleAddTask').value;
    let dueDate = document.getElementById('dueDate').value;

    if (title === '' || dueDate === '') {
        alert('Please fill in all required fields.');
        return;
    }
    // Werte aus den Abschnitten abrufen
    let subTasks = document.getElementById('addsubtask').value;

    taskData.push ({
        id: taskIdCounter++,
        title: title,
        description: document.getElementById('descriptionAddTask').value,
        assignTo: document.getElementById('assignAddTask').value,
        dueDate: dueDate,
        category: document.getElementById('categoryAddTask').value,
        subTasks: subTasks.split('\n').map(subTask => ({ id: taskIdCounter++, content: subTask.trim() })),
        priority: selectedPrio,
        todo: "toDo",
    })
        // await setItem('taskData', JSON.stringify(taskData));

    // taskData.push(newTask);

    clearEntries()

    // JSON-Array ausgeben (nur für Debugging-Zwecke)
    // console.log(taskData);
};

async function loadTasksData() {
    try {
        taskData = JSON.parse(await getItem('taskData'))
    }
    catch (e) {
        console.info('Could not load tasks')
    }
}

async function loadUsers() {
    try {
      users = JSON.parse(await getItem("users"));
    } catch (e) {
      console.error("Loading error:", e);
    }
}

async function getContact() {
    try {
      contacts = JSON.parse(await getItem("contact"));
    } catch (error) {
      console.info("Could not load contacts");
    }
}

function openAssignTo() {
    let dropDownMenu = document.getElementById('assignToDropdown');
    dropDownMenu.classList.remove('d-none');
    document.getElementById('assignedUser').classList.add('d-none');
}

function closeAssignTo() {
    let dropDownMenu = document.getElementById('assignToDropdown');
    dropDownMenu.classList.add('d-none');
    document.getElementById('assignedUser').classList.remove('d-none');
}

function renderContacts() {
    let assignList = document.getElementById('assignToList');
    for (let i = 0; i < assignList.length; i++) {
        let contact = contacts[i];
        let badgeColor = contacts[i].color;
        assignToList.innerHTML += getassignListHTML(contact, badgeColor, i);
    }
}

function getassignListHTML(contact, badgeColor, i) {
    return /*HTML*/ `
            <div id="contact${i}" onclick="assignContact(${i}, '${contact.name}')">
                <div>
                    <div style="background-color: ${badgeColor}</div>
                    <div class="contactName">${contact.name}</div>
                </div>
                <img id="checkbox${i}" src="./assets/img/addTask_AssignTo_Checkbox.svg" class="checkbox">
            </div>
            `
}