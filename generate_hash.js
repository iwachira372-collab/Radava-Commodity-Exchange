const bcrypt = require('./backend/node_modules/bcrypt');

const password = 'password123';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('Hash:', hash);
