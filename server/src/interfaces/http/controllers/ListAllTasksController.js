import express from 'express';
import ListAllTasksReadModel from '../../../domain/readmodel/ListAllTasksReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tasks = await ListAllTasksReadModel.query();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default {
  routeBase: '/list-all-tasks',
  router,
};