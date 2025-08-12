import db from '../../infrastructure/db/index.js';

class ListAllTasksReadModel {
  static async query() {
    const tasks = await db.findAll('Task');

    // Project the fields to match the OpenAPI response schema for List All Tasks
    return tasks.map(task => ({
      taskTitle: task.taskTitle || '',
      taskDescription: task.taskDescription || '',
      currentStatus: task.currentStatus || '',
      createdDate: task.createdDate || '',
      lastModifiedDate: task.lastModifiedDate || '',
      subtaskCount: task.subtaskCount || '',
      projectLink: task.projectLink || ''
    }));
  }
}

export default ListAllTasksReadModel;