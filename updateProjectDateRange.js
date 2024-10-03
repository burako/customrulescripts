//updates a projects date ranges according to the task dates in the project where the earliest date becomes the start date of the project and latest date becomes the due date of the project

let main = async (project_gid) => {
    let allTasks = await tasksApiInstance.getTasksForProject(project_gid, {
      opt_fields: "start_on,due_on",
    });
    let minStartDate = null;
    let maxEndDate = null;
    for (let task of allTasks.data) {
      let task_start = task.start_on || task.due_on;
      if (!minStartDate && task_start) {
        minStartDate = task_start;
      } else if (task_start < minStartDate) {
        minStartDate = task_start;
      }
      if (!maxEndDate && task.due_on) {
        maxEndDate = task.due_on;
      } else if (task.due_on > maxEndDate) {
        maxEndDate = task.due_on;
      }
    }
  
    let newProjectData = {};
    if (minStartDate && minStartDate < maxEndDate) {
      newProjectData.start_on = minStartDate;
    } else {
      newProjectData.start_on = null;
    }
    if (maxEndDate) {
      newProjectData.due_on = maxEndDate;
    }
  
    await projectsApiInstance.updateProject(
      { data: newProjectData },
      project_gid
    );
  };
  
  main(project_gid);
