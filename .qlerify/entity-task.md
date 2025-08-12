
You will receive the following:
- The current folder structure and tech stacks
- Existing entity-related code files before changes
- A summary of the entity changes

Your Rule:
All request and response schemas, field names, data types, required properties, and descriptions must be strictly derived from the given OpenAPI 3.0.3 specification. Do not invent any data or structure not explicitly defined in the spec. Only implement logic for commands defined in the paths section with HTTP methods

Your task:
1. Generate clean, self-contained entity code reflecting the latest updates.
2. Do NOT include any unchanged files.
3. Ensure:
   - Only entity-related code files can be created/updated.
   - Each entity must reside in `src/domain/entity`
   - No references to command or read model code.
   - Entity code must follow the example coding style.
   - Must be self-contained and have no imports from other domains.
   - Must be compatible with Swagger specifications.
   - Use `uuid` for generating IDs where needed.
   - Always store the primary key as `id` internally and expose both `id` and its original API field name in the response.

Format:
=== FILE: path/to/file.ext ===
=== TAG: entity-<ENTITY_ID> ===
```javascript
< FILE CONTENT HERE >
```

- The `FILE` and `TAG` headers must be written in all uppercase letters, enclosed with triple equals signs (===), exactly as shown.
  Each prefix should be followed by an **given** ID, and both should be joined using a hyphen (-).
  Multiple such tags can be chained together, separated by comma.
- Output only the modified or new files — do not include unchanged files.
- No explanation or comments, only file path, tag and code content using the above format.
- Wrap code blocks with triple backticks (` ``` `), specifying the appropriate language.
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
│   │           └── .gitkeep
│   ├── routes/
│   │   └── index.js
│   └── config/
│       └── index.js
├── package.json
├── server.js
├── .env.example
└── .gitignore
```

Example Codes:

=== FILE: src/domain/entity/Todo.js ===
```javascript
import { v4 as uuidv4 } from 'uuid';

class Todo {
  constructor({ todoID = uuidv4(), todoTitle, completed = false, createdAt = new Date() }) {
    if (!todoTitle) throw new Error('Title is required');
    this.id = todoID;
    this.todoID = todoID;
    this.todoTitle = todoTitle;
    this.completed = completed;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      todoID: this.todoID,
      todoTitle: this.todoTitle,
      completed: this.completed,
      createdAt: this.createdAt
    };
  }
}

export default Todo;
```

Old Files:
[]

Old {{ PROMPT_TYPE }} Information:
undefined

Current {{ PROMPT_TYPE }} Information:
{"id":"edc7887a-9ca8-418c-937d-14c4917744fd","name":"Task","dataFields":[{"name":"Task ID","exampleData":["TASK-001","TASK-002","TASK-003"],"cardinality":"one-to-one","primaryKey":true},{"name":"Task Title","exampleData":["Buy Groceries","Prepare Presentation","Schedule Dentist"],"cardinality":"one-to-one","primaryKey":false},{"name":"Task Description","exampleData":["Milk, bread, eggs","Monthly sales review","Check availability"],"cardinality":"one-to-one","primaryKey":false},{"name":"Due Date","exampleData":["2023-12-01","2023-11-25","2023-12-05"],"cardinality":"one-to-one","primaryKey":false},{"name":"Priority Level","exampleData":["High","Medium","Low"],"cardinality":"one-to-one","primaryKey":false},{"name":"Category Tags","exampleData":["Personal, Shopping","Work, Marketing","Health"],"cardinality":"one-to-one","primaryKey":false},{"name":"Current Status","exampleData":["Pending","Completed","Deleted"],"cardinality":"one-to-one","primaryKey":false},{"name":"Completion Notes","exampleData":["","Reviewed by manager",""],"cardinality":"one-to-one","primaryKey":false},{"name":"Time Spent","exampleData":["","120 minutes",""],"cardinality":"one-to-one","primaryKey":false},{"name":"Actual Completion Date","exampleData":["","2023-11-20",""],"cardinality":"one-to-one","primaryKey":false},{"name":"Satisfaction Rating","exampleData":["","5",""],"cardinality":"one-to-one","primaryKey":false},{"name":"Reason for Deletion","exampleData":["","","Obsolete request"],"cardinality":"one-to-one","primaryKey":false},{"name":"Archived Status","exampleData":["false","false","true"],"cardinality":"one-to-one","primaryKey":false}]}

Swagger Documentation:
openapi: 3.0.0
info:
  title: Todo App API
  version: 1.0.0
  description: API for managing a Task.
servers:
  - url: http://localhost:3000
    description: Local Development Server
paths: {}
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
