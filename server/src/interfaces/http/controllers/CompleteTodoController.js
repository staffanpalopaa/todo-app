import express from 'express';
import CompleteTodoCommand from '../../../domain/command/CompleteTodoCommand.js';

const router = express.Router();
const routeBase = '/complete-todo';

router.post('/', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Todo ID is required.' });
    }

    const result = await CompleteTodoCommand.execute({ id });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase,
  router,
};