import { Service } from './service';


// Example of a class with depencency injection
//
export class Client {
  private service: Service;

  constructor(service: Service) {
    this.service = service;
  }

  async fetchMessage(): Promise<string> {
    return await this.service.getMessage();
  }
}

