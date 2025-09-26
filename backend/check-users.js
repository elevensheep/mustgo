const { Client } = require('pg');
require('dotenv').config();

async function checkUsers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('데이터베이스 연결 성공');
    
    const result = await client.query('SELECT uuid, email, password, LENGTH(password) as password_length FROM users ORDER BY created_at DESC LIMIT 5');
    
    console.log('최근 사용자들:');
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. 이메일: ${user.email}`);
      console.log(`   UUID: ${user.uuid}`);
      console.log(`   비밀번호 해시: ${user.password}`);
      console.log(`   해시 길이: ${user.password_length}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('오류:', error);
  } finally {
    await client.end();
  }
}

checkUsers();
