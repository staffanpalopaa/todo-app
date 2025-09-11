import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, './create-todo-with-description-becomes-available.feature'));

defineFeature(feature, test => {
  let createTodoResponse;
  let newTodoId;
  const newTodoDescription = 'Write a new Cucumber test scenario';
  const newTodoDueDate = '2025-09-15'; // Example future date
  const newTodoPriority = 'High';

  test(
    'Given the user wants to add a new task, when the user creates a Todo with a description, then a Todo Created event is recorded and the todo becomes available.',
    ({ given, when, then }) => {
      given('the user wants to add a new task', async () => {
        newTodoId = uuidv4(); // Generate a unique ID for the new todo
      });

      when('the user creates a Todo with a description', async () => {
        createTodoResponse = await request(app)
          .post('/api/v1/create-todo')
          .send({
            id: newTodoId,
            description: newTodoDescription,
            dueDate: newTodoDueDate,
            priority: newTodoPriority,
          })
          .set('Accept', 'application/json');
      });

      then('a Todo Created event is recorded and the todo becomes available.', async () => {
        // Assert the creation response
        expect(createTodoResponse.statusCode).toBe(200);
        expect(createTodoResponse.body).toBeDefined();
        expect(createTodoResponse.body.id).toBe(newTodoId);
        expect(createTodoResponse.body.description).toBe(newTodoDescription);
        expect(createTodoResponse.body.dueDate).toBe(newTodoDueDate);
        expect(createTodoResponse.body.priority).toBe(newTodoPriority);
        // isCompleted should be 'false' for a newly created todo as per spec examples
        expect(createTodoResponse.body.isCompleted).toBe('false');

        // Verify the todo is available by querying all todos
        const getAllTodosResponse = await request(app)
          .get('/api/v1/get-all-todos')
          .set('Accept', 'application/json');

        expect(getAllTodosResponse.statusCode).toBe(200);
        expect(Array.isArray(getAllTodosResponse.body)).toBe(true);
        
        const createdTodo = getAllTodosResponse.body.find(
          (todo) => todo.id === newTodoId
        );
        expect(createdTodo).toBeDefined();
        expect(createdTodo.description).toBe(newTodoDescription);
        expect(createdTodo.dueDate).toBe(newTodoDueDate);
        expect(createdTodo.priority).toBe(newTodoPriority);
        expect(createdTodo.isCompleted).toBe('false');
      });
    }
  );
});