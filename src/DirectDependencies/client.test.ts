import { Client } from './client';

const mockUpdateUsername = jest.fn()
jest.mock('../DatabaseService', () => ({
  DatabaseService: jest.fn().mockImplementation(() => ({
    updateUsername: () => mockUpdateUsername()
  })),
}))

describe('Client', () => {
  beforeAll(() => {
    // mockQuery.mockReturnValue("Mock query at Direct Dependency Level");

  });

  it('should fetch a message successfully', async () => {
    mockUpdateUsername.mockReturnValue("mockDbService.updateUsername(), what a mock");

    const userId = 1;
    const client = new Client();
    const message = await client.changeUsername(userId);
    expect(message).toBe("mockDbService.updateUsername(), what a mock");
  });

  it('should fetch a message successfully', async () => {
    mockUpdateUsername.mockReturnValue("REALLY_RARE_EDGE_CASE");

    const userId = 1;
    const client = new Client();
    const message = await client.changeUsername(userId);
    expect(message).toBe("This is the other logic IN CLIENT that will definitely break prod some day");
  });

});
