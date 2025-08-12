import express from 'express';
import DeleteTaskCommand from '../../../domain/command/DeleteTaskCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { taskID, confirmDeletion, reasonForDeletion, archivedStatus } = req.body;

    const result = await DeleteTaskCommand.execute({
      taskID,
      confirmDeletion,
      reasonForDeletion,
      archivedStatus,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/delete-task',
  router,
};