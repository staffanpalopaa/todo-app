import { v4 as uuidv4 } from 'uuid';

class Todo {
  constructor({
    todoID = uuidv4(),
    title,
    description,
    dueDate,
    priority,
    completionDate,
    completionNotes
  }) {
    if (!title) {
      throw new Error('Title is required');
    }

    this.id = todoID; // Internal primary key
    this.todoID = todoID; // Exposed API field
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completionDate = completionDate;
    this.completionNotes = completionNotes;
  }

  toJSON() {
    return {
      id: this.id,
      todoID: this.todoID,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      completionDate: this.completionDate,
      completionNotes: this.completionNotes
    };
  }
}

export default Todo;