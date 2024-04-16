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
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
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
        convertTimestampToDate({ created_at: 1594329060000 });
        const { article } = convertTimestampToDate(body);
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
    .then(( {body} ) => {
        expect(body.msg).toBe('404 - Not Found')
    })
  })
  test("GET 400: should respond with '400 - Bad Request' when passed an invalid id number", () => {
    return request(app)
    .get("/api/articles/article-one")
    .expect(400)
    .then(( {body} ) => {
        expect(body.msg).toBe('400 - Bad Request')
    })
  })
});


