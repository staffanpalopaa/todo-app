Feature: Todo Creation

  Scenario: Given the user wants to add a new task, when the user creates a Todo with a description, then a Todo Created event is recorded and the todo becomes available.
    Given the user wants to add a new task
    When the user creates a Todo with a description
    Then a Todo Created event is recorded and the todo becomes available.