/**
 * Generates HTML for a todo element.
 * @param {Object} element - The todo object.
 * @returns {string} - The HTML string representing the todo element.
 */
function generateTodoHTMLBoard(element) {
    let categoryColor = getCategoryColor(element.category); // Get the background color based on the category
 
    if (element['subTasks'].length > 0) {
        let progressBarId = `progress-bar-${element.id}`;
        let completedSubtasksCount = element.subTasks.filter(subtask => subtask.completed).length;
    let totalSubtasksCount = element.subTasks.length;
    let taskCounterText = `${completedSubtasksCount}/${totalSubtasksCount} Subtasks done`;
    let progressBarHTML = /*html*/ `
    <div class="TaskProgressbar" role="progressbar" aria-label="Example with label" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" id="${progressBarId}" style="width: 220px;"></div>
        <div class="Taskcounter">${taskCounterText}</div>
    </div>
`;
    updateProgressBar(element);
    return /*html*/ `
    <div draggable="true" ondrag="startDragging(${element.id})" class="userStoryMini" onclick="openTask(${element.id})"> 
        <div class="taskCategory" style="background-color: ${categoryColor};">${element.category}</div>
            <div class="headerStoryMini">
                <div class="taskTitleMini">${element.title}</div>
                <div class="taskDescription">${element.description}</div>
            </div>
            <div>${progressBarHTML}</div>
        <div class="taskFooter">
            <img src="./assets/img/UserInitials.svg" alt="" class="TaskMembers">
            <img src="./assets/img/medium_orange_AddTask.svg" alt="" class="taskPriority">
        </div>
    </div>
`;
    } else {
        return /*html*/ `
    <div draggable="true" ondrag="startDragging(${element.id})" class="userStoryMini" onclick="openTask(${element.id})"> 
    <div class="taskCategory" style="background-color: ${categoryColor};">${element.category}</div>
            <div>
                <div class="taskTitleMini">${element.title}</div>
                <div class="taskDescription">${element.description}</div>
            </div>
            <div>${progressBarHTML}</div>
        <div class="taskFooter">
            <img src="./assets/img/UserInitials.svg" alt="" class="TaskMembers">
            <img src="./assets/img/medium_orange_AddTask.svg" alt="" class="taskPriority">
        </div>
    </div>
    `;
    }} 

/**
 * Returns the background color based on the category.
 * @param {string} category - The category of the task.
 * @returns {string} - The background color.
 */
function getCategoryColor(category) {
    if (category === 'Technical Story') {
      return 'rgba(31, 215, 193, 1)'; // Set the desired color for Technical Story
    } else if (category === 'User Story') {
      return 'rgba(0, 56, 255, 1)'; // Set the desired color for User Story
    }
    return 'white'; // Default color if the category doesn't match
  }
  
  /**
   * Renders a big task with detailed information.
   * @param {Object} task - The task object to render.
   */
  function renderBigTask(task) {
    let subtasks = '';
    let taskIndex = task["id"];
    if (task['subTasks'] && task['subTasks'].length > 0) {
      for (let i = 0; i < task["subTasks"].length; i++) {
        let subTaskIndex = task["subTasks"][i];
        let imgSrc = subTaskIndex["completed"] ? "./assets/img/check-box-checked.png" : "./assets/img/check-box-disabled.png";
        subtasks += /*html*/ `
            <div class="subtaskContent">
                <div><img src="${imgSrc}" alt="" id="subTaskCheckBox" onclick="changeCompletedBoard(${taskIndex}, ${i})"></div>
                <div>${subTaskIndex["content"]}</div>
            </div>
        `;
      }
    }
    let assignTo = '';
    for (let j = 0; j < task["assignTo"].length; j++) {
      let memberId = task["assignTo"][j];
      if (memberId) {
        assignTo += `<div class="userTask"><div class="initialsBig" style="background-color: ${memberId["color"]}">${memberId["initials"]}</div>${memberId["name"]}</div>`;
      }
    }
    document.getElementById("taskBig").classList.remove("d-none");
    let categoryColor = getCategoryColor(task["category"]); // Get the background color based on the category
    const BigTaskHTML = /*html*/ `
        <div class="bigTask">
            <div class="bigTaskContent">  
                <div class="flexBetweenCenter">
                    <div class="bigTaskCategory" style="background-color: ${categoryColor};">${task["category"]}</div> 
                    <img src="./assets/img/close.png" alt="" onclick="closeTaskBig()">
                </div>
                <div class="taskTitle">${task["title"]}</div>
                <div class="taskDescription">${task["description"]}</div>
                <div class="bigTaskSections">    
                    <div class="bigTaskColor">Due date:</div>
                    <div>${task["dueDate"]}</div>
                </div>
                <div class="bigTaskSections">
                    <div class="bigTaskColor">Priority:</div>
                    <div class="bigTaskPrio">
                        <div>${task['priority']}</div>
                        <div><img src="./assets/img/${task['priority']}_priority.svg" alt=""></div>
                    </div>
                </div>
                <div class="members">
                    <div class="bigTaskColor">Assigned To:</div>
                    <div>${assignTo}</div>
                </div>
                <div class="subTask">
                    <div class="bigTaskColor">Subtasks:</div>
                    <div>${subtasks}</div>
                </div>
                <footer class="taskfooter">
                    <div class="iconTask" onclick="deleteTaskBoard(${task["id"]})">
                        <img src="./assets/img/delete.png" alt="delete">Delete
                    </div>
                    <div class="iconTask" onclick="editTask(${task["id"]})">
                        <img src="./assets/img/edit.svg" alt="edit">Edit
                    </div>
                </footer>
            </div>
        </div>
      `;
  
    document.getElementById("taskBig").innerHTML = BigTaskHTML;
  }
  
