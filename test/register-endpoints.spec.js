require("dotenv").config();
const knex = require(`knex`);
const supertest = require("supertest");
const app = require("../src/app");
const testHelpers = require("./testHelper");
const expectedData = require("./expectedData");
const seedData = require("./seedData");
const jwt = require("jsonwebtoken");
const testData = require("./testData");

describe.only("register tests", () => {
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });
  after("disconnect from db", () => db.destroy());
  before("clean tables", () => testHelpers.cleanTables(db));
  afterEach("clean tables", () => testHelpers.cleanTables(db));

  describe("Post /api/auth/register", () => {
    it(`happy case, responds with new  user info andhashed pw and jwt token`, () => {
      return supertest(app)
        .post("/api/auth/register")
        .send(testData.newUser())
        .expect(expectedData.registeredUser(testData.newUser()));
    });
  });
});
