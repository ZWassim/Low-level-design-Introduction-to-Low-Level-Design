import { EventManager } from '../patterns/observer.js';
import { DateHelper } from '../utils/dateHelper.js';
import { ValidationService } from '../services/validation.js';
import { BorrowRecordFactory } from '../patterns/factory.js';

export class Library {
  constructor(bookRepository, memberRepository, borrowRepository, eventManager) {
    // Dependency Injection
    this.bookRepository = bookRepository;
    this.memberRepository = memberRepository;
    this.borrowRepository = borrowRepository;
    this.eventManager = eventManager;
  }
  
  addBook(book) {
    const validation = ValidationService.validateBook(book);
    if (!validation.isValid) {
      throw new Error(`Invalid book: ${validation.errors.join(', ')}`);
    }
    
    const savedBook = this.bookRepository.save(book);
    this.eventManager.notify('BOOK_ADDED', { book: savedBook });
    return savedBook;
  }
  
  registerMember(member) {
    const validation = ValidationService.validateMember(member);
    if (!validation.isValid) {
      throw new Error(`Invalid member: ${validation.errors.join(', ')}`);
    }
    
    const savedMember = this.memberRepository.save(member);
    this.eventManager.notify('MEMBER_REGISTERED', { member: savedMember });
    return savedMember;
  }
  
  borrowBook(bookId, memberId) {
    const book = this.bookRepository.findById(bookId);
    const member = this.memberRepository.findById(memberId);
    
    if (!book) throw new Error('Book not found');
    if (!member) throw new Error('Member not found');
    if (book.available <= 0) throw new Error('Book not available');
    
    // Check member borrowing limit
    const activeBorrows = this.borrowRepository
      .findAll()
      .filter(record => record.memberId === memberId && record.status === 'ACTIVE');
    
    const maxLimit = member.type === 'PREMIUM' ? 10 : 5;
    if (activeBorrows.length >= maxLimit) {
      throw new Error(`Member has reached borrowing limit of ${maxLimit}`);
    }
    
    // Create borrow record
    const borrowRecord = BorrowRecordFactory.createBorrowRecord(bookId, memberId);
    this.borrowRepository.save(borrowRecord);
    
    // Update book availability
    book.available--;
    this.bookRepository.update(book.id, { available: book.available });
    
    // Notify observers
    this.eventManager.notify('BOOK_BORROWED', {
      book,
      member,
      dueDate: borrowRecord.dueDate
    });
    
    return borrowRecord;
  }
  
  returnBook(bookId, memberId) {
    const borrowRecord = this.borrowRepository
      .findAll()
      .find(record => 
        record.bookId === bookId && 
        record.memberId === memberId && 
        record.status === 'ACTIVE'
      );
    
    if (!borrowRecord) {
      throw new Error('No active borrow record found');
    }
    
    // Calculate fine if overdue
    const fine = DateHelper.calculateFine(borrowRecord.dueDate);
    
    // Update borrow record
    borrowRecord.returnDate = new Date();
    borrowRecord.status = 'RETURNED';
    this.borrowRepository.update(borrowRecord.id, borrowRecord);
    
    // Update book availability
    const book = this.bookRepository.findById(bookId);
    book.available++;
    this.bookRepository.update(book.id, { available: book.available });
    
    // Get member details
    const member = this.memberRepository.findById(memberId);
    
    // Notify observers
    this.eventManager.notify('BOOK_RETURNED', {
      book,
      member,
      fine,
      borrowRecord
    });
    
    return { borrowRecord, fine };
  }
  
  getAvailableBooks() {
    return this.bookRepository.findAll().filter(book => book.available > 0);
  }
  
  getMemberBorrowHistory(memberId) {
    return this.borrowRepository
      .findAll()
      .filter(record => record.memberId === memberId);
  }
  
  checkOverdueBooks() {
    const activeBorrows = this.borrowRepository
      .findAll()
      .filter(record => record.status === 'ACTIVE');
    
    const overdueBooks = activeBorrows.filter(record => 
      DateHelper.isOverdue(record.dueDate)
    );
    
    overdueBooks.forEach(record => {
      const book = this.bookRepository.findById(record.bookId);
      const member = this.memberRepository.findById(record.memberId);
      
      this.eventManager.notify('BOOK_OVERDUE', { book, member, record });
    });
    
    return overdueBooks;
  }
}