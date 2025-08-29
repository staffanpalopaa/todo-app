Feature: ToDo App
  As a User of the ToDo App
  I want to manage my todos
  So that I can stay organized

  Scenario: Given no todos exist. When the User issues a 'Create Todo' command with a title. Then a 'Todo Created' event is recorded, and the new todo appears in the list.
    Given no todos exist
    When the User issues a 'Create Todo' command with a title 'My New Todo'
    Then a 'Todo Created' event is recorded
    And the new todo appears in the list