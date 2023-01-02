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
  test("status 200, expect empty array where there are no comments for an existing article.", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);
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
  
   test("status 404 when given an article_id that isnt avaible yet", () => {
     return request(app)
       .get("/api/articles/2000/comments")
       .expect(404)
       .then(({ body }) => {
         expect(body.msg).toBe("bad request sorry");
       });
   });
  
});

describe("7. POST /api/articles/:article_id/comments", () => {
  // POST REQUEST 
  test("status 201, responds with posted comment ", () => {
    const newComment = {
      username: "lurker",
      body: "hello world",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            article_id: 1,
            votes: 0,
            author: "lurker",
            body: "hello world",
          })
        );
      });
  });
  test('should test types and return 201  respondes with posted comment ', () => {
    const newComment = {
      username: "icellusedkars",
      body: "hello world",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            votes: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
          })
        );
      });
  });
  test('status:201, ignores any added extra properties.', () => {
    const path = '/api/articles/9/comments';
    return request(app)
      .post(path)
      .send({
        username: 'lurker',
        body: 'hello world',
        newComment: 2,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            article_id: 9,
            author: 'lurker',
            body: 'hello world',
          }),
        );
      });
  });
});

describe('Error handling ', () => { 
  it('status:404, error when given an a article id which does not exist in the database yet.', () => {
      return request(app)
        .post('/api/articles/100/comments')
        .send({ username: 'lurker', body: 'newest comment added' })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual('bad request sorry');
        });
    });
    it('status:400, error when passed an article_id that doesnt exist or is invalid.', () => {
      return request(app)
        .post('/api/articles/hello_world/comments')
        .send({ username: 'rogersop', body: 'my type of thing to read ' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('Bad Request');
        });
    });

    it('status:400, when forgot to pass a body or pass an empty body.', () => {
      return request(app)
        .post('/api/articles/9/comments')
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('Bad Request');
        });
    });

    // it('status:400, error when passed a body with incorrect value or type.', () => {
    //   return request(app)
    //     .post('/api/articles/9/comments')
    //     .send({ username: 'lurker', body: 100 })
    //     .expect(400)
    //     .then(({ body }) => {
    //       expect(body.msg).toEqual('Bad Request');
    //     });
    // });
    it('status:400, error when passed an incorrect key.', () => {
      return request(app)
        .post('/api/articles/8/comments')
        .send({ dog: 'lurker', body: 'last comment i swear' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('Bad Request');
        });
    });
  });

describe('PATCH /api/articles/:article_id', () => {
  it('status:200, patches the article with article_id specified with an updated vote count, returning the updated article.', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: -25 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 75,
          }),
        );
      });
  });
})


// error handling patch request 





describe('GET /api/users', () => {
  // GET USERS
  test(" should return status 200 and an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        expect(users).toBeInstanceOf(Array);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("should return 404 error for bad path", () => {
    return request(app)
      .get("/api/userrs ")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request sorry");
      });
  });
})


describe('DELETE /api/comments/:comment_id', () => {
    // DELETE REQUEST 
    it('204: deletes specified comment', () => {
      return request(app)
        .delete('/api/comments/2')
        .expect(204);
    });
    it('404: error when passed a valid ID that is missing in the db', () => {
      return request(app)
        .delete('/api/comments/10000')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request sorry");
        });
    });
    it('400: error when passed invalid id', () => {
      return request(app)
        .delete('/api/comments/badId')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });

