const app = require("../app")
const request = require("supertest")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")

beforeEach(() => seed(data))
afterAll(() => db.end())

describe("GET 400: /api/not-a-table", () => {
    test("GET 400: responds with a 400 status code and an error message", () => {
        return request(app)
        .get("/api/not-a-table")
        .expect(400)
        .then(( {body} ) => {
            console.log(body)
            expect(body.msg).toBe('400 - Bad Request')
        })
    })
})

describe("GET /api/topics", () => {
    test("GET 200: responds with a 200 status code and an array of all topics", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.topics.length).toBe(3)
            body.topics.forEach((topic) => {
                expect(typeof topic.description).toBe('string')
                expect(typeof topic.slug).toBe('string')
            })
        })
    })
})

