// Assume 'app' is your Express application instance, exported for testing.
// For example, in src/app.js: `export default app;`
import request from 'supertest';
import app from '../src/app.js';

const BASE_URL = '/api/v1';

// Example data based on OpenAPI spec's CreateTodoRequest
const createTodoRequestBody = {
  todoTitle: 'Buy groceries',
  description: 'Milk, eggs, bread',
  dueDate: '2023-10-15',
  priority: 'High',
  category: 'Shopping',
};

// Example data based on OpenAPI spec's UpdateTodoRequest (using example from Todo schema for base)
const updateTodoExampleValues = {
  todoTitle: 'Updated groceries list',
  description: 'Milk, eggs, bread, cheese',
  dueDate: '2023-11-01',
  priority: 'Low',
  category: 'Home',
};

// Example data based on OpenAPI spec's CompleteTodoRequest
const completeTodoExampleValues = {
  completionDate: '2023-10-16',
  completionNotes: 'Done',
};

// Example data based on OpenAPI spec's DeleteTodoRequest
const deleteTodoExampleValues = {
  deletionReason: 'Not needed',
};

// Expected structure for a Todo response based on the Todo schema
// All properties defined in the schema are asserted to be of type string.
// For fields that are optionally set (e.g., completionDate, deletionReason),
// the spec provides string examples. We'll assert their type when present,
// and make specific assertions for their presence/absence based on the operation context.
const expectedTodoSchemaShape = {
  todoID: expect.any(String),
  todoTitle: expect.any(String),
  description: expect.any(String),
  dueDate: expect.any(String),
  priority: expect.any(String),
  category: expect.any(String),
  completionDate: expect.any(String),
  completionNotes: expect.any(String),
  deletionReason: expect.any(String),
};

// Required fields for the Todo schema according to the spec
const requiredTodoFields = ['todoID', 'todoTitle'];


