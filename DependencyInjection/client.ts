import { Service } from './service';

export class Client {
  private service: Service;

  constructor(service: Service) {
    this.service = service;
  }

  async fetchMessage(): Promise<string> {
    return await this.service.getMessage();
  }
}

