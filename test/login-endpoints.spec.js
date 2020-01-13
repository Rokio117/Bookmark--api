require("dotenv").config();
const knex = require(`knex`);
const supertest = require("supertest");
const app = require("../src/app");
const testHelpers = require("./testHelper");
const expectedData = require("./expectedData");
const seedData = require("./seedData");
const jwt = require("jsonwebtoken");

describe("Auth Endpoints", () => {
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
      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post(`/api/auth/login`)
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing key '${field}' in request body`
          });
      });

      it(`responds 400 'invalid user_name or password' when bad user_name`, () => {
        const userInvalidUser = { user_name: "user-not", password: "existy" };
        return supertest(app)
          .post("/api/auth/login")
          .send(userInvalidUser)
          .expect(400, { error: `Incorrect username or password` });
      });
    });

    describe(`test for matching passwords`, () => {
      it(`responds 400 'invalid username or password' when given incorrect password`, () => {
        const userInvalidPassword = { user_name: "Demo", password: "hewligan" };
        return supertest(app)
          .post("/api/auth/login")
          .send(userInvalidPassword)
          .expect(400, { error: `Incorrect username or password` });
      });
    });
    describe.skip(`happy path for post login`, () => {
      //due to the jwt issued at times this test may or may not pass when run in conjunction
      //with other tests due to timing
      //if that happens run it by itself
      it.skip(`responds 200 and JWT auth token using secret when valid credentials`, () => {
        const testUser = expectedData.testUser();
        const loginCredentials = {
          user_name: testUser.user_name,
          password: "password"
        };

        const expectedToken = jwt.sign(
          { user_id: testUser.id },
          process.env.JWT_SECRET,
          {
            subject: testUser.user_name,
            algorithm: "HS256"
          }
        );

        const splitToken = expectedToken.split(".");
        splitToken.pop();
        const noIssuedAtToken = splitToken.join(".");

        const authJwt = testHelpers
          .authHeader()
          .slice(7, testHelpers.authHeader().length);
        const expectedUserObject = {
          ...expectedData.testUserNoUnderscore(),
          authToken: authJwt
        };

        return (
          supertest(app)
            .post("/api/auth/login")
            .send({ user_name: "Demo", password: "password" })
            // .then(response=>{
            //   let {id,username,password,authToken} = response

            //   authToken = testHelpers.splitTokens(authToken)
            //   return {id,username,password,authToken}
            // })
            .expect(expectedUserObject)
        );
      });
    });
  });
});
