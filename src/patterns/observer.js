// Observer Interface
class Observer {
  update(event, data) {
    throw new Error('Method not implemented');
  }
}

// Subject (Observable)
export class EventManager {
  constructor() {
    this.listeners = new Map();
  }
  
  subscribe(event, observer) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(observer);
  }
  
  unsubscribe(event, observer) {
    if (!this.listeners.has(event)) return;
    
    const observers = this.listeners.get(event);
    const index = observers.indexOf(observer);
    if (index !== -1) {
      observers.splice(index, 1);
    }
  }
  
  notify(event, data) {
    if (!this.listeners.has(event)) return;
    
    this.listeners.get(event).forEach(observer => {
      observer.update(event, data);
    });
  }
}

// Concrete Observers
export class EmailNotifier extends Observer {
  constructor(emailService) {
    super();
    this.emailService = emailService;
  }
  
  update(event, data) {
    switch(event) {
      case 'BOOK_BORROWED':
        this.emailService.send(
          data.member.email,
          `You have borrowed "${data.book.title}" until ${data.dueDate}`
        );
        break;
      case 'BOOK_RETURNED':
        this.emailService.send(
          data.member.email,
          `Thank you for returning "${data.book.title}"`
        );
        break;
      case 'BOOK_OVERDUE':
        this.emailService.send(
          data.member.email,
          `Reminder: "${data.book.title}" is overdue!`
        );
        break;
    }
  }
}

export class SMSNotifier extends Observer {
  constructor(smsService) {
    super();
    this.smsService = smsService;
  }
  
  update(event, data) {
    if (event === 'BOOK_OVERDUE') {
      this.smsService.send(
        data.member.phone,
        `Overdue book alert: ${data.book.title}`
      );
    }
  }
}

export class LoggerObserver extends Observer {
  constructor(logger) {
    super();
    this.logger = logger;
  }
  
  update(event, data) {
    this.logger.log(`Event: ${event}`, data);
  }
}