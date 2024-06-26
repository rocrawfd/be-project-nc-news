const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");
const { convertTimestampToDate } = require("../db/seeds/utils");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("GET 200: responds with a 200 status code and an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});



describe("GET /api", () => {
  test("GET 200: responds with an object of all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ endpoints });
      });
  });
});



describe("GET 404: /api/not-a-table", () => {
  test("GET 404: responds with a 404 status code and an error message", () => {
    return request(app)
      .get("/api/not-a-table")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 - Not Found");
      });
  });
});



describe("GET /api/articles/:article_id", () => {
  test("GET 200: responds with a 200 status code and the correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          })
        );
      });
  });
  test("GET 404: should respond with '404 - Not Found' when given a valid, but non-existent id number", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 - Not Found");
      });
  });
  test("GET 400: should respond with '400 - Bad Request' when passed an invalid id number", () => {
    return request(app)
      .get("/api/articles/article-one")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });
  test("GET 200 (FEATURE REQUEST): should now also return the comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.comment_count).toBe(11);
      });
  });
});



describe("GET api/articles", () => {
  test("GET 200: should respond with a status code of 200 and an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String), //maybe not string???
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("GET 200: articles should be ordered by date descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200 (QUERY): when using topic query, should return only articles with the requested topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("GET 200 (QUERY): when using topic query, if passed a topic that exists in the topics table, but has no articles, should return an empty array", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(0);
      });
  });
  test("GET 404 (QUERY): when passed a valid, but non existent topic query, should return '404 - Not Found'", () => {
    return request(app)
      .get("/api/articles?topic=cheese")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 - Not Found");
      });
  });
  test("GET 200: (FEATURE REQUEST): when passed a sort by query, should sort articles accordingly", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("topic", { descending: true });
      });
  });
  test("GET 404: (FEATURE REQUEST): when passed a sort by query with a key that does not exist, should return '404 - Not Found'", () => {
    return request(app)
      .get("/api/articles?sort_by=date")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 - Not Found");
      });
  });
  test("GET 200: (FEATURE REQUEST): when passed an order query, should return articles in the requested order", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at");
      });
  });
  test("GET 200: queries should be able to work together", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=comment_count&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("comment_count");
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("GET 200 (PAGE): should paginate when passed a query of limit", () => {
    return request(app)
    .get("/api/articles?limit=5")
    .expect(200)
    .then(({body}) => {
      const {articles} = body
      expect(articles).toHaveLength(5)
      expect(articles[0]).toMatchObject({article_id: 3})
    })
  })
  test("GET 200 (PAGE): should paginate, starting at a requested page when passed a p query", () => {
    return request(app)
    .get("/api/articles?limit=5&p=2")
    .expect(200)
    .then(({body}) => {
      const {articles} = body
      expect(articles).toHaveLength(5)
      expect(articles[0]).toMatchObject({article_id: 5})
      expect(articles[4]).toMatchObject({article_id: 4})
  })
})
test("GET 404: when attempting to access a valid page that does not exist, should return 404", () => {
  return request(app)
  .get("/api/articles?limit=10&p=3")
  .expect(404)
  .then(({body}) => {
    expect(body.msg).toBe('404 - Not Found')
  })
})
test("GET 400: when passed an invalid limit, should return 400", () => {
  return request(app)
  .get("/api/articles?limit=five")
  .expect(400)
  .then(({body}) => {
    expect(body.msg).toBe('400 - Bad Request')
  })
})
test("page limit defaults at 10 articles when passed only a page number query", () => {
  return request(app)
  .get("/api/articles?p=2")
  .expect(200)
  .then(({body}) => {
    const {articles} = body
    expect(articles).toHaveLength(3)
  })
})
test("returns the total_count of articles when there is a topic query", () => {
  return request(app)
  .get("/api/articles?topic=mitch")
  .expect(200)
  .then(({body}) => {
    expect(body.total_count).toBe(12)
  })
})
test("returns the toal count of articles when there is no topic query", () => {
  return request(app)
  .get("/api/articles")
  .expect(200)
  .then(({body}) => {
    expect(body.total_count).toBe(13)
  })
})
})



