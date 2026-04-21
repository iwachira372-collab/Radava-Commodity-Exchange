const mysql = require('./backend/node_modules/mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'radava'
});

connection.connect((err) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
  
  const hash = '$2b$10$xDMMPW90.lQjX46nouPlTuAYJ5MVzYk7otm/iXLGCySQZTK/EBAsm';
  const email = 'test@test.com';
  
  connection.query('UPDATE users SET password = ? WHERE email = ?', [hash, email], (error) => {
    if (error) {
      console.error('Error updating password:', error.message);
    } else {
      console.log('✓ Test user password updated successfully!');
      console.log('Email: test@test.com');
      console.log('Password: password123');
    }
    connection.end();
    process.exit(0);
  });
});
