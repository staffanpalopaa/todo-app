import express from 'express';
import DeleteTodoCommand from '../../../domain/command/DeleteTodoCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { todoID, deletionReason } = req.body;

    if (!todoID || !deletionReason) {
      return res.status(400).json({ message: 'Both todoID and deletionReason are required.' });
    }

    const result = await DeleteTodoCommand.execute({ todoID, deletionReason });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/delete-todo',
  router,
};