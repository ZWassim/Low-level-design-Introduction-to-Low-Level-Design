export class Logger {
  constructor(level = 'INFO') {
    this.level = level;
    this.levels = {
      'ERROR': 0,
      'WARN': 1,
      'INFO': 2,
      'DEBUG': 3
    };
  }
  
  log(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }
  
  error(message, error = null) {
    if (this.levels[this.level] >= this.levels['ERROR']) {
      console.error(`[ERROR] ${message}`);
      if (error) console.error(error);
    }
  }
  
  info(message, data = null) {
    if (this.levels[this.level] >= this.levels['INFO']) {
      this.log(`[INFO] ${message}`, data);
    }
  }
  
  debug(message, data = null) {
    if (this.levels[this.level] >= this.levels['DEBUG']) {
      this.log(`[DEBUG] ${message}`, data);
    }
  }
}