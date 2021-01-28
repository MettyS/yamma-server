const knex = require('knex');
const app = require('../src/app');
const { resetIdSeq } = require('./test-helpers');
//users fixtures already include a hashed password to speed up test execution time
const usersFixture = require('./fixtures/users.fixture');
const usersToInsert = usersFixture.existingUsers.map((u) => ({
  username: u.username,
  password: u.hashedPassword,
  email: u.email,
}));

describe('authentication endpoints', function () {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  before('cleanup', async () => {
    await db('users').del();
    await resetIdSeq(db, 'users_id_seq');
  });
  before('insert previous users', () => db('users').insert(usersToInsert));
  describe(`/auth`, () => {
    context(`POST to login`, () => {
      it(`returns 400 if user doesn't exits`, () => {
        return supertest(app)
          .post('/auth/login')
          .send(usersFixture.nonExistingUser)
          .set('Content-Type', 'application/json')
          .expect(400);
      });

      usersFixture.existingUsers.forEach((user, i) => {
        const { username, plainPassword: password } = user;

        it(`returns 201 and JWT if valid credentials`, () => {
          return supertest(app)
            .post('/auth/login')
            .send({ username, password })
            .set('Content-Type', 'application/json')
            .expect(201)
            .then((res) => {
              expect(res.body).to.have.all.keys(['authToken']);
            });
        });

        it(`returns 400 if invalid credentials`, () => {
          return supertest(app)
            .post('/auth/login')
            .send({ username, password: usersFixture.invalidPasswords[i] })
            .set('Content-Type', 'application/json')
            .expect(400)
            .then((res) => {
              expect(res.body).to.have.all.keys(['error']);
              expect(res.body.error).to.equal(`Incorrect username or password`);
            });
        });
      });
    });

    context('POST /users', () => {
      // before('remove previous users', ()=>db('users').del());
      // after('insert previous users', ()=>db('users').insert(usersToInsert));
      usersFixture.existingUsers.forEach((user) => {
        const { username, email, plainPassword: password } = user;

        it('returns 400 if user already exists', () => {
          return supertest(app)
            .post('/users')
            .send({ username, email, password })
            .set('Content-Type', 'application/json')
            .expect(400)
            .then((res) => {
              expect(res.body.message).to.eql(`Invalid username`);
            });
        });
      });

      it('returns 201 and jwt if user added successfully', () => {
        const {
          username,
          email,
          plainPassword: password,
        } = usersFixture.newUser;
        return supertest(app)
          .post('/users')
          .send({ username, email, password })
          .set('Content-Type', 'application/json')
          .expect(201)
          .then((res) => {
            expect(res.body.authToken).to.exist;
          });
      });
    });
  });

  after('disconnect from the database', () => db.destroy());
});
