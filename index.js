import { Library } from './core/library.js';
import { MemoryRepository } from './repositories/memoryRepository.js';
import { EventManager, EmailNotifier, LoggerObserver } from './patterns/observer.js';
import { BookFactory, MemberFactory } from './patterns/factory.js';
import { EmailService } from './services/notification.js';
import { Logger } from './utils/logger.js';
import { 
  TitleSearchStrategy, 
  AuthorSearchStrategy,
  SearchContext 
} from './patterns/strategy.js';
import { SearchService } from './services/search.js';

// Initialize dependencies
const logger = new Logger('DEBUG');
const emailService = new EmailService();
const eventManager = new EventManager();

// Setup observers
const emailNotifier = new EmailNotifier(emailService);
const loggerObserver = new LoggerObserver(logger);

eventManager.subscribe('BOOK_BORROWED', emailNotifier);
eventManager.subscribe('BOOK_RETURNED', emailNotifier);
eventManager.subscribe('BOOK_OVERDUE', emailNotifier);
eventManager.subscribe('BOOK_BORROWED', loggerObserver);
eventManager.subscribe('BOOK_RETURNED', loggerObserver);
eventManager.subscribe('BOOK_ADDED', loggerObserver);
eventManager.subscribe('MEMBER_REGISTERED', loggerObserver);

// Initialize repositories
const bookRepository = new MemoryRepository();
const memberRepository = new MemoryRepository();
const borrowRepository = new MemoryRepository();

// Initialize library
const library = new Library(
  bookRepository,
  memberRepository,
  borrowRepository,
  eventManager
);

// Initialize search service
const searchService = new SearchService(bookRepository);

// Demo Application
async function runLibraryDemo() {
  console.log('=== Library Management System Demo ===\n');
  
  // Add books using Factory pattern
  const book1 = BookFactory.createBook({
    title: 'The Pragmatic Programmer',
    author: 'David Thomas',
    isbn: '9780201616224',
    category: 'Programming',
    quantity: 3
  });
  
  const book2 = BookFactory.createBook({
    title: 'Clean Code',
    author: 'Robert Martin',
    isbn: '9780132350884',
    category: 'Programming',
    quantity: 2
  });
  
  const book3 = BookFactory.createBook({
    title: 'Design Patterns',
    author: 'Erich Gamma',
    isbn: '9780201633610',
    category: 'Software Design',
    quantity: 1
  });
  
  library.addBook(book1);
  library.addBook(book2);
  library.addBook(book3);
  
  console.log('✅ Added 3 books to library\n');
  
  // Register members using Factory pattern
  const member1 = MemberFactory.createRegularMember({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890'
  });
  
  const member2 = MemberFactory.createPremiumMember({
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+0987654321'
  });
  
  library.registerMember(member1);
  library.registerMember(member2);
  
  console.log('✅ Registered 2 members\n');
  
  // Borrow books
  console.log('--- Borrowing Books ---');
  try {
    const borrow1 = library.borrowBook(book1.id, member1.id);
    console.log(`📚 ${member1.name} borrowed "${book1.title}"`);
    
    const borrow2 = library.borrowBook(book2.id, member2.id);
    console.log(`📚 ${member2.name} borrowed "${book2.title}"`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
  
  console.log('\n--- Search Functionality (Strategy Pattern) ---');
  
  // Search by title
  const titleSearch = new TitleSearchStrategy();
  const searchContext = new SearchContext(titleSearch);
  const programmingBooks = searchContext.executeSearch(
    bookRepository.findAll(),
    'Clean'
  );
  console.log(`🔍 Search by title "Clean": ${programmingBooks.length} book(s) found`);
  
  // Search by author
  searchContext.setStrategy(new AuthorSearchStrategy());
  const authorBooks = searchContext.executeSearch(
    bookRepository.findAll(),
    'Robert Martin'
  );
  console.log(`🔍 Search by author "Robert Martin": ${authorBooks.length} book(s) found`);
  
  console.log('\n--- Returning Books ---');
  const { fine } = library.returnBook(book1.id, member1.id);
  console.log(`📖 ${member1.name} returned "${book1.title}"`);
  if (fine > 0) {
    console.log(`💰 Fine amount: $${fine}`);
  }
  
  console.log('\n--- Available Books ---');
  const availableBooks = library.getAvailableBooks();
  availableBooks.forEach(book => {
    console.log(`📖 ${book.title} - Available: ${book.available}/${book.quantity}`);
  });
  
  console.log('\n--- Check Overdue Books ---');
  const overdueBooks = library.checkOverdueBooks();
  console.log(`📅 Overdue books: ${overdueBooks.length}`);
  
  console.log('\n=== Demo Complete ===');
}

// Run the demo
runLibraryDemo().catch(console.error);