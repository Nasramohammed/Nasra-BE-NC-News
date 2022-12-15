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

describe("GET /api/topicz ", () => {
  test("when path error returns a 404 for bad path", () => {
    return request(app)
      .get("/api/topicz ")
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
    

describe('GET /api/articles', () => { 
  test(' should return status 200 and an array of article objects with the comment_count,', () => { 
    return request(app)
      .get('/api/articles')
      .expect (200)
      .then(({ body }) => {
         const { articles } = body;
        expect(articles).toHaveLength(12);
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String)
            })
          );
        }); 

    })
  })
   test('status 200, responds with array of article objects where it has a comment_count property', () => { 
    return request(app)
    .get('/api/articles')
    .expect(200)
      .then(({ body }) => {
        const { articles } = body 
        expect(articles[0]).toHaveProperty('comment_count')
        expect(articles[0].comment_count).toEqual("2")

      
    })
   })
})
describe('GET /api/articles', () => {
  test('respondes with articles in order of date desc : ', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        articles.forEach((article, index, list) => {
          if (index > 0) {
            expect(article.created_at < list[index - 1].created_at).toEqual(true);
          }
        });
      })
  })
});

describe('GET /api/articloos', () => {
  test("when path error returns a 404 for bad path", () => {
    return request(app)
      .get("/api/articloos ")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request sorry");
      });
  })
})





