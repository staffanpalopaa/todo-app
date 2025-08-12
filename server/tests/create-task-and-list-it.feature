Feature: Task Management

  Scenario: Given the user wants to organize their work, when the user issues a 'Create Task' command with a title and description, then a 'Task Created' event is emitted and the task appears in their task list.
    Given the user wants to organize their work
    When the user issues a 'Create Task' command with a title and description
    Then a 'Task Created' event is emitted and the task appears in their task list.