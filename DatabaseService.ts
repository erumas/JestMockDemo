import { Pool } from 'pg';

export class Service {
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



  async updateUsername(userId: number): Promise<string> {
    const query = 'SELECT message FROM messages LIMIT 1';

    const updateQuery = `
        UPDATE users
        SET username = 'newUsername',
        email = 'testEmail@example.com',
        status = 'active'
        WHERE user_id = 1;`

    try {
      const res = await this.pool.query(query);
      return res.rows[0].message;     } catch (err) {
      console.error(err);
      return 'Error fetching message';
    }
  }
}
