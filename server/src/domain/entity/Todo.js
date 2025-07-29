import { v4 as uuidv4 } from 'uuid';

class Todo {
  constructor({
    todoID = uuidv4(),
    todoTitle,
    description = null,
    dueDate = null,
    priority = null,
    category = null,
    completionDate = null,
    completionNotes = null,
    deletionReason = null
  }) {
    if (!todoTitle) {
      throw new Error('Todo title is required.');
    }

    this.id = todoID; // Internal primary key
    this.todoID = todoID; // Exposed API field
    this.todoTitle = todoTitle;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.category = category;
    this.completionDate = completionDate;
    this.completionNotes = completionNotes;
    this.deletionReason = deletionReason;
  }

  toJSON() {
    return {
      id: this.id,
      todoID: this.todoID,
      todoTitle: this.todoTitle,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      category: this.category,
      completionDate: this.completionDate,
      completionNotes: this.completionNotes,
      deletionReason: this.deletionReason
    };
  }
}

export default Todo;