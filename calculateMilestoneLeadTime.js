// Helper function to calculate lead time
function calculateLeadTime(currentMilestone, previousMilestone) {
    const currentDate = new Date(currentMilestone.due_on);
    const previousDate = new Date(previousMilestone.due_on);
    return Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24)) - 1;
}

async function updateMilestoneLeadTimes() {
    try {
        // Fetch all tasks in the project
        let opts = { 
             'opt_fields': "name,due_on,resource_subtype,completed"
        };
      log("project id: " + project_gid);
        const tasksResponse = await tasksApiInstance.getTasksForProject(project_gid, opts);

        // Filter to find only milestones
        const milestones = tasksResponse.data.filter(task => task.resource_subtype === 'milestone' && task.due_on && !task.completed);

        // Sort milestones by due date
        milestones.sort((a, b) => new Date(a.due_on) - new Date(b.due_on))

        // Loop through the remaining milestones and calculate lead time
        for (let i = 1; i < milestones.length; i++) {
            const leadTime = calculateLeadTime(milestones[i], milestones[i - 1]);
log(leadTime);
            // Update the custom field with the calculated lead time
            await tasksApiInstance.updateTask({
                  "data": {"custom_fields": {"<lead_time_cf_gid>": leadTime}}
                  }, milestones[i].gid);

            log(`Updated Lead Time for milestone "${milestones[i].name}" to ${leadTime} days.`);
        }

        log('Lead time update completed.');
    } catch (error) {
        log('Error updating lead times:', error);
    }
}

// Execute the function
updateMilestoneLeadTimes();
