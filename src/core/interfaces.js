// Interface-like contracts using abstract classes
export class RepositoryInterface {
  save(item) {
    throw new Error('Method not implemented');
  }
  
  findById(id) {
    throw new Error('Method not implemented');
  }
  
  findAll() {
    throw new Error('Method not implemented');
  }
  
  update(id, data) {
    throw new Error('Method not implemented');
  }
  
  delete(id) {
    throw new Error('Method not implemented');
  }
}

export class NotificationServiceInterface {
  send(message, recipient) {
    throw new Error('Method not implemented');
  }
}

export class SearchStrategyInterface {
  search(items, query) {
    throw new Error('Method not implemented');
  }
}