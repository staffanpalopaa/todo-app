import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'Given_a_task_exists_for_the_user_when_the_user_issues_a_Delete_Task_command_for_that_task_then_a_Task_Deleted_event_is_emitted_and_the_task_is_no_longer_visible_in_the_users_task_list.feature'));

defineFeature(feature, test => {
  let appInstance;
  let createdTask;
  let deleteTaskResponse;

  beforeAll(() => {
    appInstance = request(app);
  });

  test(
    "Given a task exists for the user, when the user issues a 'Delete Task' command for that task, then a 'Task Deleted' event is emitted and the task is no longer visible in the user's task list.",
    ({ given, when, then }) => {
      given('a task exists for the user', async () => {
        const createResponse = await appInstance.post('/api/v1/create-task')
          .send({
            taskTitle: `Task to Delete ${Date.now()}`,
            taskDescription: 'This task will be deleted.',
            dueDate: '2025-12-31',
            priorityLevel: 'Low',
            categoryTags: 'Test, Delete'
          });

        expect(createResponse.statusCode).toBe(200);
        expect(createResponse.body).toHaveProperty('taskID');
        expect(createResponse.body.taskTitle).toBe(`Task to Delete ${Date.now()}`);
        createdTask = createResponse.body;
      });

      when("the user issues a 'Delete Task' command for that task", async () => {
        deleteTaskResponse = await appInstance.post('/api/v1/delete-task')
          .send({
            taskID: createdTask.taskID,
            confirmDeletion: "true",
            reasonForDeletion: "No longer needed for testing purposes",
            archivedStatus: "false"
          });
      });

      then("a 'Task Deleted' event is emitted and the task is no longer visible in the user's task list", async () => {
        expect(deleteTaskResponse.statusCode).toBe(200);
        expect(deleteTaskResponse.body).toHaveProperty('taskID', createdTask.taskID);
        expect(deleteTaskResponse.body.currentStatus).toBe('Deleted');
        expect(deleteTaskResponse.body.reasonForDeletion).toBe("No longer needed for testing purposes");

        // Verify task is no longer visible in the list
        const listAllTasksResponse = await appInstance.get('/api/v1/list-all-tasks');
        expect(listAllTasksResponse.statusCode).toBe(200);

        const tasks = listAllTasksResponse.body;
        const foundDeletedTask = tasks.find(task => task.taskID === createdTask.taskID);
        expect(foundDeletedTask).toBeUndefined(); // The task should not be found in the list
      });
    }
  );
});