class TaskCreatedEvent {
  constructor(task) {
    this.eventName = 'TaskCreatedEvent';
    this.timestamp = new Date();
    this.task = task;
  }
}

export default TaskCreatedEvent;