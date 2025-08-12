class TaskDeletedEvent {
  constructor(taskID, reasonForDeletion, archivedStatus) {
    this.name = 'TaskDeletedEvent';
    this.taskID = taskID;
    this.reasonForDeletion = reasonForDeletion;
    this.archivedStatus = archivedStatus;
    this.occurredOn = new Date();
  }
}

export default TaskDeletedEvent;