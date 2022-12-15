const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

afterAll(() => {
  if (db.end) return  db.end();
});
beforeEach(() => {
  return seed(testData);
});



// an array of topic objects, each of which should have the following properties:
// slug
// description
// As this is the first endpoint you will need to set up your testing suite.

// Errors handled.


;

describe("GET /api/topics ", () => {
    test(' status 200 with an array of topic objects, each of which should have properties slug and a  description', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                const { topics } = body
                 expect(topics).toHaveLength(3);
                expect(topics).toBeInstanceOf(Array);
                expect(topics[0]).toHaveProperty('description')
                expect(topics[0]).toHaveProperty('slug');
                expect(typeof topics[0].description).toBe("string")
            });
    });
});

describe("GET /api/topic ", () => {
  test("when path error returns a 404 for bad path", () => {
    return request(app)
      .get("/api/topic ")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request sorry");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status:200, responds with a single matching article", () => {
    const ARTICLE_ID = 1;
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: ARTICLE_ID,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });
});
describe('Error handling', () => {
        test("status 404 when given an article_id that  isnt avaible yet", () => {
          return request(app)
            .get('/api/articles/10573')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("bad request sorry");
            });
        });
        test('status 400 when given an invalid article id', () => {
          return request(app)
            .get('/api/articles/hello_world')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad Request');
            });
        });
      });
    