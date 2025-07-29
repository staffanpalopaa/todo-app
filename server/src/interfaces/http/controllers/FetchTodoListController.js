import express from 'express';
import FetchTodoListReadModel from '../../../domain/readmodel/FetchTodoListReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todos = await FetchTodoListReadModel.query();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default {
  routeBase: '/fetch-todo-list',
  router,
};