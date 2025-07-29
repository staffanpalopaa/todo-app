import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class DeleteTodoCommand {
  static async execute({ todoID, deletionReason }) {
    const todoData = await db.findById('Todo', todoID);

    if (!todoData) {
      throw new Error(`Todo with ID '${todoID}' not found.`);
    }

    const todo = new Todo(todoData);
    todo.deletionReason = deletionReason;

    await db.update('Todo', todo.todoID, todo.toJSON());

    return todo.toJSON();
  }
}

export default DeleteTodoCommand;