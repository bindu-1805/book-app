const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_name',
  password: 'postgres_password',
  port: 5432,
});

module.exports = pool;
