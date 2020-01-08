require("dotenv").config();
const knex = require(`knex`);
const supertest = require("supertest");
const app = require("../src/app");
const testHelpers = require("./testHelper");
const expectedData = require("./expectedData");
const seedData = require("./seedData");

describe.only("Auth Endpoints", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });
  console.log(db, "db in test");

  //const allData = seedData.allTestData();

  after("disconnect from db", () => db.destroy());
  before("clean tables", () => testHelpers.cleanTables(db));
  afterEach("clean tables", () => testHelpers.cleanTables(db));

  describe(`Post /api/auth/login`, () => {
    beforeEach(`Insert users`, () => {
      testHelpers.seedUsers(db, seedData.users);
    });
    const requiredFields = ["user_name", "password"];

    requiredFields.forEach(field => {
      const testUser = expectedData.testUser();

      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password
      };
      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];
        console.log(loginAttemptBody, "body after deleting field");
        return supertest(app)
          .post(`/api/auth/login`)
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`
          });
      });
    });
  });
});
