import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class CompleteTodoCommand {
  static async execute({ id }) {
    const todoData = await db.findById('Todo', id);

    if (!todoData) {
      throw new Error(`Todo with ID ${id} not found.`);
    }

    const todo = new Todo(todoData);

    if (todo.isCompleted === 'true') {
      throw new Error(`Todo with ID ${id} is already completed.`);
    }

    const updatedTodoData = await db.update('Todo', id, { isCompleted: 'true' });
    return updatedTodoData;
  }
}

export default CompleteTodoCommand;