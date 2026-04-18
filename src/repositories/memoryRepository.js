import { RepositoryInterface } from '../core/interfaces.js';

export class MemoryRepository extends RepositoryInterface {
  constructor() {
    super();
    this.store = new Map();
    this.currentId = 1;
  }
  
  save(item) {
    if (!item.id) {
      item.id = this.currentId++;
    }
    this.store.set(item.id, item);
    return item;
  }
  
  findById(id) {
    return this.store.get(id) || null;
  }
  
  findAll() {
    return Array.from(this.store.values());
  }
  
  update(id, data) {
    const existing = this.findById(id);
    if (!existing) return null;
    
    const updated = { ...existing, ...data, id };
    this.store.set(id, updated);
    return updated;
  }
  
  delete(id) {
    return this.store.delete(id);
  }
  
  findByField(field, value) {
    return this.findAll().filter(item => item[field] === value);
  }
}