function changeCompletedBoard(taskIndex, subTaskIndex) {
    const subTask = taskData[taskIndex].subTasks[subTaskIndex];
    subTask.completed = !subTask.completed;
    renderBigTask(taskData[taskIndex]);
    saveSubtaskBoard(taskData[taskIndex]["id"], taskData[taskIndex]["subTasks"]);
    updateProgressBar(taskData[taskIndex]);
}
/**
 * Renders the add task form.
 * @returns {string} - The HTML for the add task form.
 */
function renderAddTaskForm() {
  return /*html*/ `
        <div class="dialog-content">
            <form id="addTaskForm">
                <!-- Hier die Inhalte der AddTask-Form einfügen -->
                <div id="cardHeadline" >
                    <h2>Add Task</h2>
                    <p id="closeDialogBTN" onclick="closeAddTaskDialog()">&#10005;</p>
                </div>

                <div class="main-addTask">
                    <div class="sections-addTask">
                        <!-- Title -->
                        <section class="input-parts-addTask">
                            <div class="pd-bottom"><span>Title<span class="required-addTask">*</span></span></div>
                            <input id="titleAddTask" type="text" placeholder="Enter a Title" required class="border-input-addtask"/>
                        </section>

                        <!-- Description -->
                        <section class="padding-description">
                            <div class="pd-bottom"><span>Description</span></div>
                            <textarea name="description" id="descriptionAddTask" cols="30" rows="10" placeholder="Enter a Description" class="border-input-addtask"></textarea>
                        </section>

                        <!-- Assigend To -->
                        <section class="padding-description">
                            <div class="pd-bottom"><label>Assigned to</label></div>
                            <div class="">
                                <div id="assignAddTask" name="assignTo" class="input-assignedTo">
                                    <span id="select-contacts">Select contacts to assign</span>
                                    <img class="assignToDDArrow" src="assets/img/arrow_drop_down_AddTask.svg" onclick="openAssignTo()" id="arrowdown" alt="arrowdown"/>
                                    <img src="assets/img/arrow_drop_down_AddTask.svg" onclick="closeAssignTo()" id="arrowup" alt="arrowup"  class="assignToDDArrow rotate d-none"/>
                                </div>
                            </div>
                            <div id="assignToDropdown" class="assignToDropdown assignField d-none">
                            <!-- <input title="assignToFilter" type="text" onkeyup="filterNames()" id="contactSearch" class="assignToContactField">
                                    <img src="assets/img/arrow_drop_down_AddTask.svg" onclick="closeAssignTo()" id="arrowup" alt="arrowup" class="assignToDDArrow rotate"> -->
                                <div id="assignToList" class="assignToDropDownMenu"></div>
                            </div>
                            <div id="assignedUser" class="assignedUserList"></div>
                        </section>
                    </div>

                    <!-- Seperator -->
                    <div><img src="assets/img/seperator_AddTask.svg" alt="seperator" id="seperator" /></div>

                    <!-- Right Part of Add Task -->
                    <div class="sections-addTask">
                        <!-- Due Date -->
                        <section>
                            <div class="pd-bottom"><span>Due Date<span class="required-addTask">*</span></span></div>
                            <input id="dueDate" type="date" placeholder="yyyy/mm/dd" class="input-dueDate border-input-addtask" onchange="checkDueDate()" required/>
                        </section>

                        <!-- Priority -->
                        <section class="padding-prio">
                            <div class="pd-bottom"><span>Prio</span></div>
                            <div class="priority">
                            <button type="button" class="button-prio" id="btnPrioUrgent" onclick="changePriorityColor('urgent')">Urgent
                                <img src="assets/img/urgent_red_AddTask.svg" alt="urgent_red_AddTask"/>
                            </button>                    
                            <button type="button" class="button-prio" id="btnPrioMedium" onclick="changePriorityColor('medium')">Medium
                                <img src="assets/img/medium_orange_AddTask.svg" alt="medium_orange_AddTask"/>
                            </button>                    
                            <button type="button" class="button-prio" id="btnPrioLow" onclick="changePriorityColor('low')">Low
                                <img src="assets/img/low_green_AddTask.svg" alt="low_green_AddTask"/>
                            </button>                    
                            </div>
                        </section>

                        <!-- Category -->
                        <section class="padding-category">
                            <div class="pd-bottom"><span>Category<span class="required-addTask">*</span></span></div>
                            <div class="input-assignedTo border-input-addtask" id="categoryContainer">
                                <select title="category" id="categoryAddTask" class="input-category" onchange="handleCategoryChange(this)" onclick="changeBorderColor()">
                                    <option value="" selected disabled>Select Task Category</option>
                                    <option value="User Story">User Story</option>
                                    <option value="Technical Story">Technical Story</option>
                                </select>
                            </div>
                        </section> 

                        <!-- Subtasks -->
                        <section class="sectionSubtasks">
                            <div class="pd-bottom"><span>Subtasks</span></div>
                            <div class="input-assignedTo border-input-addtask" id="addSubtaskMain" onfocus="handleInputFocus()">
                                <input id="addsubtask" type="text" placeholder="Add new subtasks" class="input-assignedTo border-none">
                                <div onclick="toggleSubtasks()" class="drop-down-image drop-down-subtask">
                                    <img id="plusIcon" src="assets/img/plus_addTask.svg" alt="plus_addTask">
                                </div>
                                <div id="subtasks" class="d-none add-subtasks">
                                    <img onclick="cancelSubtaskClick()" id="cancelSubtask" src="assets/img/subtask_cancel_AddTask.svg" class="subtasks" alt="subtask_cancel_AddTask">
                                    <img src="assets/img/subtask_seperator_AddTask.svg" alt="subtask_seperator_AddTask">
                                    <img onclick="saveSubtask()" id="checkSubtask" src="assets/img/subtask_check_AddTask.svg" class="subtasks" alt="subtask_check_AddTask">
                                </div>
                            </div>
                            <div id="showsubtasks" class="subtasks-list d-none"></div>
                        </section>
                    </div>
                </div>

                <!-- Footer AddTask -->
                <footer class="addtask-footer">
                    <div id="requiredFooter">
                        <span class="required-addTask">*</span>
                        This field is required
                    </div>

                    <div class="footer-btn-addTask">
                        <button onclick="clearEntries()" class="footer-btn-text-img" type="button" id="clear-btn">
                            Clear
                            <img src="assets/img/subtask_cancel_AddTask.svg" alt="subtask_cancel_AddTask">
                        </button>

                        <button onclick="saveTask(id)" class="footer-btn-text-img" type="button" id="create-btn">
                            Create Task
                            <img src="assets/img/create_hook_white_AddTask.svg" alt="create_hook_white_AddTask">
                        </button>
                    </div>
                </footer>
            </form>
        </div>
    `;
}

