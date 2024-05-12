import { Client } from './client';
import { DatabaseService } from './service';


// Testing a class with dependency injection is relatively easy 
describe('Client', () => {
  it('should fetch message from the service', () => {
    // setup some rando id
    const testUserId = 3;

    // All we do is build our mock depenency 
    // fill it with jest factory fucntions that allow us to monitor and 
    const mockService = {
      updateUsername: jest.fn().mockReturnValue("Username has been updated bitch")
    };

    // We pass in our mocked "Database" service
    const client = new Client(mockService as unknown as Service);

    // EASY PEASY LEMON SQUEEZY
    expect(client.fetchMessage()).toBe("This is a mocked service");
    // Make sure that our mocked up database method was called
    expect(mockService.getMessage).toHaveBeenCalled();
    // Normally magic numbers in the code are bad, but for testsI like to user 'string' and numbers rather than variable references when possible as an extra level of assurance. Just in the odd case where you're comparing 'undefined' to undefined
    expect(mockService.getMesasge).toHaveBeenCalledWith(3)
  });
});

