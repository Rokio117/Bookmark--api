require("dotenv").config();
const knex = require(`knex`);
const supertest = require("supertest");
const app = require("../src/app");
const testHelpers = require("./testHelper");
const testData = require("./testData");

describe("register tests", () => {
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
    //sometimes passes sometimes fails based on the IID of jwt in the response
    //if failing try running independently
    it(`happy case, responds with new  user info andhashed pw and jwt token`, () => {
      const authToken = testHelpers
        .authHeader()
        .slice(7, testHelpers.authHeader().length);

      const expectedReturn = {
        id: 1,
        username: "Demo",

        authToken: authToken
      };
      return supertest(app)
        .post("/api/auth/register")
        .send(testData.newUser())

        .expect(expectedReturn);
    });
  });
});
