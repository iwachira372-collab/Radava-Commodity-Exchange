#!/usr/bin/env node

const mysql = require('./backend/node_modules/mysql');
const fs = require('fs');

// Create connection without database first
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

const sqlFile = fs.readFileSync('/Users/ms/Desktop/Rx_Radava/Rxchange-Code-for-UNICEF-Venture-Fund-master/init_db.sql', 'utf8');

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  }
  
  console.log('Connected to MySQL');
  
  // Split SQL statements and execute them
  const statements = sqlFile.split(';').filter(stmt => stmt.trim());
  
  let executed = 0;
  
  const executeNext = () => {
    if (executed >= statements.length) {
      console.log('✓ Database initialized successfully!');
      connection.end();
      process.exit(0);
    }
    
    const stmt = statements[executed].trim();
    if (!stmt) {
      executed++;
      executeNext();
      return;
    }
    
    connection.query(stmt, (error, results) => {
      if (error) {
        console.error('Error executing statement:', error.message);
        console.error('Statement:', stmt.substring(0, 100) + '...');
      } else {
        console.log(`✓ Executed statement ${executed + 1}/${statements.length}`);
      }
      executed++;
      executeNext();
    });
  };
  
  executeNext();
});
