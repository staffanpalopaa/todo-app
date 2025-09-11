import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'complete-todo-given-an-existing-active-todo.feature'));

defineFeature(feature, test => {
  let todoId;
  let todoDescription;
  let todoDueDate;
  let todoPriority;
  let apiResponse;

  test(
    'Given an existing active Todo, when the user completes the Todo, then a Todo Completed event is recorded and the todo is marked as completed.',
    ({ given, when, then }) => {
      given('an existing active Todo', async () => {
        todoId = `todo-${Date.now()}`;
        todoDescription = 'Prepare for the monthly sprint review';
        todoDueDate = '2025-10-15';
        todoPriority = 'High';

        const createTodoRequest = {
          id: todoId,
          description: todoDescription,
          dueDate: todoDueDate,
          priority: todoPriority,
        };

        const response = await request(app)
          .post('/api/v1/create-todo')
          .send(createTodoRequest)
          .expect(200);
        
        expect(response.body).toBeDefined();
        expect(response.body.id).toEqual(todoId);
        expect(response.body.isCompleted).toEqual('false'); // Ensure it is created as active
      });

      when('the user completes the Todo', async () => {
        const completeTodoRequest = {
          id: todoId,
        };

        apiResponse = await request(app)
          .post('/api/v1/complete-todo')
          .send(completeTodoRequest)
          .expect(200);
      });

      then('a Todo Completed event is recorded and the todo is marked as completed.', async () => {
        expect(apiResponse.body).toBeDefined();
        expect(apiResponse.body.id).toEqual(todoId);
        expect(apiResponse.body.description).toEqual(todoDescription);
        expect(apiResponse.body.dueDate).toEqual(todoDueDate);
        expect(apiResponse.body.priority).toEqual(todoPriority);
        expect(apiResponse.body.isCompleted).toEqual('true'); // Verify it is marked as completed
      });
    }
  );
});