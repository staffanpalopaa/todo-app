import Task from '../entity/Task.js';
import db from '../../infrastructure/db/index.js';
import { v4 as uuidv4 } from 'uuid';
import DomainEventPublisher from '../event/DomainEventPublisher.js';
import TaskCreatedEvent from '../event/TaskCreatedEvent.js';

class CreateTaskCommand {
  static async execute({ taskTitle, taskDescription, dueDate, priorityLevel, categoryTags }) {
    const task = new Task({
      taskID: uuidv4(),
      taskTitle,
      taskDescription,
      dueDate,
      priorityLevel,
      categoryTags,
      currentStatus: 'Pending',
      completionNotes: '',
      timeSpent: '',
      actualCompletionDate: '',
      satisfactionRating: '',
      reasonForDeletion: '',
      archivedStatus: 'false',
    });

    await db.insert('Task', task.toJSON());

    DomainEventPublisher.publish(new TaskCreatedEvent(task.toJSON()));

    return task.toJSON();
  }
}

export default CreateTaskCommand;