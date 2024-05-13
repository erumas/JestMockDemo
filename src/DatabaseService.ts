import { Pool } from 'pg';

export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: 'user',
      host: '<some k8s host you are scared to break>',
      database: 'STAGE_database',
      password: '<iamsuchasupergoodprogrammer>',
      port: 5432,
    });
  }



  async updateUsername(userId: number): Promise<any> {

    const updateQuery = `
        UPDATE users
        SET username = 'newUsername',
        email = 'testEmail@example.com',
        status = 'active'
        WHERE user_id = ${userId};`

    try {
      // who cares that we don't use this, it isn't a real db anyway 
      const result = await this.pool.query(updateQuery);
      if (typeof result ==='string' && result === 'BREAKING_CASE') {
        return "This is the other logic that will definitely break prod some day"           
      }


      return await this.pool.query(updateQuery);
    } catch (err) {
      console.error(err);
      return 'Error fetching message';
    }
  }
}
