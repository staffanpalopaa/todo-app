import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';
import { v4 as uuid } from 'uuid';

class CreateTodoCommand {
  static async execute({ id, description, dueDate, priority }) {
    const todoId = id || uuid();

    const todo = new Todo({
      id: todoId,
      description,
      dueDate,
      priority,
      isCompleted: 'false',
    });

    await db.insert('Todo', todo.toJSON());
    return todo.toJSON();
  }
}

export default CreateTodoCommand;