describe("GET api/articles/:article_id/comments", () => {
  test("GET 200: should respond with a status code of 200 and an array of comments linked to the requested article", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
              article_id: 5,
            })
          );
        });
      });
  });
  test("GET 200: the array should be in date order descending", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 404: when input a valid, but non-existent id number, should return '404 - Not Found'", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 - Not Found");
      });
  });
  test("GET 400: when input an invalid id, should respond with '400 - Bad Request", () => {
    return request(app)
      .get("/api/articles/article-seven/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });
  test("GET 200: when input an existing id, where the article has no comments, should respond with an empty array", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(0);
      });
  });
   test("GET 200 (COM PAGE): should limit articles presented when passed a limit query", () => {
    return request(app)
    .get("/api/articles/1/comments?limit=5")
    .expect(200)
    .then(({body}) => {
      const {comments} = body
      expect(comments).toHaveLength(5)
    })
   })
   test("GET 200(COM PAGE): should allow navigation to pages using p query", () => {
    return request(app)
    .get("/api/articles/1/comments?limit=4&&p=2")
    .expect(200)
    .then(({body}) => {
      const {comments} = body
      expect(comments).toHaveLength(4)
      expect(comments[0]).toMatchObject({comment_id: 7})
    })
   })
   test("GET 200(COM PAGE): limit should default to 10 when limit is not submitted", () => {
    return request(app)
    .get("/api/articles/1/comments?p=2")
    .expect(200)
    .then(({body}) => {
      const {comments} = body
      expect(comments).toHaveLength(1)
    })
   })
   test("GET 404 (COM PAGE): when attempting to access a valid page that does not exist, should return 404", () => {
    return request(app)
    .get("/api/articles/1/comments?limit=10&p=3")
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('404 - Not Found')
    })
  })
  test("GET 400 (COM PAGE): when passed an invalid limit, should return 400", () => {
    return request(app)
    .get("/api/articles/1/comments?limit=five")
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('400 - Bad Request')
    })
  })
});



describe("POST /api/articles/:article_id/comments", () => {
  test("POST 201: should create a new comment linked to the requested article, and respond with an object containing the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "this article saved my marriage!",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "this article saved my marriage!",
            author: "butter_bridge",
            votes: 0,
            created_at: expect.any(String),
            article_id: 2,
          })
        );
      });
  });
  test("POST 404: when input an valid, but non-existent id, should respond with an error of '404 - Not Found", () => {
    const newComment = {
      username: "butter_bridge",
      body: "this article saved my marriage!",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 - Not Found");
      });
  });
  test("POST 400: when input an invalid id, should return with a message of '400 - Bad Request'", () => {
    const newComment = {
      username: "butter_bridge",
      body: "this article saved my marriage!",
    };
    return request(app)
      .post("/api/articles/article-eight/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });
  test("POST 400: when attempting to post using an invalid data structure, should respond with '400 - Bad Request'", () => {
    const newComment = {
      user: "butter_bridge",
      comment: "this article saved my marriage!",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });
  test("POST 404: when passed a username that is not found in the user database, should return '404 - Not Found'", () => {
    const newComment = { username: "robbiedobbie", body: "sneaky" };
    return request(app)
      .post("/api/articles/4/comments")
      .send(newComment)
      .then(({ body }) => {
        expect(body.msg).toBe("404 - Not Found");
      });
  });
});



describe("PATCH /api/articles/:article_id", () => {
  test("PATCH 200: should increment the number of votes an article has by the specified amount, and respond with the patched article", () => {
    const voteChanger = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/2")
      .send(voteChanger)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: expect.any(String),
            created_at: expect.any(String),
            votes: 10,
            article_img_url: expect.any(String),
          })
        );
      });
  });
  test("PATCH 404: when given a valid, but non-existent, article id, should respond with '404 - Not Found'", () => {
    const voteChanger = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/9999")
      .send(voteChanger)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 - Not Found");
      });
  });
  test("PATCH 400: when given an invalid article id, should respond with '400 - Bad Request'", () => {
    const voteChanger = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/article-one")
      .send(voteChanger)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });
  test("PATCH 400: when trying to patch using an invalid data type, should return '400 - Bad Request", () => {
    const voteChanger = { inc_votes: "ten" };
    return request(app)
      .patch("/api/articles/2")
      .send(voteChanger)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });
  test("PATCH 400: when trying to patch using an invalid key, should return '400 - Bad Request", () => {
    const voteChanger = { votesGoUpBy: 10 };
    return request(app)
      .patch("/api/articles/2")
      .send(voteChanger)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });
});



describe("DELETE /api/comments/comment_id", () => {
  test("DELETE 204: should respond with a status code of 204", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE 404: when trying to delete using a valid, but non-existent id, should respond with '404 - Not Found'", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 - Not Found");
      });
  });
  test("DELETE 400: when trying to delete using an invalid id, should respond with '400 - Bad Request'", () => {
    return request(app)
      .delete("/api/comments/comment-twelve")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 - Bad Request");
      });
  });
});



