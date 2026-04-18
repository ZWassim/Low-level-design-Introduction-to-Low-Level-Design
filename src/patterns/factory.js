import { Book, Member, BorrowRecord } from '../core/models.js';
import { v4 as uuidv4 } from 'uuid';

// Book Factory
export class BookFactory {
  static createBook(data) {
    return new Book(
      data.id || uuidv4(),
      data.title,
      data.author,
      data.isbn,
      data.category,
      data.quantity || 1
    );
  }
  
  static createBookFromCSV(csvRow) {
    const [title, author, isbn, category, quantity] = csvRow.split(',');
    return this.createBook({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      category: category.trim(),
      quantity: parseInt(quantity) || 1
    });
  }
  
  static createMultipleBooks(booksData) {
    return booksData.map(data => this.createBook(data));
  }
}

// Member Factory
export class MemberFactory {
  static createMember(data) {
    return new Member(
      data.id || uuidv4(),
      data.name,
      data.email,
      data.phone
    );
  }
  
  static createPremiumMember(data) {
    const member = this.createMember(data);
    member.type = 'PREMIUM';
    member.maxBorrowLimit = 10;
    return member;
  }
  
  static createRegularMember(data) {
    const member = this.createMember(data);
    member.type = 'REGULAR';
    member.maxBorrowLimit = 5;
    return member;
  }
}

// Borrow Record Factory
export class BorrowRecordFactory {
  static createBorrowRecord(bookId, memberId, dueDate = null) {
    return new BorrowRecord(
      uuidv4(),
      bookId,
      memberId,
      dueDate
    );
  }
}