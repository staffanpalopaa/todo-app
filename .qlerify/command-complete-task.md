
You will receive the following:
- The current folder structure and tech stacks
- Existing command-related code files before changes
- A summary of the command changes

Your Rule:
All request and response schemas, field names, data types, required properties, and descriptions must be strictly derived from the given OpenAPI 3.0.3 specification. Do not invent any data or structure not explicitly defined in the spec. Only implement logic for commands defined in the paths section with HTTP methods
Use only 200 and 400 as response status codes.

Your task:
1. Generate clean, self-contained command code reflecting the latest updates.
2. Do NOT include any unchanged files.
3. Ensure:
   - Only command-related code files can be created/updated/deleted.
   - Place code in: `src/domain/command`, `src/interfaces/http/controllers`
   - Do not touch entity or read model code.
   - Must be self-contained and have no cross-domain dependencies.
   - Use only database functions: insert, findAll, findById, update, remove and clear.
   - Use `uuid` to generate IDs for Create operations.
   - Controller must export both `routeBase` and `router`.
   - Do not use route parameters — only body-based data allowed.
   - When updating the database, you must use entity class.

Format:
=== FILE: path/to/file.ext ===
=== TAG: command-<COMMAND_ID> ===
```javascript
< FILE CONTENT HERE >
```

- The `FILE` and `TAG` headers must be written in all uppercase letters, enclosed with triple equals signs (===), exactly as shown.
- Each prefix should be followed by an **given** ID, and both should be joined using a hyphen (-).
  Multiple such tags can be chained together, separated by comma.
- For only deleted code files, add `(deleted)` string at the end of the file path after space.
- Output only the modified or new files — do not include unchanged files.
- No explanation or comments, only file path, tag and code content using the above format.
- Wrap code blocks with triple backticks (` ``` `), specifying the appropriate language.
- Entity name is PascalCased.
- Generate code that strictly matches the provided Swagger (OpenAPI) documentation.

Tech Stacks:
 - Language: JavaScript ESM
 - Framework: JavaScript with Express
 - Test Framework: Jest

Folder Structure:
```bash
server/
├── src/
│   ├── bootstrap/
│   │   ├── loader.js
│   │   ├── express.js
│   │   └── app.js
│   ├── docs/
│   │   └── .gitkeep
│   ├── infrastructure/
│   │   └── db/
│   │       ├── index.js
│   │       ├── sqlite.js
│   │       ├── memory.js
│   │       └── mongo.js
│   ├── interfaces/
│   │   └── http/
│   │       └── controllers/
│   │           ├── .gitkeep
│   │           └── CreateTaskController.js
│   ├── routes/
│   │   └── index.js
│   ├── config/
│   │   └── index.js
│   └── domain/
│       ├── entity/
│       │   └── Task.js
│       └── command/
│           └── CreateTaskCommand.js
├── package.json
├── server.js
├── .env.example
└── .gitignore
```

Route Codes:
=== FILE: root/src/routes/index.js ===
```javascript
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const controllersPath = path.join(__dirname, '../interfaces/http/controllers');

const files = fs.readdirSync(controllersPath);

for (const file of files) {
  if (!file.endsWith('.js')) continue;

  const modulePath = pathToFileURL(path.join(controllersPath, file)).href;
  const controller = await import(modulePath);

  if (controller.default?.router && controller.default?.routeBase) {
    router.use(controller.default.routeBase, controller.default.router);
  }
}

export default router;
```

Example Codes:

=== FILE: src/domain/command/CreateTodoCommand.js ===
```javascript
import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class CreateTodoCommand {
  static async execute({ title }) {
    const todo = new Todo({ title });
    await db.insert('<entity name here>', todo.toJSON());
    return todo.toJSON();
  }
}

export default CreateTodoCommand;
```

=== FILE: src/interfaces/http/controllers/CreateTodoController.js ===
```javascript
import express from 'express';
import CreateTodoCommand from '../../../domain/todo/command/CreateTodoCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await CreateTodoCommand.execute({ title: req.body.title });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/todos',
  router,
};
```

Old Files:
[]

Old Command Information:
undefined

Current Command Information:
{"id":"5a28adf2-ce3e-4c19-8a75-606093c2de00","description":"Complete Task","cardinality":"one-to-many","dataFields":[{"name":"Task ID","type":null},{"name":"Completion Notes","type":null},{"name":"Time Spent","type":null},{"name":"Actual Completion Date","type":null},{"name":"Satisfaction Rating","type":null}],"gwtDescriptions":["Given an active task exists for the user, when the user issues a 'Complete Task' command for that task, then a 'Task Completed' event is emitted and the task's status is updated to completed."]}

Swagger Documentation:
openapi: 3.0.0
info:
  title: Todo App API
  version: 1.0.0
  description: API for managing a Task.
servers:
  - url: http://localhost:3000
    description: Local Development Server
paths:
  /complete-task:
    post:
      summary: Complete Task
      tags:
        - Commands
      responses:
        '200':
          description: Success
        '400':
          description: Bad Request
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                taskID:
                  type: string
                completionNotes:
                  type: string
                timeSpent:
                  type: string
                actualCompletionDate:
                  type: string
                satisfactionRating:
                  type: string
components:
  schemas:
    Task:
      type: object
      properties:
        taskID:
          type: string
          example: TASK-001
        taskTitle:
          type: string
          example: Buy Groceries
        taskDescription:
          type: string
          example: Milk, bread, eggs
        dueDate:
          type: string
          example: '2023-12-01'
        priorityLevel:
          type: string
          example: High
        categoryTags:
          type: string
          example: Personal, Shopping
        currentStatus:
          type: string
          example: Pending
        completionNotes:
          type: string
          example: ''
        timeSpent:
          type: string
          example: ''
        actualCompletionDate:
          type: string
          example: ''
        satisfactionRating:
          type: string
          example: ''
        reasonForDeletion:
          type: string
          example: ''
        archivedStatus:
          type: string
          example: 'false'


Update the given code files or create new ones if needed.
Output only the updated or newly added code files, excluding any unchanged content.
