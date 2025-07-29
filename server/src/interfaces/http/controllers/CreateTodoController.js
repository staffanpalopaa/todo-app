import express from 'express';
import CreateTodoCommand from '../../../domain/command/CreateTodoCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { todoTitle, description, dueDate, priority, category } = req.body;
    const result = await CreateTodoCommand.execute({
      todoTitle,
      description,
      dueDate,
      priority,
      category,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/create-todo',
  router,
};