// Calculates the task comletion percentage in a project and updates a custom field on a project level (a field that is visible in a portfolio)
// Useful if you need to use this value in a formula field for example. Ootb task progress shown in the portfolio can't be used in formula

// Define a function to fetch tasks in a project
const getTasksInProject = async (projectId) => {
    try {
      const tasks = await tasksApiInstance.getTasksForProject(projectId, { opt_fields: 'completed' });
      return tasks.data;
      
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  };
  
  // Define a function to calculate the percentage of completed tasks
  const calculateCompletedTasksPercentage = (tasks) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    return (completedTasks / totalTasks);
  };
  
  const updateCustomFieldValue = async (value) => {
     const updatedTaskProgress = {
         "data": {"custom_fields": {"<YOUR_progress_custom_field_gid>" : value}}
        };
    projectsApiInstance.updateProject(updatedTaskProgress, project_gid);
  };
  
  // Main function to calculate the percentage of completed tasks and update the custom field
  const main = async () => {
    const tasks = await getTasksInProject(project_gid);
    if (tasks.length > 0) {
      const completedPercentage = calculateCompletedTasksPercentage(tasks);
      await updateCustomFieldValue(completedPercentage);
    } else {
      console.log('No tasks found for the given project.');
    }
  };
  // Run the main function
  main();
      
