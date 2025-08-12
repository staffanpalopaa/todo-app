import Task from '../entity/Task.js';
import db from '../../infrastructure/db/index.js';
import eventEmitter from '../../infrastructure/event/eventEmitter.js';

class CompleteTaskCommand {
  static async execute({ taskID, completionNotes, timeSpent, actualCompletionDate, satisfactionRating }) {
    const existingTaskData = await db.findById('Task', taskID);

    if (!existingTaskData) {
      throw new Error(`Task with ID ${taskID} not found.`);
    }

    const task = new Task(existingTaskData);

    task.currentStatus = 'Completed';
    task.completionNotes = completionNotes;
    task.timeSpent = timeSpent;
    task.actualCompletionDate = actualCompletionDate;
    task.satisfactionRating = satisfactionRating;

    await db.update('Task', taskID, task.toJSON());

    // Emit 'Task Completed' event
    eventEmitter.emit('TaskCompleted', {
      taskID: task.id,
      status: task.currentStatus,
      completionNotes: task.completionNotes,
      timeSpent: task.timeSpent,
      actualCompletionDate: task.actualCompletionDate,
      satisfactionRating: task.satisfactionRating,
    });

    return task.toJSON();
  }
}

export default CompleteTaskCommand;