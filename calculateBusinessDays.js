// calculates business days between a task's dates
// total effort is the no of business days between start and due date
// planned effort is the no of business days between due date and today
// replace CF_GID with your actual custom field GIDs for respective custom fields.

const calculateBusinessDays = (startDate, endDate) => {
    let count = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        const day = currentDate.getDay();
        if (day !== 0 && day !== 6) { // 0 = Sunday, 6 = Saturday
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
};

// Function to format a date as 'yyyy-mm-dd'
function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function updateTaskCustomField() {

  try {
    // Get the specific task
    const task = await tasksApiInstance.getTask(task_gid);

    const dueDate = task.data.due_on;
    const startDate = task.data.start_on || null; // Handle tasks without start date
    const today = formatDate(new Date());

    if (dueDate && startDate) {
      // total effort is the no of business days between start and due date
      const totalEffort = calculateBusinessDays(startDate, dueDate);
      // planned effort is the no of business days between due date and today
      const plannedEffort = calculateBusinessDays(startDate, today);
      
      // Update the custom field value. replace CF_GID with your actual custom field GIDs for respective custom fields.
      const totalEffortCFValue = {
       "data": {"custom_fields": {"<CF_GID>" : totalEffort}}
      };
      const plannedEffortCFValue = {
       "data": {"custom_fields": {"<CF_GID>" : plannedEffort}}
      };

      await tasksApiInstance.updateTask(totalEffortCFValue, task_gid);
      log(`Updated custom field for task ${task.data.name}: ${totalEffort} net total effort days`);

      await tasksApiInstance.updateTask(plannedEffortCFValue, task_gid);
      log(`Updated custom field for task ${task.data.name}: ${plannedEffort} net planned effort days`);
      
    } else {
      log(`Task ${task.data.name} missing start or due date`);
    }
      
  } catch (error) {
    log('Error updating custom field:', error);
  }
}

updateTaskCustomField();
