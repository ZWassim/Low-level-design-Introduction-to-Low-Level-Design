import { SearchContext } from '../patterns/strategy.js';

export class SearchService {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
    this.searchContext = new SearchContext(null);
  }
  
  search(query, strategy) {
    this.searchContext.setStrategy(strategy);
    const books = this.bookRepository.findAll();
    return this.searchContext.executeSearch(books, query);
  }
}