import { v4 as uuidv4 } from 'uuid';
import db from '../../infrastructure/db/index.js';

class CreateTodoCommand {
  static async execute({ toDoTitle, description, dueDate, priorityLevel, category, tags }) {
    const todo = {
      toDoID: uuidv4(),
      toDoTitle,
      description,
      dueDate,
      priorityLevel,
      category,
      tags
    };
    await db.insert('ToDo', todo);
    return todo;
  }
}

export default CreateTodoCommand;