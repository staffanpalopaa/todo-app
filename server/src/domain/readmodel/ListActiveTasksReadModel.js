import db from '../../infrastructure/db/index.js';

class ListActiveTasksReadModel {
  static async query() {
    const allTasks = await db.findAll('Task');

    // Filter for active tasks (assuming 'Pending' status indicates active based on Swagger Task schema example)
    const activeTasks = allTasks.filter(task => task.currentStatus === 'Pending');

    // Map to the specific fields required by the OpenAPI spec for the /list-active-tasks endpoint
    const formattedTasks = activeTasks.map(task => ({
      taskTitle: task.taskTitle,
      taskDescription: task.taskDescription,
      currentStatus: task.currentStatus,
      dueDate: task.dueDate,
      priorityLevel: task.priorityLevel,
      timeEstimate: task.timeEstimate, // Assuming this field exists in the underlying data or is null if not.
    }));

    return formattedTasks;
  }
}

export default ListActiveTasksReadModel;