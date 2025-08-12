class DomainEventPublisher {
  constructor() {
    this.subscribers = {};
  }

  subscribe(eventName, handler) {
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = [];
    }
    this.subscribers[eventName].push(handler);
  }

  publish(event) {
    const eventName = event.constructor.name;
    if (this.subscribers[eventName]) {
      this.subscribers[eventName].forEach(handler => handler(event));
    }
  }
}

export default new DomainEventPublisher();