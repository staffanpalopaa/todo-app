import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'delete-todo-given-existing-todo-when-deleted.feature'));

defineFeature(feature, test => {
  let createdTodoId;
  let deleteTodoResponse;
  const createTodoPayload = {
    id: `todo-${Date.now()}-delete-test`, // Ensure unique ID
    description: 'Task to be deleted by the user',
    dueDate: '2025-12-25', // Using example date, current date 2025-09-11T12:03:41.835Z
    priority: 'High',
  };

  test(
    'Given an existing Todo, when the user deletes the Todo, then a Todo Deleted event is recorded and the todo is no longer available.',
    ({ given, when, then }) => {
      given('an existing Todo', async () => {
        const createResponse = await request(app)
          .post('/api/v1/create-todo')
          .send(createTodoPayload);

        expect(createResponse.statusCode).toBe(200);
        expect(createResponse.body).toMatchObject({
          id: createTodoPayload.id,
          description: createTodoPayload.description,
          dueDate: createTodoPayload.dueDate,
          priority: createTodoPayload.priority,
          isCompleted: 'false', // Assuming default for newly created todo from OpenAPI Todo schema example
        });
        createdTodoId = createResponse.body.id;
      });

      when('the user deletes the Todo', async () => {
        const deletePayload = { id: createdTodoId };
        deleteTodoResponse = await request(app)
          .post('/api/v1/delete-todo')
          .send(deletePayload);
      });

      then('a Todo Deleted event is recorded and the todo is no longer available.', async () => {
        // Assert the deletion was successful
        expect(deleteTodoResponse.statusCode).toBe(200);
        expect(deleteTodoResponse.body).toMatchObject({
          id: createdTodoId,
          description: createTodoPayload.description,
          dueDate: createTodoPayload.dueDate,
          priority: createTodoPayload.priority,
          isCompleted: 'false', // Should reflect the state of the todo before deletion
        });

        // Verify the todo is no longer available by checking getAllTodos
        const getAllTodosResponse = await request(app)
          .get('/api/v1/get-all-todos');

        expect(getAllTodosResponse.statusCode).toBe(200);
        const todos = getAllTodosResponse.body;
        const deletedTodoExists = todos.some(todo => todo.id === createdTodoId);
        expect(deletedTodoExists).toBe(false);
      });
    }
  );
});