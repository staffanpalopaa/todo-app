import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'create-todo-given-user-wants-new-task.feature'));

defineFeature(feature, test => {
  let response;
  let todoId;
  let todoDescription;
  let todoDueDate;
  let todoPriority;

  test(
    'Given the user wants to add a new task, when the user creates a Todo with a description, then a Todo Created event is recorded and the todo becomes available.',
    ({ given, when, then }) => {
      given('the user wants to add a new task', async () => {
        // No specific setup needed for this given step as it describes user intent.
      });

      when('the user creates a Todo with a description', async () => {
        todoId = `todo-${Date.now()}`;
        todoDescription = 'Perform a deep dive into advanced DDD patterns';
        todoDueDate = '2025-09-15'; // Example due date, format YYYY-MM-DD as per OpenAPI example
        todoPriority = 'High'; // Example priority

        response = await request(app)
          .post('/api/v1/create-todo')
          .send({
            id: todoId,
            description: todoDescription,
            dueDate: todoDueDate,
            priority: todoPriority,
          });
      });

      then('a Todo Created event is recorded and the todo becomes available.', async () => {
        // Assert the direct response from the creation
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
          expect.objectContaining({
            id: todoId,
            description: todoDescription,
            dueDate: todoDueDate,
            priority: todoPriority,
            isCompleted: 'false', // As per OpenAPI Todo schema example, default value
          }),
        );

        // Verify availability by fetching all todos
        const getResponse = await request(app)
          .get('/api/v1/get-all-todos');

        expect(getResponse.statusCode).toBe(200);
        expect(Array.isArray(getResponse.body)).toBe(true);
        expect(getResponse.body.length).toBeGreaterThanOrEqual(1);

        const createdTodoInList = getResponse.body.find(todo => todo.id === todoId);
        expect(createdTodoInList).toBeDefined();
        expect(createdTodoInList).toEqual(
          expect.objectContaining({
            id: todoId,
            description: todoDescription,
            dueDate: todoDueDate,
            priority: todoPriority,
            isCompleted: 'false',
          }),
        );
      });
    }
  );
});