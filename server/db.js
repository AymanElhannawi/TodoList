const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "3362951",
  host: "localhost",
  port: 5432,
  database: "perntodo"
});

module.exports = pool;