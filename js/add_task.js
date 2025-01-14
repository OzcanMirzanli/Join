const dropDownMenu = document.getElementById("assignToDropdown");
const assignedUser = document.getElementById("assignedUser");
const cancelSubtask = document.getElementById("cancelSubtask");
const subtasksDiv = document.getElementById("subtasks");
const plusIcon = document.getElementById("plusIcon");
const addSubtaskInput = document.getElementById("addsubtask");

/**
 * Global array to store data.
 * @type {Array<Object>}
 */
let subtask = [];
let taskData = [];
let taskIdCounter = 0;
let selectedPrio = "";
let newTask = [];
let contacts = [];
let selectedContacts = [];
let assignedContacts = [];

/**
 * Initializes the application side.
 */
async function init() {
  includeHTML();
  await loadTasksData();
  await getContact();
}

/**
 * Loads task data from remote storage.
 */
async function loadTasksData() {
  try {
    taskData = await getItem("taskData");
  } catch (e) {
    console.info("Could not load tasks");
  }
}

/**
 * Loads contact data from remote storage.
 */
async function getContact() {
  try {
    contacts = await getItem("contacts");
  } catch (error) {
    console.info("Could not load contacts");
  }
}

/**
 * Sets all buttons back to default colors and font colors.
 *
 * @param {string} priority - The priority level.
 */
function changePriorityColor(priority) {
  resetPriorityButtons();
  setPriorityButtonStyles(priority);
}

/**
 * Resets the styles of all priority buttons to their default state.
 */
function resetPriorityButtons() {
  const buttons = [
    { id: "btnPrioUrgent", img: "assets/img/urgent_red_AddTask.svg" },
    { id: "btnPrioMedium", img: "assets/img/medium_orange_AddTask.svg" },
    { id: "btnPrioLow", img: "assets/img/low_green_AddTask.svg" },
  ];

  buttons.forEach((button) => {
    const btn = document.getElementById(button.id);
    btn.style.backgroundColor = "#ffffff";
    btn.style.color = "#000000";
    btn.style.borderColor = "#D1D1D1";
    btn.getElementsByTagName("img")[0].src = button.img;
  });
}

/**
 * Sets the styles for the priority button based on the given priority.
 *
 * @param {string} priority - The priority level.
 */
function setPriorityButtonStyles(priority) {
  const styles = {
    urgent: {
      backgroundColor: "#FF3D00",
      color: "#FFFFFF",
      borderColor: "#FF3D00",
      img: "assets/img/urgent_white_AddTask.svg",
      prio: "Urgent",
    },
    medium: {
      backgroundColor: "#FFA800",
      color: "#FFFFFF",
      borderColor: "#FFA800",
      img: "assets/img/medium_white_AddTask.svg",
      prio: "Medium",
    },
    low: {
      backgroundColor: "#7AE229",
      color: "#FFFFFF",
      borderColor: "#7AE229",
      img: "assets/img/low_white_AddTask.svg",
      prio: "Low",
    },
  };

  const btn = document.getElementById(
    `btnPrio${capitalizeFirstLetter(priority)}`
  );
  if (btn) {
    btn.style.backgroundColor = styles[priority].backgroundColor;
    btn.style.color = styles[priority].color;
    btn.style.borderColor = styles[priority].borderColor;
    btn.getElementsByTagName("img")[0].src = styles[priority].img;
    selectedPrio = styles[priority].prio;
  }
}

/**
 * Capitalizes the first letter of the given string.
 *
 * @param {string} string - The string to capitalize.
 * @returns {string} - The string with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Toggles the visibility of subtasks section.
 */
function toggleSubtasks() {
  if (subtasksDiv.classList.contains("d-none")) {
    subtasksDiv.classList.remove("d-none");
    plusIcon.classList.add("d-none");
  } else {
    subtasksDiv.classList.add("d-none");
    plusIcon.classList.remove("d-none");
  }
}

/**
 * Handles click event on cancel subtask button.
 */
