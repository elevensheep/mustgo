const bcrypt = require('bcrypt');

async function testPasswordHashing() {
  const password = 'test123';
  console.log('원본 비밀번호:', password);
  
  const hashed = await bcrypt.hash(password, 10);
  console.log('해시된 비밀번호:', hashed);
  console.log('해시 길이:', hashed.length);
  
  const isValid = await bcrypt.compare(password, hashed);
  console.log('비밀번호 검증 결과:', isValid);
  
  // 다른 비밀번호로 테스트
  const wrongPassword = 'wrong123';
  const isWrongValid = await bcrypt.compare(wrongPassword, hashed);
  console.log('잘못된 비밀번호 검증 결과:', isWrongValid);
}

testPasswordHashing().catch(console.error);
