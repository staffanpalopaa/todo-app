import db from '../../infrastructure/db/index.js';

class FetchTodoListReadModel {
  static async query() {
    const todos = await db.findAll('Todo');
    return todos.map(todo => ({
      todoID: todo.id,
      todoTitle: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      priority: todo.priority,
      category: todo.category,
    }));
  }
}

export default FetchTodoListReadModel;