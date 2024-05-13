import { DatabaseService } from '../DatabaseService';


// Example of a class with depencency injection
export class Client {
  private service: DatabaseService;

  constructor(service: DatabaseService) {
    this.service = service;
  }

  async changeUsername(userId: number): Promise<string> {
    return await this.service.updateUsername(userId);
  }
}