describe("GET /api/users", () => {
  test("GET 200: should return a status code of 200 and respond with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
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
});



describe("GET /api/users/:username", () => {
  test("GET 200: should respond with a status code of 200 and an object containing the requested user", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual(
          expect.objectContaining({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          })
        );
      });
  });
  test("GET 404: when passed a valid but non-existent username, should return 404", () => {
    return request(app)
      .get("/api/users/robbiedobbie")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 - Not Found");
      });
  });
});



describe("PATCH /api/comments/:comment_id", () => {
  test("PATCH 200: should return a status code of 200 and respond with an object containing the patched comment", () => {
    const voteChanger = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1/")
      .send(voteChanger)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 17,
            author: "butter_bridge",
            article_id: 9,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("PATCH 404: when passed a valid but non-existent comment id, should return '404 - Not Found'", () => {
    const voteChanger = {inc_votes: 12}
    return request(app)
    .patch("/api/comments/9999")
    .send(voteChanger)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('404 - Not Found')
    })
  })
  test("PATCH 400: when passed an invalid comment id, should return 400 - Bad Request", () => {
    const voteChanger = {inc_votes: 12}
    return request(app)
    .patch("/api/comments/comment-twenty")
    .send(voteChanger)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('400 - Bad Request')
    })
  })
  test("PATCH 400: when passed an invalid data structure, should return 400 - Bad Request", () => {
    const voteChanger = {votes: 12}
    return request(app)
    .patch("/api/comments/1")
    .send(voteChanger)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('400 - Bad Request')
    })
  })
  test("PATCH 400: when passed an invalid key, should return 400 - Bad Request", () => {
    const voteChanger = {votes: 'twelve'}
    return request(app)
    .patch("/api/comments/1")
    .send(voteChanger)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('400 - Bad Request')
    })
  })
});



describe("POST /api/articles", () => {
  test("POST 201: responds with the updated article and a status code of 201", () => {
    const newArticle = {
      author: "butter_bridge", 
      title: "Dunder Mifflin might go bust",
      body: "With the rise of the Michael Scott Paper Company, Dunder Mufflin may be on its last legs. How the turntables...",
      topic: 'paper',
      article_img_url: "https://i.pinimg.com/originals/0e/ea/0e/0eea0ecff537de13628d7a065a535bc9.jpg"
    }
    return request(app)
    .post("/api/articles")
    .send(newArticle)
    .expect(201)
    .then(( {body} ) => {
      const {article} = body
      expect(article).toEqual(expect.objectContaining({
        article_id: 14,
        title: "Dunder Mifflin might go bust",
        author: "butter_bridge",
        topic: 'paper',
        body: "With the rise of the Michael Scott Paper Company, Dunder Mufflin may be on its last legs. How the turntables...",
        created_at: expect.any(String),
        article_img_url: "https://i.pinimg.com/originals/0e/ea/0e/0eea0ecff537de13628d7a065a535bc9.jpg",
        votes: 0,
        comment_count: 0
      }))
    })
  })
  test("POST 404: when passed a topic or user that does not exist, should return '404 - Not Found'", () => {
    const newArticle = {
      author: "whovian123", 
      title: "Why David Tennant is the greatest Doctor Who",
      body: "There is no denying David Tennant is a handsome man, a great actor and ,to many of a certain generation, the greatest Doctor of all time. But why? Is it his cheeky smile? His charming persona? His beautiful hair? The answer... is yes.",
      topic: 'doctor who',
      article_img_url: "https://www.bigissue.com/wp-content/uploads/2017/01/david-tennant_hero-pic.jpg"
    }
    return request(app)
    .post("/api/articles")
    .send(newArticle)
    .expect(404)
    .then(( {body} ) => {
      expect(body.msg).toEqual('404 - Not Found')
    })
  })
  test("POST 400: when passed invalid data, should return '400 - Bad Request'", () => {
    const newArticle = [{
      author: "butter_bridge", 
      body: "There is no denying David Tennant is a handsome man, a great actor and ,to many of a certain generation, the greatest Doctor of all time. But why? Is it his cheeky smile? His charming persona? His beautiful hair? The answer... is yes.",
      topic: 'paper',
      article_img_url: "https://www.bigissue.com/wp-content/uploads/2017/01/david-tennant_hero-pic.jpg"
    }]
    return request(app)
    .post("/api/articles")
    .send(newArticle)
    .expect(400)
    .then(( {body} ) => {
      expect(body.msg).toEqual('400 - Bad Request')
    })
  })
});



