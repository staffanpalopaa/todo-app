import express from 'express';
import CompleteTaskCommand from '../../../domain/command/CompleteTaskCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { taskID, completionNotes, timeSpent, actualCompletionDate, satisfactionRating } = req.body;

    const result = await CompleteTaskCommand.execute({
      taskID,
      completionNotes,
      timeSpent,
      actualCompletionDate,
      satisfactionRating,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/complete-task',
  router,
};