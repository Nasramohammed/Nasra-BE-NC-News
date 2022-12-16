const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
require("jest-sorted");

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



describe("6.GET /api/articles/:article_id/comments", () => {
  test("status 200: repondes with an array of comments for a given artical_id", () => {

    return request(app)
      .get(`/api/articles/1/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject(
            expect.objectContaining({
              comment_id: expect.any(Number),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test('status 200, respondes with sorted array according to given query', () => { 
    return request(app)
      .get("/api/articles/1/comments?sort_by=created_at")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy('created_at', { descending: true });
      });
    
  })
  test("status 200, expect response to be an array of  sorted by given query", () => {
    return request(app)
      .get("/api/articles/1/comments?sort_by=votes")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("votes", { descending: true });
      });
  });
});
describe("Error Handling ", () => {
  test("sort_by a non existing query should return 400 bad request ", () => {
    return request(app)
      .get("/api/articles/1/comments?sort_by=created_banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test(" path error returns a 404", () => {
    return request(app)
      .get("/api/articles/1/comme")
      .expect(404)
  })
   test("status 400 if article_id is invalid", () => {
     return request(app)
       .get("/api/articles/hello/comments")
       .expect(400);
   });
  
});



