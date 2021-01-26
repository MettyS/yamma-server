const knex = require('knex');
const app = require('../src/app');
const { resetIdSeq } = require('./test-helpers');
const { createJwt } = require('../src/auth/auth-service');

const commentsFixture = require('./fixtures/comments.fixture');
const commentsToInsert = commentsFixture.validComments.map(
  ({ id, archived, ...c }) => c
);
const usersFixture = require('./fixtures/users.fixture');
const usersToInsert = usersFixture.existingUsers.map((u) => ({
  username: u.username,
  password: u.hashedPassword,
  email: u.email,
}));
const eventsFixture = require('./fixtures/events.fixture');
const eventsToInsert = eventsFixture.validEvents.map(
  ({ id, archived, ...u }) => u
);

describe('comments endpoints', function () {
  let db = null;
  let validJwt = null;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  before('remove all previous data', async () => {
    await db('comments').del();
    await resetIdSeq(db, 'comments_id_seq');

    await db('events').del();
    await resetIdSeq(db, 'events_id_seq');

    await db('users').del();
    await resetIdSeq(db, 'users_id_seq');
  });

  before('insert users', () => db('users').insert(usersToInsert));
  before('insert events', () => db('events').insert(eventsToInsert));
  before('insert comments', () => db('comments').insert(commentsToInsert));
  before('create valid jwt', () => {
    validJwt = usersToInsert.map((u, i) => createJwt(u.username, { user_id: i+1 }));
  });

  after('remove all previous data', async () => {
    await db('comments').del();
    await resetIdSeq(db, 'comments_id_seq');

    await db('events').del();
    await resetIdSeq(db, 'events_id_seq');

    await db('users').del();
    await resetIdSeq(db, 'users_id_seq');
  });

  describe('/comments/events', () => {
    context('/:eventId', async () => {
      context('GET /:eventId', () => {
        eventsToInsert.forEach((_, index) => {
          it('GET returns all comments for a specific event', async () => {
            const { body } = await supertest(app)
              .get(`/comments/events/${index + 1}`)
              .expect(200);
            const dbComments = await db('comments')
              .select()
              .where({ event_id: index + 1 })
              .orderBy([{ column: 'date_created', order: 'asc' }]);
            expect(
              body.comments.map((c) => ({
                ...c,
                date_created: new Date(c.date_created),
              }))
            ).to.eql(dbComments);
          });
        });
      });

      context('POST /:eventId', () => {
        eventsToInsert.forEach((event, index) => {
          const event_id = index + 1;
          it('returns 400 if invalid credentials', () => {
            return supertest(app)
              .post(`/comments/events/${event_id}`)
              .set('Authorization', `Bearer invalid.jwt`)
              .expect(401);
          });

          it('returns 201 if valid credentials', async () => {
            const jwt = validJwt[Math.floor(Math.random() * validJwt.length)];
            //sub is the username
            const { user_id, sub}  = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString('utf8'));
            const newComment = commentsFixture.newComment(user_id, event_id, sub);
            const { body } = await supertest(app)
              .post(`/comments/events/${event_id}`)
              .send(newComment)
              .set('Authorization', `Bearer ${jwt}`)
              .expect(201);
            const dbData = await db('comments').select().where({ id: body.id }).first();
            expect(dbData).to.eql({ ...body, date_created: new Date(body.date_created) });
          });
        });
      });
    });
  });
});
