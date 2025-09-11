Feature: Delete Todo

  Scenario: Given an existing Todo, when the user deletes the Todo, then a Todo Deleted event is recorded and the todo is no longer available.
    Given an existing Todo
    When the user deletes the Todo
    Then a Todo Deleted event is recorded and the todo is no longer available.