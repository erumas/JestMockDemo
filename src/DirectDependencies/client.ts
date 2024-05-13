import { DatabaseService } from './../DatabaseService';

export class Client {
  private service: DatabaseService;
    // This dependency is directly instantiated, which makes it more of a pain in the ass to mock out 
    
    // lets not write a test for this one.. 
    // it's fine barely any logic here..
  constructor() {
    this.service = new DatabaseService();  
  }

  async changeUsername(userId: number): Promise<string> {
    try {
      const result = await this.service.updateUsername(userId);

    if(result === "REALLY_RARE_EDGE_CASE") {
      return "This is the other logic IN CLIENT that will definitely break prod some day"
    }
      return result
    } catch (error) {
      console.error(error);
      return 'Error fetching message';
    }
  }
}