/**
 * Edits a task.
 * @param {number} id - The ID of the task to edit.
 */
function editTask(id) {
  const todo = taskData.find((todo) => todo.id === id);
  renderEditTaskForm(todo);
}

/**
 * Renders the edit task form.
 * @param {Object} todo - The task object to edit.
 */
function renderEditTaskForm(todo) {
  document.getElementById("taskBig").classList.remove("d-none");
  document.getElementById("taskBig").innerHTML = /*html*/ `
     <div class="bigTask">
      <section class="input-parts-addTask">
       <div class="pd-bottom"><span>Title<span class="required-addTask">*</span></span></div>
       <input id="titleAddTask" type="text" placeholder="Enter a Title" required class="border-input-addtask" value="${todo.title}"/>
      </section>
      <!-- Description -->
      <section class="padding-description">
       <div class="pd-bottom"><span>Description</span></div>
       <textarea name="description" id="descriptionAddTask" cols="30" rows="10" placeholder="Enter a Description" class="border-input-addtask">${todo.description}</textarea>
      </section>
  <!-- Assigend To -->
      <section class="padding-description">
       <div class="pd-bottom"><label>Assigned to</label></div>
       <div class="input-assignedTo border-input-addtask">
       <input id="assignDropDown" type="text" name="assignTo" placeholder="Select contact to assign" class="border-none input-assignedTo"/>
         <div class="drop-down-image-assign">
          <img src="assets/img/arrow_drop_down_AddTask.svg" alt="arrowdown"/> 
         </div>              
        </div>       
        </section>
    <!-- Due Date -->
      <section>
         <div class="pd-bottom"><span>Due Date<span class="required-addTask">*</span></span></div>
         <input id="dueDate" type="date" placeholder="yyyy/mm/dd" class="input-dueDate border-input-addtask" required/>
      </section>
      <!-- Priority -->
      <section class="padding-prio">
          <div class="pd-bottom"><span>Prio</span></div>
          <div class="priority">
              <button type="button" class="button-prio" id="btnPrioUrgent" onclick="changePriorityColor('urgent')">Urgent
                  <img src="assets/img/urgent_red_AddTask.svg" alt="urgent_red_AddTask"/>
              </button>                    
              <button type="button" class="button-prio" id="btnPrioMedium" onclick="changePriorityColor('medium')">Medium
                  <img src="assets/img/medium_orange_AddTask.svg" alt="medium_orange_AddTask"/>
              </button>                    
              <button type="button" class="button-prio" id="btnPrioLow" onclick="changePriorityColor('low')">Low
                  <img src="assets/img/low_green_AddTask.svg" alt="low_green_AddTask"/>
              </button>                    
          </div>
  </section>
          <!-- Category -->
  <section class="padding-category">
      <div class="pd-bottom"><span>Category<span class="required-addTask">*</span></span></div>
      <div class="input-assignedTo border-input-addtask" id="categoryAddTask" onclick="toggleCategoryDropdown()">
          Select Task Category
          <div id="categoryDropDownArrow" class="drop-down-image">
              <img src="assets/img/arrow_drop_down_AddTask.svg" alt="arrow_drop_down_AddTask">
          </div>
      </div>
      <div class="d-none category-menu">
          <div class="category-option" onclick="selectCategory('User Story')">User Story</div>
          <div class="category-option" onclick="selectCategory('Technical Story')">Technical Story</div>
      </div>
  </section>
  <!-- Subtasks -->
  <section>
      <div class="pd-bottom"><span>Subtasks</span></div>
      <div class="input-assignedTo border-input-addtask" id="addSubtaskMain" onfocus="handleInputFocus()">
          <input id="addsubtask" type="text" placeholder="Add new subtasks" class="input-assignedTo border-none">
          <div onclick="toggleSubtasks()" class="drop-down-image drop-down-subtask">
              <img id="plusIcon" src="assets/img/plus_addTask.svg" alt="plus_addTask">
          </div>
          <div id="subtasks" class="d-none add-subtasks">
              <img onclick="cancelSubtaskClick()" id="cancelSubtask" src="assets/img/subtask_cancel_AddTask.svg" class="subtasks" alt="subtask_cancel_AddTask">
              <img src="assets/img/subtask_seperator_AddTask.svg" alt="subtask_seperator_AddTask">
              <img onclick="saveSubtask()" id="checkSubtask" src="assets/img/subtask_check_AddTask.svg" class="subtasks" alt="subtask_check_AddTask">
          </div>
      </div>
             <div id="showsubtasks" class="subtasks-list d-none"></div>
            </section>
   <img src="./assets/img/button_OK.svg" alt="delete" class="iconTask" onclick="saveTask(${todo["id"]})">
  </div>
    `;
}