function cancelSubtaskClick() {
  subtasksDiv.classList.add("d-none");
  plusIcon.classList.remove("d-none");
  addSubtaskInput.value = "";
}

/**
 * Saves a new subtask and push subtask into subtask global arra.
 * Improve better handover to remote storage array taskData.
 */
function saveSubtask() {
  let subtaskText = addSubtaskInput.value;

  if (subtaskText !== "") {
    let subtaskId = subtask.length;

    subtask.push({ id: subtaskId, content: subtaskText, completed: false });
    const subtaskHTML = renderSubtaskItem(subtaskText, subtaskId);
    const showSubtasksContainer = document.getElementById("showsubtasks");
    showSubtasksContainer.insertAdjacentHTML("beforeend", subtaskHTML);

    addSubtaskInput.value = "";
    showSubtasksContainer.classList.remove("d-none");
  }
}

/**
 * Handles subtask edit action.
 *
 * @param {number} i - The index of the subtask to edit.
 */
function subtaskEdit(i) {
  let subtaskContent = document.getElementById(`subtaskContent${i}`);
  let subtaskEditInput = document.getElementById(`subtaskEditInput${i}`);
  document.getElementById(`mainBoundingBox${i}`).classList.add("d-none");

  subtaskContent.classList.add("d-none");
  subtaskEditInput.classList.remove("d-none");
}

/**
 * Handles subtask save edit action.
 *
 * @param {number} i - The index of the subtask to save edit.
 */
function subtaskSaveEdit(i) {
  let subtaskContent = document.getElementById(`subtaskContent${i}`);
  let subtaskEditInput = document.getElementById(`subtaskEditInput${i}`);
  let subtaskInput = document.getElementById(`subtaskInput${i}`);
  document.getElementById(`mainBoundingBox${i}`).classList.remove("d-none");

  subtask[i].content = subtaskInput.value;

  subtaskContent.querySelector(
    "span"
  ).textContent = `\u2022 ${subtaskInput.value}`;
  subtaskContent.classList.toggle("d-none");
  subtaskEditInput.classList.toggle("d-none");
}

/**
 * Deletes a subtask.
 *
 * @param {number} id - The ID of the subtask to delete.
 */
function subtaskDelete(id) {
  let index = subtask.findIndex((sub) => sub.id === id);

  if (index !== -1) {
    subtask.splice(index, 1);

    let subtaskElement = document.getElementById(`subtask${id}`);
    subtaskElement.remove();
  }
}

/**
 * Clears all subtask entries displayed in HTML.
 */
function clearShowSubtasks() {
  const showSubtasks = document.getElementById("showsubtasks");

  while (showSubtasks.firstChild) {
    showSubtasks.removeChild(showSubtasks.firstChild);
  }
}

/**
 * Resets the category section to default state.
 */
function resetCategorySection() {
  const categoryDropdown = document.getElementById("categoryAddTask");
  categoryDropdown.selectedIndex = 0;
  categoryDropdown.style.borderColor = "#D1D1D1";
  categoryDropdown.onchange = handleCategoryChange;
}

/**
 * Toggles the assign to dropdown menu.
 */
function toggleAssignTo(event) {
  event.stopPropagation();
  if (dropDownMenu.classList.contains("d-none")) {
    openAssignTo();
  } else {
    closeAssignTo();
  }
}

/**
 * Opens the assign to dropdown menu.
 */
function openAssignTo() {
  let inputAssignedTo = document.querySelector(".input-assignedTo");
  let selectContactsText = document.getElementById("select-contacts");
  dropDownMenu.classList.remove("d-none");
  document.getElementById("assignedUser").classList.add("d-none");
  document.getElementById("arrowdown").classList.add("d-none");
  document.getElementById("arrowup").classList.remove("d-none");
  inputAssignedTo.style.border = "1px solid #29ABE2";
  selectContactsText.innerHTML = "";
  renderContacts();
  renderAssignedContacts();
  restoreSelectedContacts();

  document.addEventListener("click", handleClickOutside);
}

