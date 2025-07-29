import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class UpdateTodoCommand {
  /**
   * Executes the command to update an existing Todo item.
   * @param {object} params - The parameters for updating the Todo.
   * @param {string} params.todoID - The unique identifier of the Todo to update.
   * @param {string} [params.todoTitle] - The new title for the Todo.
   * @param {string} [params.description] - The new description for the Todo.
   * @param {string} [params.dueDate] - The new due date for the Todo (e.g., 'YYYY-MM-DD').
   * @param {string} [params.priority] - The new priority for the Todo (e.g., 'High', 'Medium', 'Low').
   * @param {string} [params.category] - The new category for the Todo.
   * @returns {Promise<object>} The updated Todo item as a plain object.
   * @throws {Error} If the Todo with the given ID is not found.
   */
  static async execute({ todoID, todoTitle, description, dueDate, priority, category }) {
    if (!todoID) {
      throw new Error('Todo ID is required for update operation.');
    }

    // Find the existing todo data
    const existingData = await db.findById('Todo', todoID);

    if (!existingData) {
      throw new Error(`Todo with ID ${todoID} not found.`);
    }

    // Create a Todo entity instance from the existing data
    const todo = new Todo(existingData);

    // Update the properties of the entity instance only if new values are provided
    if (todoTitle !== undefined) {
      todo.todoTitle = todoTitle;
    }
    if (description !== undefined) {
      todo.description = description;
    }
    if (dueDate !== undefined) {
      todo.dueDate = dueDate;
    }
    if (priority !== undefined) {
      todo.priority = priority;
    }
    if (category !== undefined) {
      todo.category = category;
    }

    // Update the database with the modified entity's data
    // Assuming db.update takes the entity name, its unique ID, and the updated data object
    await db.update('Todo', todo.todoID, todo.toJSON());

    // Return the updated todo item
    return todo.toJSON();
  }
}

export default UpdateTodoCommand;