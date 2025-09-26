const { Client } = require('pg');

async function resetDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/mustgo'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // 기존 테이블 삭제
    await client.query('DROP TABLE IF EXISTS place_group_items CASCADE;');
    await client.query('DROP TABLE IF EXISTS place_groups CASCADE;');
    await client.query('DROP TABLE IF EXISTS places CASCADE;');
    await client.query('DROP TABLE IF EXISTS comments CASCADE;');
    await client.query('DROP TABLE IF EXISTS users CASCADE;');
    
    console.log('Tables dropped successfully');
    
    // 새로운 테이블 생성 (TypeORM이 자동으로 생성하도록)
    console.log('Database reset complete. Restart the server to recreate tables.');
    
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await client.end();
  }
}

resetDatabase();

