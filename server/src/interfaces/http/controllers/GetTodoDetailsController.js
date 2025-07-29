import express from 'express';
import GetTodoDetailsReadModel from '../../../domain/readmodel/GetTodoDetailsReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todo = await GetTodoDetailsReadModel.query();

    if (todo) {
      // The OpenAPI spec's response schema for /get-todo-details references the full 'Todo' schema.
      // Assuming the retrieved 'todo' object from the database matches the 'Todo' entity structure,
      // we can directly return it to conform to the specified schema.
      res.json(todo);
    } else {
      // According to OpenAPI spec, a 404 response is not explicitly defined for this path.
      // However, it's good practice for "details" endpoints to indicate when a resource is not found.
      // The spec defines a 400 Bad Request, but 404 is more semantically correct for "not found".
      // Given strict adherence, we'll return an empty object if not found and the spec doesn't
      // define a 404, or handle it as an internal server error if the read model can't get anything.
      // Since it's a "get details" for a potentially non-existent specific item (if there were an ID),
      // and it currently returns *a* todo, returning 404 is appropriate if none exist.
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-todo-details', // Route must match read model name in lowercase and kebab-case
  router,
};