import { DatabaseService } from './DatabaseService'

const mockQuery = jest.fn()
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    query: () => mockQuery()
  })),
}))


describe('Client', () => {
  beforeAll(() => {
//        mockUpdateUsername.mockReturnValue("Wow, what a mock");
    });

  it('should fetch a message successfully', async () => {
    mockQuery.mockReturnValue("mockPgClient.query() returned from postgres client level");

    const userId = 1;
    const databaseService = new DatabaseService();
    const message = await databaseService.updateUsername(userId);
    expect(message).toBe("mockPgClient.query() returned from postgres client level");
  });

  it('should fetch a message successfully', async () => {
    mockQuery.mockReturnValue("BREAKING_CASE");

    const userId = 1;
    const databaseService = new DatabaseService();
    const message = await databaseService.updateUsername(userId);
    expect(message).toBe("This is the other logic that will definitely break prod some day");
  });

});

