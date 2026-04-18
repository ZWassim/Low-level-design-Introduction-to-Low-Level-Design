export class ValidationService {
  static validateBook(book) {
    const errors = [];
    
    if (!book.title || book.title.length < 1) {
      errors.push('Title is required');
    }
    
    if (!book.author || book.author.length < 1) {
      errors.push('Author is required');
    }
    
    if (!book.isbn || !this.isValidISBN(book.isbn)) {
      errors.push('Invalid ISBN');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static validateMember(member) {
    const errors = [];
    
    if (!member.name || member.name.length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    
    if (!member.email || !this.isValidEmail(member.email)) {
      errors.push('Invalid email address');
    }
    
    if (!member.phone) {
      errors.push('Phone number is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  static isValidISBN(isbn) {
    const isbnRegex = /^(97(8|9))?\d{9}(\d|X)$/;
    return isbnRegex.test(isbn);
  }
  
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}