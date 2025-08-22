import { v4 as uuidv4 } from 'uuid';

class ToDo {
  constructor({
    toDoID = uuidv4(),
    toDoTitle,
    description = '',
    dueDate = null,
    priorityLevel = 'Medium',
    category = 'Personal',
    tags = '',
    completionDate = null,
    completionNotes = '',
    deletionReason = ''
  }) {
    if (!toDoTitle) throw new Error('ToDo Title is required');
    this.id = toDoID;
    this.toDoID = toDoID;
    this.toDoTitle = toDoTitle;
    this.description = description;
    this.dueDate = dueDate;
    this.priorityLevel = priorityLevel;
    this.category = category;
    this.tags = tags;
    this.completionDate = completionDate;
    this.completionNotes = completionNotes;
    this.deletionReason = deletionReason;
  }

  toJSON() {
    return {
      id: this.id,
      toDoID: this.toDoID,
      toDoTitle: this.toDoTitle,
      description: this.description,
      dueDate: this.dueDate,
      priorityLevel: this.priorityLevel,
      category: this.category,
      tags: this.tags,
      completionDate: this.completionDate,
      completionNotes: this.completionNotes,
      deletionReason: this.deletionReason
    };
  }
}

export default ToDo;