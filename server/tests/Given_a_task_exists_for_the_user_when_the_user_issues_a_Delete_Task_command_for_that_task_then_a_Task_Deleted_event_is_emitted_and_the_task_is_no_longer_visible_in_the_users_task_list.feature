Feature: Task Deletion

  Scenario: Given a task exists for the user, when the user issues a 'Delete Task' command for that task, then a 'Task Deleted' event is emitted and the task is no longer visible in the user's task list.
    Given a task exists for the user
    When the user issues a 'Delete Task' command for that task
    Then a 'Task Deleted' event is emitted and the task is no longer visible in the user's task list