/**
 * Closes the assign to dropdown menu.
 */

function closeAssignTo() {
  let inputAssignedTo = document.querySelector(".input-assignedTo");
  let selectContactsText = document.getElementById("select-contacts");

  dropDownMenu.classList.add("d-none");
  document.getElementById("assignedUser").classList.remove("d-none");
  document.getElementById("arrowup").classList.add("d-none");
  document.getElementById("arrowdown").classList.remove("d-none");
  inputAssignedTo.style.border = "";
  selectContactsText.innerHTML = "Select contacts to assign";

  document.removeEventListener("click", handleClickOutside);
}

/**
 * Renders assigned contacts.
 */
function renderAssignedContacts() {
  renderAssignedUser(assignedUser);
}

/**
 * Restores selected contacts from local storage.
 */
function restoreSelectedContacts() {
  let selectedContactsFromStorage = localStorage.getItem("selectedContacts");
  if (selectedContactsFromStorage) {
    selectedContacts = selectedContactsFromStorage;
    selectedContacts.forEach((contact) => {
      let index = contacts.findIndex((c) => c.name === contact.name);
      if (index !== -1) {
        let contactElement = document.getElementById(`contact${index}`);
        contactElement.classList.add("contactSelected");
        let checkbox = document.getElementById(`checkbox${index}`);
        checkbox.src = "./assets/img/addTask_AssignTo_Checkbox_Checked.svg";
      }
    });
  }
}

/**
 * Renders contacts in the assign to dropdown menu.
 */
function renderContacts() {
  let assignList = document.getElementById("assignToList");
  assignList.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let badgeColor = contact.color;
    assignToList.innerHTML += getassignListHTML(contact, badgeColor, i);
  }
}

/**
 * Handles assigning a contact to a task.
 */
function assignContact(i, contactName) {
  let contact = document.getElementById(`contact${i}`);
  let checkbox = document.getElementById(`checkbox${i}`);
  contact.classList.toggle("contactSelected");
  let isSelected = contact.classList.contains("contactSelected");

  if (isSelected) {
    checkbox.src = "./assets/img/addTask_AssignTo_Checkbox_Checked.svg";
    selectedContacts.push(contacts[i]);
    addToAssignedUser(contacts[i]);
  } else {
    unassignContacts(contactName, checkbox);
  }
  saveSelectedContacts();
}

/**
 * Adds assigned contact to assigned user section.
 */
function addToAssignedUser(contact) {
  assignedContacts.push(contact);
  renderAssignedUser(assignedUser);
}

/**
 * Handles unassigning contacts from a task.
 */
function unassignContacts(contactName, checkbox) {
  checkbox.src = "./assets/img/addTask_AssignTo_Checkbox.svg";
  let selectedContactIndex = findSelectedIndex(contactName);
  selectedContacts.splice(selectedContactIndex, 1);
  removeFromAssignedList(selectedContactIndex);
}

/**
 * Finds the index of a selected contact.
 */
function findSelectedIndex(contactName) {
  return selectedContacts.findIndex(
    (contact) => contact["name"] === contactName
  );
}

/**
 * Removes a contact from the assigned list.
 */
function removeFromAssignedList(selectedContactIndex) {
  assignedContacts.splice(selectedContactIndex, 1);
  renderAssignedUser(assignedUser);
  saveSelectedContacts();
}

/**
 * Clears assigned users and selected contacts.
 */
function clearAssignedUser() {
  assignedContacts = [];
  selectedContacts = [];
  renderAssignedUser(assignedUser);
  document.querySelectorAll(".checkbox").forEach(function (checkbox) {
    checkbox.src = "./assets/img/addTask_AssignTo_Checkbox.svg";
  });
  let contactsElements = document.querySelectorAll(".assignListContact");
  contactsElements.forEach(function (contact) {
    contact.classList.remove("contactSelected");
  });
}