describe('TodoApp API', () => {
  let createdTodoId; // To store the ID of the created todo item for subsequent tests

  // beforeEach hook to create a new todo item for tests that modify/fetch existing items.
  // This ensures a clean, existing todo for relevant tests.
  beforeEach(async () => {
    const res = await request(app)
      .post(`${BASE_URL}/create-todo`)
      .send(createTodoRequestBody)
      .expect(200);

    createdTodoId = res.body.todoID;
    expect(createdTodoId).toBeDefined();
    expect(typeof createdTodoId).toBe('string');

    // Also assert the initial state of the newly created todo for baseline
    expect(res.body.todoTitle).toBe(createTodoRequestBody.todoTitle);
    expect(res.body.description).toBe(createTodoRequestBody.description);
    expect(res.body.dueDate).toBe(createTodoRequestBody.dueDate);
    expect(res.body.priority).toBe(createTodoRequestBody.priority);
    expect(res.body.category).toBe(createTodoRequestBody.category);
    // These should not be set on creation. If returned, they should be falsy (null, undefined, or empty string)
    expect(res.body.completionDate).toBeFalsy();
    expect(res.body.completionNotes).toBeFalsy();
    expect(res.body.deletionReason).toBeFalsy();
  });

  // --- createTodo (POST /create-todo) ---
  it('should successfully create a new todo item', async () => {
    // This test creates an additional todo to ensure independent testing
    const specificCreateRequestBody = {
      ...createTodoRequestBody,
      todoTitle: 'Specific Test Todo for Creation',
    };

    const res = await request(app)
      .post(`${BASE_URL}/create-todo`)
      .send(specificCreateRequestBody)
      .expect(200);

    // Validate overall structure and types based on schema
    expect(res.body).toEqual(expect.objectContaining(expectedTodoSchemaShape));

    // Ensure all required fields are present
    requiredTodoFields.forEach(field => {
      expect(res.body).toHaveProperty(field);
    });

    // Validate specific values from the request body are reflected in the response
    expect(res.body.todoTitle).toBe(specificCreateRequestBody.todoTitle);
    expect(res.body.description).toBe(specificCreateRequestBody.description);
    expect(res.body.dueDate).toBe(specificCreateRequestBody.dueDate);
    expect(res.body.priority).toBe(specificCreateRequestBody.priority);
    expect(res.body.category).toBe(specificCreateRequestBody.category);

    // Verify fields that should not be set on creation are falsy
    expect(res.body.completionDate).toBeFalsy();
    expect(res.body.completionNotes).toBeFalsy();
    expect(res.body.deletionReason).toBeFalsy();
  });

  // --- updateTodo (POST /update-todo) ---
  it('should successfully update an existing todo item', async () => {
    const updateRequestBody = {
      todoID: createdTodoId,
      ...updateTodoExampleValues,
    };

    const res = await request(app)
      .post(`${BASE_URL}/update-todo`)
      .send(updateRequestBody)
      .expect(200);

    // Validate overall structure and types based on schema
    expect(res.body).toEqual(expect.objectContaining(expectedTodoSchemaShape));

    // Ensure all required fields are present
    requiredTodoFields.forEach(field => {
      expect(res.body).toHaveProperty(field);
    });

    // Validate specific values from the update request are reflected
    expect(res.body.todoID).toBe(createdTodoId); // ID should remain the same
    expect(res.body.todoTitle).toBe(updateRequestBody.todoTitle);
    expect(res.body.description).toBe(updateRequestBody.description);
    expect(res.body.dueDate).toBe(updateRequestBody.dueDate);
    expect(res.body.priority).toBe(updateRequestBody.priority);
    expect(res.body.category).toBe(updateRequestBody.category);
  });

  // --- completeTodo (POST /complete-todo) ---
  it('should successfully mark a todo item as complete', async () => {
    const completeRequestBody = {
      todoID: createdTodoId,
      ...completeTodoExampleValues,
    };

    const res = await request(app)
      .post(`${BASE_URL}/complete-todo`)
      .send(completeRequestBody)
      .expect(200);

    // Validate overall structure and types based on schema
    expect(res.body).toEqual(expect.objectContaining(expectedTodoSchemaShape));

    // Ensure all required fields are present
    requiredTodoFields.forEach(field => {
      expect(res.body).toHaveProperty(field);
    });

    // Validate completion-specific fields are set correctly
    expect(res.body.todoID).toBe(createdTodoId);
    expect(res.body.completionDate).toBe(completeRequestBody.completionDate);
    expect(res.body.completionNotes).toBe(completeRequestBody.completionNotes);
    // Deletion reason should still be falsy after completion
    expect(res.body.deletionReason).toBeFalsy();
  });

  // --- deleteTodo (POST /delete-todo) ---
  it('should successfully mark a todo item as deleted', async () => {
    const deleteRequestBody = {
      todoID: createdTodoId,
      ...deleteTodoExampleValues,
    };

    const res = await request(app)
      .post(`${BASE_URL}/delete-todo`)
      .send(deleteRequestBody)
      .expect(200);

    // Validate overall structure and types based on schema
    expect(res.body).toEqual(expect.objectContaining(expectedTodoSchemaShape));

    // Ensure all required fields are present
    requiredTodoFields.forEach(field => {
      expect(res.body).toHaveProperty(field);
    });

    // Validate deletion-specific field is set correctly
    expect(res.body.todoID).toBe(createdTodoId);
    expect(res.body.deletionReason).toBe(deleteRequestBody.deletionReason);
    // Completion fields should be falsy as the todo was just created in beforeEach
    expect(res.body.completionDate).toBeFalsy();
    expect(res.body.completionNotes).toBeFalsy();
  });

  // --- fetchTodoList (GET /fetch-todo-list) ---
  it('should successfully fetch a list of todo items', async () => {
    // Create an additional todo to ensure the list contains multiple items
    const anotherTodoRequestBody = {
      todoTitle: 'Walk the dog',
      description: 'Take Fido to the park',
      dueDate: '2023-10-18',
      priority: 'Medium',
      category: 'Pet Care',
    };
    await request(app)
      .post(`${BASE_URL}/create-todo`)
      .send(anotherTodoRequestBody)
      .expect(200);

    const res = await request(app)
      .get(`${BASE_URL}/fetch-todo-list`)
      .expect(200);

    // Validate response body is an array
    expect(Array.isArray(res.body)).toBe(true);
    // Expect at least the two todos created (one in beforeEach, one in this test)
    expect(res.body.length).toBeGreaterThanOrEqual(2);

    // Validate each item in the array against the Todo schema
    res.body.forEach(todo => {
      expect(todo).toEqual(expect.objectContaining(expectedTodoSchemaShape));
      requiredTodoFields.forEach(field => {
        expect(todo).toHaveProperty(field);
      });
    });
  });

  // --- getTodoDetails (GET /get-todo-details) ---
  it('should successfully get details of a todo item', async () => {
    // As per the OpenAPI spec, the GET /get-todo-details operation does not define
    // any path or query parameters. This test strictly adheres to this definition,
    // assuming the API either returns a default/latest todo, or that the spec
    // is incomplete regarding ID parameterization for this specific endpoint.
    const res = await request(app)
      .get(`${BASE_URL}/get-todo-details`)
      .expect(200);

    // Validate response body is a single Todo object
    expect(res.body).toEqual(expect.objectContaining(expectedTodoSchemaShape));

    // Ensure all required fields are present
    requiredTodoFields.forEach(field => {
      expect(res.body).toHaveProperty(field);
    });

    // Without a specific ID parameter in the request, we cannot reliably assert
    // that the returned todoID matches the `createdTodoId` from `beforeEach`.
    // The test only confirms that a valid single Todo object conforming to the schema is returned.
  });
});