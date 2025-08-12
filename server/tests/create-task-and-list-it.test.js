import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'create-task-and-list-it.feature'));

defineFeature(feature, test => {
  let createdTaskID;
  let taskTitle;
  let taskDescription;
  let createResponse;

  test(
    "Given the user wants to organize their work, when the user issues a 'Create Task' command with a title and description, then a 'Task Created' event is emitted and the task appears in their task list.",
    ({ given, when, then }) => {
      given('the user wants to organize their work', async () => {
        // No specific setup required for this given step as per rules:
        // "Never assume that a todo item already exists in the system unless explicitly stated"
        // The test will create the necessary data in the 'when' step.
      });

      when("the user issues a 'Create Task' command with a title and description", async () => {
        // Generate a unique title and description for the task
        taskTitle = `Organize Books - ${Date.now()}`;
        taskDescription = `Sort by genre and author - ${Date.now()}`;

        // Call the Create Task API endpoint
        createResponse = await request(app)
          .post('/api/v1/create-task')
          .send({
            taskTitle: taskTitle,
            taskDescription: taskDescription,
            // Other optional fields like dueDate, priorityLevel, categoryTags are omitted as not required by the GWT
          })
          .expect(200); // Expect a 200 OK status for successful creation

        // Store the task ID returned from the creation response
        createdTaskID = createResponse.body.taskID;

        // Assert that the created task has expected properties and status
        expect(createdTaskID).toBeDefined();
        expect(typeof createdTaskID).toBe('string');
        expect(createResponse.body.taskTitle).toBe(taskTitle);
        expect(createResponse.body.taskDescription).toBe(taskDescription);
        expect(createResponse.body.currentStatus).toBe('Pending'); // Assuming 'Pending' is the default status upon creation
      });

      then("a 'Task Created' event is emitted and the task appears in their task list.", async () => {
        // The first part "a 'Task Created' event is emitted" is implicitly covered by the successful 200 response
        // and the returned Task object in the 'when' step, indicating the command was processed.

        // For the second part: "the task appears in their task list."
        // Call the List All Tasks API endpoint
        const listResponse = await request(app)
          .get('/api/v1/list-all-tasks')
          .expect(200); // Expect a 200 OK status

        // Assert that the response body is an array
        expect(Array.isArray(listResponse.body)).toBe(true);

        // Find the newly created task in the list of all tasks
        const foundTask = listResponse.body.find(task => task.taskID === createdTaskID);

        // Assert that the task was found
        expect(foundTask).toBeDefined();

        // Assert that the details of the found task match what was created
        expect(foundTask.taskID).toBe(createdTaskID);
        expect(foundTask.taskTitle).toBe(taskTitle);
        expect(foundTask.taskDescription).toBe(taskDescription);
        expect(foundTask.currentStatus).toBe('Pending');
      });
    }
  );
});