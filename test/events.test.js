const knex = require('knex');
const app = require('../src/app');
const { resetIdSeq } = require('./test-helpers');
//users fixtures already include a hashed password to speed up test execution time
const eventsFixture = require('./fixtures/events.fixture');
const eventsToInsert = eventsFixture.validEvents.map(
  ({ id, archived, ...u }) => u
);

describe('events endpoints', function () {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  before('cleanup', () => db('events').del());
  before('insert events', () => db('events').insert(eventsToInsert));
  after('remove all events', async () => {
    await db('events').del();
    //delete doesn't restart identity so:
    await resetIdSeq(db, 'events_id_seq');
  });
  describe('GET /events', () => {
    it('returns 50 events', () => {
      return supertest(app)
        .get('/events')
        .expect(200)
        .then((res) => {
          expect(res.body.events).to.be.an('array');
          expect(res.body.events[0]).to.have.all.keys([
            'id',
            'title',
            'categories',
            'description',
            'event_img',
            'source_name',
            'source_url',
            'source_img',
            'date_created',
            'date_published',
            'archived',
          ]);
          expect(res.body.events.length).to.be.equal(50);
        });
    });

    // TODO: create array of categories to check automatically
    it('returns events by category', () => {
      return supertest(app)
        .get('/events?category=west')
        .expect(200)
        .then((res) => {
          expect(res.body.events).to.be.an('array');
          expect(res.body.events[0]).to.have.all.keys([
            'id',
            'title',
            'categories',
            'description',
            'event_img',
            'source_name',
            'source_url',
            'source_img',
            'date_created',
            'date_published',
            'archived',
          ]);
          expect(res.body.events[0].categories.toLowerCase().includes('west'))
            .to.be.true;
        });
    });
    for (let i = 1; i <= eventsToInsert.length; i++) {
      it('returns events by ID', async () => {
        const { body } = await supertest(app).get(`/events/${i}`).expect(200);
        const dbData = await db('events').select().where({ id: i }).first();
        expect({
          ...body,
          date_created: new Date(body.date_created),
          date_published: new Date(body.date_published),
        }).to.eql(dbData);
      });
    }
  });
});
