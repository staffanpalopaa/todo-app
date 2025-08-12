import express from 'express';
import ListActiveTasksReadModel from '../../../domain/readmodel/ListActiveTasksReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const activeTasks = await ListActiveTasksReadModel.query();
    res.json(activeTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default {
  routeBase: '/list-active-tasks',
  router,
};