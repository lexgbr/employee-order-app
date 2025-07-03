const bcrypt = require('bcryptjs');

const hash = '$2b$10$xzPM0n6muIFaiUNZ8e0e1OQtqSibMICqCArLut8gf4m0H0Zk.dMPi';
const inputPassword = 'test123'; // try the password you want to test

bcrypt.compare(inputPassword, hash).then(result => {
  console.log(result ? '✅ Password matches' : '❌ Incorrect password');
});
