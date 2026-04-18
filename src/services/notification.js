import { NotificationServiceInterface } from '../core/interfaces.js';

// Email Service Implementation
export class EmailService extends NotificationServiceInterface {
  send(message, recipient) {
    console.log(`[EMAIL] To: ${recipient}`);
    console.log(`[EMAIL] Message: ${message}`);
    console.log(`[EMAIL] Sent at: ${new Date().toISOString()}\n`);
    return true;
  }
}

// SMS Service Implementation
export class SMSService extends NotificationServiceInterface {
  send(message, phoneNumber) {
    console.log(`[SMS] To: ${phoneNumber}`);
    console.log(`[SMS] Message: ${message}`);
    console.log(`[SMS] Sent at: ${new Date().toISOString()}\n`);
    return true;
  }
}

// Push Notification Service
export class PushNotificationService extends NotificationServiceInterface {
  send(message, deviceToken) {
    console.log(`[PUSH] To: ${deviceToken}`);
    console.log(`[PUSH] Message: ${message}`);
    console.log(`[PUSH] Sent at: ${new Date().toISOString()}\n`);
    return true;
  }
}