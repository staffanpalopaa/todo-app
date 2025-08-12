import { v4 as uuidv4 } from 'uuid';

class Task {
  constructor({
    taskID = uuidv4(),
    taskTitle,
    taskDescription = '',
    dueDate = '',
    priorityLevel = '',
    categoryTags = '',
    currentStatus = 'Pending', // Default status as per common task workflows
    completionNotes = '',
    timeSpent = '',
    actualCompletionDate = '',
    satisfactionRating = '',
    reasonForDeletion = '',
    archivedStatus = 'false'
  }) {
    if (!taskTitle) {
      throw new Error('Task Title is required');
    }

    this.id = taskID; // Internal primary key
    this.taskID = taskID; // Exposed API field name
    this.taskTitle = taskTitle;
    this.taskDescription = taskDescription;
    this.dueDate = dueDate;
    this.priorityLevel = priorityLevel;
    this.categoryTags = categoryTags;
    this.currentStatus = currentStatus;
    this.completionNotes = completionNotes;
    this.timeSpent = timeSpent;
    this.actualCompletionDate = actualCompletionDate;
    this.satisfactionRating = satisfactionRating;
    this.reasonForDeletion = reasonForDeletion;
    this.archivedStatus = archivedStatus;
  }

  toJSON() {
    return {
      id: this.id,
      taskID: this.taskID,
      taskTitle: this.taskTitle,
      taskDescription: this.taskDescription,
      dueDate: this.dueDate,
      priorityLevel: this.priorityLevel,
      categoryTags: this.categoryTags,
      currentStatus: this.currentStatus,
      completionNotes: this.completionNotes,
      timeSpent: this.timeSpent,
      actualCompletionDate: this.actualCompletionDate,
      satisfactionRating: this.satisfactionRating,
      reasonForDeletion: this.reasonForDeletion,
      archivedStatus: this.archivedStatus
    };
  }
}

export default Task;