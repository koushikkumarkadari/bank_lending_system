const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../../bank_lending.db');
const schemaPath = path.resolve(__dirname, 'create_database.sql');

// Read the SQL schema file
const schema = fs.readFileSync(schemaPath, 'utf8');

// Connect to the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database');
});

// Apply the schema
db.exec(schema, (err) => {
  if (err) {
    console.error('❌ Error applying schema:', err.message);
  } else {
    console.log('✅ Schema applied successfully');
  }
  db.close();
});