import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'complete-todo-given-existing-active-todo.feature'));

defineFeature(feature, test => {
  let createdTodoId;
  let createTodoResponse;
  let completeTodoResponse;

  test(
    'Given an existing active Todo, when the user completes the Todo, then a Todo Completed event is recorded and the todo is marked as completed.',
    ({ given, when, then }) => {
      given('an existing active Todo', async () => {
        createdTodoId = `todo-${Date.now()}`;
        const createTodoPayload = {
          id: createdTodoId,
          description: 'Prepare presentation for meeting',
          dueDate: '2025-09-15',
          priority: 'High',
        };

        createTodoResponse = await request(app)
          .post('/api/v1/create-todo')
          .send(createTodoPayload)
          .expect(200);

        expect(createTodoResponse.body.id).toBe(createdTodoId);
        expect(createTodoResponse.body.isCompleted).toBe('false');
      });

      when('the user completes the Todo', async () => {
        const completeTodoPayload = {
          id: createdTodoId,
        };

        completeTodoResponse = await request(app)
          .post('/api/v1/complete-todo')
          .send(completeTodoPayload)
          .expect(200);
      });

      then('a Todo Completed event is recorded and the todo is marked as completed.', async () => {
        expect(completeTodoResponse.body.id).toBe(createdTodoId);
        expect(completeTodoResponse.body.isCompleted).toBe('true');
      });
    }
  );
});