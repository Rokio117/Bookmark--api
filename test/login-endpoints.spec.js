require("dotenv").config();
const knex = require(`knex`);
const supertest = require("supertest");
const app = require("../src/app");
const testHelpers = require("./testHelper");
const expectedData = require("./expectedData");
const seedData = require("./seedData");
const jwt = require("jsonwebtoken");

describe.skip("Auth Endpoints", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  //const allData = seedData.allTestData();

  after("disconnect from db", () => db.destroy());
  before("clean tables", () => testHelpers.cleanTables(db));
  afterEach("clean tables", () => testHelpers.cleanTables(db));

  describe(`Post /api/auth/login`, () => {
    beforeEach(`Insert users`, () => {
      return testHelpers.seedUsers(db, seedData.users());
    });
    const requiredFields = ["user_name", "password"];

    requiredFields.forEach(field => {
      const testUser = expectedData.testUser();

      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password
      };
      it.skip(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post(`/api/auth/login`)
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing key '${field}' in request body`
          });
      });

      it.skip(`responds 400 'invalid user_name or password' when bad user_name`, () => {
        const userInvalidUser = { user_name: "user-not", password: "existy" };
        return supertest(app)
          .post("/api/auth/login")
          .send(userInvalidUser)
          .expect(400, { error: `Incorrect username or password` });
      });
    });
    describe.skip(`Testing user_name and password data types`, () => {
      const keys = ["user_name", "password"];

      keys.forEach(key => {
        let testUser = expectedData.testUserNoId();
        testUser[key] = false;
        it(`responds 400 'incorrect data type' when sending in wrong data types`, () => {
          return supertest(app)
            .post("/api/auth/login")
            .send(testUser)
            .expect({ error: `${key} must be a string` });
        });
      });
    });
    describe.skip(`test for matching passwords`, () => {
      it(`responds 400 'invalid username or password' when given incorrect password`, () => {
        const userInvalidPassword = { user_name: "Demo", password: "hewligan" };
        return supertest(app)
          .post("/api/auth/login")
          .send(userInvalidPassword)
          .expect(400, { error: `Incorrect username or password` });
      });
    });
    describe(`happy path for post login`, () => {
      it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
        const testUser = expectedData.testUser();
        const loginCredentials = {
          user_name: testUser.user_name,
          password: "password"
        };
        //console.log(db.select('*').from("bookmark_users"))
        const expectedToken = jwt.sign(
          { user_id: testUser.id },
          process.env.JWT_SECRET,
          {
            subject: testUser.user_name,
            algorithm: "HS256"
          }
        );
        const expectedUserObject = {
          ...expectedData.testUserNoUnderscore(),
          authToken: expectedToken
        };
        return supertest(app)
          .post("/api/auth/login")
          .send({ user_name: "Demo", password: "password" })
          .expect(expectedUserObject);
      });
    });
  });
});
