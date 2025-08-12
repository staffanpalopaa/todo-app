import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, './complete-task-user-issues-complete-command.feature'));

defineFeature(feature, test => {
  let taskId;
  let completeTaskResponse;

  test(
    'Given an active task exists for the user, when the user issues a \'Complete Task\' command for that task, then a \'Task Completed\' event is emitted and the task\'s status is updated to completed.',
    ({ given, when, then }) => {
      given('an active task exists for the user', async () => {
        const createTaskRequest = {
          taskTitle: 'Prepare presentation slides for Q3 review',
          taskDescription: 'Finalize content and design for Q3 review meeting.',
          dueDate: '2025-08-15',
          priorityLevel: 'High',
          categoryTags: 'Work, Presentation',
        };

        const response = await request(app)
          .post('/api/v1/create-task')
          .send(createTaskRequest)
          .expect(200);

        taskId = response.body.taskID;
        expect(taskId).toBeDefined();
        expect(response.body.currentStatus).toBe('Pending');
      });

      when('the user issues a \'Complete Task\' command for that task', async () => {
        const completeTaskRequest = {
          taskID: taskId,
          completionNotes: 'All slides completed and reviewed by manager.',
          timeSpent: '4 hours',
          actualCompletionDate: '2025-08-12', // Current date formatted as YYYY-MM-DD
          satisfactionRating: 'Excellent',
        };

        completeTaskResponse = await request(app)
          .post('/api/v1/complete-task')
          .send(completeTaskRequest);
      });

      then('a \'Task Completed\' event is emitted and the task\'s status is updated to completed.', async () => {
        expect(completeTaskResponse.status).toBe(200);
        expect(completeTaskResponse.body.taskID).toBe(taskId);
        expect(completeTaskResponse.body.currentStatus).toBe('Completed');
        expect(completeTaskResponse.body.actualCompletionDate).toBe('2025-08-12');
        expect(completeTaskResponse.body.completionNotes).toBe('All slides completed and reviewed by manager.');
      });
    }
  );
});