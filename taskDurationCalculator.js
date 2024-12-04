// calculates business days between a task's dates
// duration is the no of business days between start and due date
// add a number CF called "duration" in your project and the value will be updated every time the script runs

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

function findCustomFieldIdByName(task, namePattern) {
  if (!task.data.custom_fields) {
    throw new Error('No custom fields found in task');
  }

  const customField = task.data.custom_fields.find(field => 
    field.name.toLowerCase().includes(namePattern.toLowerCase())
  );

  if (!customField) {
    throw new Error(`No custom field found containing "${namePattern}"`);
  }

  return customField.gid;
}

async function updateTaskCustomField() {

  try {
    // Get the specific task
    const task = await tasksApiInstance.getTask(task_gid);

    const dueDate = task.data.due_on;
    const startDate = task.data.start_on || null; // Handle tasks without start date

    if (dueDate && startDate) {
      // duration is the no of business days between start and due date
      const duration = calculateBusinessDays(startDate, dueDate);

      // Find custom field IDs dynamically
      const durationFieldId = findCustomFieldIdByName(task, "Duration");
      
      const durationCFValue = {
       "data": {"custom_fields": {[durationFieldId] : duration}}
      };
      
      await tasksApiInstance.updateTask(durationCFValue, task_gid);
      log(`Updated custom field for task ${task.data.name}: ${duration} net duration days`);

    } else {
      log(`Task ${task.data.name} missing start or due date`);
    }

  } catch (error) {
    log('Error updating custom field:', error);
  }
}

updateTaskCustomField();
