import { SearchStrategyInterface } from '../core/interfaces.js';

// Search Strategy: By Title
export class TitleSearchStrategy extends SearchStrategyInterface {
  search(items, query) {
    return items.filter(book => 
      book.title.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// Search Strategy: By Author
export class AuthorSearchStrategy extends SearchStrategyInterface {
  search(items, query) {
    return items.filter(book => 
      book.author.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// Search Strategy: By Category
export class CategorySearchStrategy extends SearchStrategyInterface {
  search(items, query) {
    return items.filter(book => 
      book.category.toLowerCase() === query.toLowerCase()
    );
  }
}

// Search Strategy: By ISBN
export class ISBNSearchStrategy extends SearchStrategyInterface {
  search(items, query) {
    return items.filter(book => 
      book.isbn === query
    );
  }
}

// Context for Search Strategy
export class SearchContext {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  executeSearch(items, query) {
    return this.strategy.search(items, query);
  }
}