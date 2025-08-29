import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, './create-todo-given-no-todo-exists.feature'));

defineFeature(feature, test => {
  let createdTodoId;
  let createTodoResponse;
  let todoListResponse;

  test(
    "Given no todos exist. When the User issues a 'Create Todo' command with a title. Then a 'Todo Created' event is recorded, and the new todo appears in the list.",
    ({ given, when, then, and }) => {
      given('no todos exist', async () => {
        const listResponse = await request(app).get('/api/v1/todo-list');
        expect(listResponse.statusCode).toBe(200);

        for (const todo of listResponse.body) {
          const deleteResponse = await request(app)
            .post('/api/v1/delete-todo')
            .send({ todoID: todo.todoID });
          expect(deleteResponse.statusCode).toBe(200);
        }

        const emptyListResponse = await request(app).get('/api/v1/todo-list');
        expect(emptyListResponse.statusCode).toBe(200);
        expect(emptyListResponse.body).toEqual([]);
      });

      when("the User issues a 'Create Todo' command with a title 'My New Todo'", async () => {
        createTodoResponse = await request(app)
          .post('/api/v1/create-todo')
          .send({
            title: 'My New Todo',
          });
      });

      then("a 'Todo Created' event is recorded", async () => {
        expect(createTodoResponse.statusCode).toBe(200);
        expect(createTodoResponse.body).toHaveProperty('todoID');
        expect(createTodoResponse.body.title).toBe('My New Todo');
        createdTodoId = createTodoResponse.body.todoID;
      });

      and('the new todo appears in the list', async () => {
        todoListResponse = await request(app).get('/api/v1/todo-list');
        expect(todoListResponse.statusCode).toBe(200);
        expect(todoListResponse.body.length).toBe(1);
        expect(todoListResponse.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              todoID: createdTodoId,
              title: 'My New Todo',
            }),
          ])
        );
      });
    }
  );
});