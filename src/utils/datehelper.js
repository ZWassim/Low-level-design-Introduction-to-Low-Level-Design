export class DateHelper {
  static formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  }
  
  static isOverdue(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    return today > due;
  }
  
  static calculateFine(dueDate, finePerDay = 1) {
    if (!this.isOverdue(dueDate)) return 0;
    
    const today = new Date();
    const due = new Date(dueDate);
    const daysOverdue = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
    
    return daysOverdue * finePerDay;
  }
  
  static addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}