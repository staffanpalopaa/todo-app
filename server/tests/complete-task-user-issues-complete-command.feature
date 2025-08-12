Feature: Complete Task

  Scenario: Given an active task exists for the user, when the user issues a 'Complete Task' command for that task, then a 'Task Completed' event is emitted and the task's status is updated to completed.
    Given an active task exists for the user
    When the user issues a 'Complete Task' command for that task
    Then a 'Task Completed' event is emitted and the task's status is updated to completed.