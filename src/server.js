require('dotenv').config();
const app = require('./app');
const { PORT } = require('./config');
const knex = require('knex');

const DB_URL = process.env.NODE_ENV === 'test'
                ? process.env.TEST_DATABASE_URL
                : process.env.DATABASE_URL;

const db = knex({
  client: 'pg',
  connection: DB_URL,
});



app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
