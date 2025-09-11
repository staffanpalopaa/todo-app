import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'delete-todo-given-an-existing-todo.feature'));

defineFeature(feature, test => {
  let todoId;
  let deleteTodoResponse;
  let getAllTodosResponse;

  test(
    'Given an existing Todo, when the user deletes the Todo, then a Todo Deleted event is recorded and the todo is no longer available.',
    ({ given, when, then }) => {
      given('an existing Todo', async () => {
        const createTodoRequest = {
          id: 'delete-scenario-todo-123',
          description: 'A test todo to be deleted',
          dueDate: '2025-12-31',
          priority: 'High',
        };

        const response = await request(app)
          .post('/api/v1/create-todo')
          .send(createTodoRequest)
          .expect(200);

        todoId = response.body.id;
        expect(response.body.id).toBe(createTodoRequest.id);
        expect(response.body.description).toBe(createTodoRequest.description);
        expect(response.body.dueDate).toBe(createTodoRequest.dueDate);
        expect(response.body.priority).toBe(createTodoRequest.priority);
      });

      when('the user deletes the Todo', async () => {
        const deleteRequest = {
          id: todoId,
        };

        deleteTodoResponse = await request(app)
          .post('/api/v1/delete-todo')
          .send(deleteRequest)
          .expect(200);
      });

      then('a Todo Deleted event is recorded and the todo is no longer available.', async () => {
        // Assert the deletion response
        expect(deleteTodoResponse.status).toBe(200);
        // Per OpenAPI spec, the deleted Todo object is returned
        expect(deleteTodoResponse.body.id).toBe(todoId);

        // Verify the todo is no longer available by fetching all todos
        getAllTodosResponse = await request(app)
          .get('/api/v1/get-all-todos')
          .expect(200);

        const todos = getAllTodosResponse.body;
        const foundTodo = todos.find(todo => todo.id === todoId);

        // The deleted todo should not be in the list
        expect(foundTodo).toBeUndefined();
      });
    }
  );
});