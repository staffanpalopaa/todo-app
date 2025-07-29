import express from 'express';
import UpdateTodoCommand from '../../../domain/command/UpdateTodoCommand.js';

const router = express.Router();

/**
 * @api {post} /update-todo Update Todo
 * @apiName UpdateTodo
 * @apiGroup Commands
 * @apiBody {string} todoID The unique identifier of the Todo to update.
 * @apiBody {string} [todoTitle] The new title for the Todo.
 * @apiBody {string} [description] The new description for the Todo.
 * @apiBody {string} [dueDate] The new due date for the Todo (e.g., 'YYYY-MM-DD').
 * @apiBody {string} [priority] The new priority for the Todo (e.g., 'High', 'Medium', 'Low').
 * @apiBody {string} [category] The new category for the Todo.
 * @apiSuccess (200) {object} todo The updated Todo object.
 * @apiError (400) {object} error Bad Request.
 * @apiError (404) {object} error Not Found if the todoID does not exist.
 */
router.post('/', async (req, res) => {
  try {
    const { todoID, todoTitle, description, dueDate, priority, category } = req.body;

    const result = await UpdateTodoCommand.execute({
      todoID,
      todoTitle,
      description,
      dueDate,
      priority,
      category,
    });

    res.status(200).json(result);
  } catch (err) {
    if (err.message.includes('not found')) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
});

export default {
  routeBase: '/update-todo',
  router,
};