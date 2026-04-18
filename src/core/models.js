export class Book {
  constructor(id, title, author, isbn, category, quantity = 1) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.category = category;
    this.quantity = quantity;
    this.available = quantity;
    this.createdAt = new Date();
  }
}

export class Member {
  constructor(id, name, email, phone) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.borrowedBooks = [];
    this.membershipDate = new Date();
  }
}

export class BorrowRecord {
  constructor(id, bookId, memberId, dueDate) {
    this.id = id;
    this.bookId = bookId;
    this.memberId = memberId;
    this.borrowDate = new Date();
    this.dueDate = dueDate || this.calculateDueDate();
    this.returnDate = null;
    this.status = 'ACTIVE';
  }
  
  calculateDueDate(days = 14) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }
}