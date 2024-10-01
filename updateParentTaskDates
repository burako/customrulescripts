async function updateParentTaskDates(parentTaskGid) {
  try {
    // Fetch all subtasks of the main task
    const subtasks = await tasksApiInstance.getSubtasksForTask(parentTaskGid);
    let earliestStartDate = null;
    let latestDueDate = null;
    for (let subtask of subtasks.data) {
      // Get each subtask's date details
      let opts = { 
    'opt_fields': "start_on, due_on"
};
      const subtaskDetails = await tasksApiInstance.getTask(subtask.gid, opts);
      if (subtaskDetails.data.start_on) {
        let subtaskStartDate = new Date(subtaskDetails.data.start_on);
        if (!earliestStartDate || subtaskStartDate < earliestStartDate) {
          earliestStartDate = subtaskStartDate;
        }
        if (!latestDueDate || subtaskStartDate > latestDueDate) {
          latestDueDate = subtaskStartDate;
        }
      }
      if (subtaskDetails.data.due_on) {
        let subtaskDueDate = new Date(subtaskDetails.data.due_on);
        if (!earliestStartDate || subtaskDueDate < earliestStartDate) {
          earliestStartDate = subtaskDueDate;
        }
        if (!latestDueDate || subtaskDueDate > latestDueDate) {
          latestDueDate = subtaskDueDate;
        }
      }
    }
    // Update the main task with the earliest start date and latest due date if they exist
    if (earliestStartDate || latestDueDate) {
      const updatedFields = {};
      // Only update start_on if we have a valid earliestStartDate
      if (earliestStartDate) {
        log(earliestStartDate);
        updatedFields.start_on = earliestStartDate.toISOString().split('T')[0];
      }
      // Always update due_on if we have a valid latestDueDate
      if (latestDueDate) {
        log(latestDueDate);
        updatedFields.due_on = latestDueDate.toISOString().split('T')[0];
      }
      await tasksApiInstance.updateTask({data: updatedFields}, parentTaskGid);
      log('Main task dates updated successfully.');
    } else {
      log('No valid start or due dates found in subtasks.');
    }
  } catch (error) {
    log('Error updating task dates:', error);
  }
}
async function updateTaskDates() {
  try {
    const task = await tasksApiInstance.getTask(task_gid);
    
    if (task.data.parent) {
      log('This is a subtask');
      await updateParentTaskDates(task.data.parent.gid);
    } else {
      log('This is a parent task');
    }
  } catch (error) {
    log('Error determining task type or updating dates:', error);
  }
}
// Run the function to update task dates
updateTaskDates();
