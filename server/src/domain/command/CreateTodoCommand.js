import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';
import { v4 as uuidv4 } from 'uuid';

class CreateTodoCommand {
  static async execute({ todoTitle, description, dueDate, priority, category }) {
    const todo = new Todo({
      todoID: uuidv4(),
      todoTitle,
      description,
      dueDate,
      priority,
      category,
      completionDate: null,
      completionNotes: null,
      deletionReason: null,
    });
    await db.insert('Todo', todo.toJSON());
    return todo.toJSON();
  }
}

export default CreateTodoCommand;