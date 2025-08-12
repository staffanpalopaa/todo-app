import Task from '../entity/Task.js';
import db from '../../infrastructure/db/index.js';
import DomainEvents from '../events/DomainEvents.js';
import TaskDeletedEvent from '../events/TaskDeletedEvent.js';

class DeleteTaskCommand {
  static async execute({ taskID, confirmDeletion, reasonForDeletion, archivedStatus }) {
    if (confirmDeletion !== 'true') {
      throw new Error('Deletion not confirmed. Set confirmDeletion to "true" to proceed.');
    }

    const existingTaskData = await db.findById('Task', taskID);

    if (!existingTaskData) {
      throw new Error(`Task with ID ${taskID} not found.`);
    }

    const task = new Task(existingTaskData);
    task.reasonForDeletion = reasonForDeletion;
    task.archivedStatus = archivedStatus;

    await db.update('Task', taskID, task.toJSON());

    // Emit Task Deleted Event
    const taskDeletedEvent = new TaskDeletedEvent(taskID, reasonForDeletion, archivedStatus);
    DomainEvents.emit(taskDeletedEvent.name, taskDeletedEvent);

    return task.toJSON();
  }
}

export default DeleteTaskCommand;