import express from 'express';
import CreateTaskCommand from '../../../domain/command/CreateTaskCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { taskTitle, taskDescription, dueDate, priorityLevel, categoryTags } = req.body;
    const result = await CreateTaskCommand.execute({
      taskTitle,
      taskDescription,
      dueDate,
      priorityLevel,
      categoryTags,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/create-task',
  router,
};