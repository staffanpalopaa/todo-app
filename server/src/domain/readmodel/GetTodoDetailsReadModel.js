import db from '../../infrastructure/db/index.js';

class GetTodoDetailsReadModel {
  static async query() {
    // The OpenAPI specification for /get-todo-details does not define any parameters.
    // To fulfill the "one-to-one" cardinality without a specific ID,
    // this implementation fetches all todos and returns the first one found,
    // or null if no todos exist, aligning with the "details" concept for a single item.
    const todos = await db.findAll('Todo'); // Assuming 'Todo' is the entity name for todos
    return todos.length > 0 ? todos[0] : null;
  }
}

export default GetTodoDetailsReadModel;