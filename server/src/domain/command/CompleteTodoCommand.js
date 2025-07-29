import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class CompleteTodoCommand {
  static async execute({ todoID, completionDate, completionNotes }) {
    const todoData = await db.findById('Todo', todoID);
    if (!todoData) {
      throw new Error(`Todo with ID ${todoID} not found.`);
    }

    const todo = new Todo(todoData);
    todo.completionDate = completionDate;
    todo.completionNotes = completionNotes;

    await db.update('Todo', todoID, todo.toJSON());
    return todo.toJSON();
  }
}

export default CompleteTodoCommand;