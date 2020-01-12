require("dotenv").config();
const knex = require("knex");
const supertest = require("supertest");
const testHelpers = require("./testHelper");
const expectedData = require("./expectedData");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const seedData = require("./seedData");
const testData = require("./testData");
describe.only("bookmark endpoints", () => {
  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  before("clean the tables", () => {
    return testHelpers.cleanTables(db);
  });
  afterEach("clean the tables", () => testHelpers.cleanTables(db));
  after("disconnect from db", () => db.destroy());
  beforeEach("seed the table", () => {
    return testHelpers.seedUsers(db, seedData.users());
  });
  describe("happy case for post new book", () => {
    it("tests to see if the userbookinfo was submitted", () => {
      return (
        supertest(app)
          .post("/api/bookmark/Demo/books/add")
          //.set("Authorization", testData.authHeader())
          .send(testData.newBook())
          .expect(expectedData.expectedUserBookInfo())
      );
    });
  });
});

// describe("tests for post book", () => {
//   before("add user to tables", () => {
//     testHelpers.seedUsers(db, seedData.users());
//   });
//   const requiredKeys = Object.keys(testData.newBook());
//   requiredKeys.forEach(key => {
//     const bookToAdd = testData.newBook();
//     delete bookToAdd[key];
//     it("responds with 400 missing key __", () => {
//       return (
//         supertest(app)
//           .post(`/api/bookmark/userinfo/`)
//           .set("Content-Type", "application/json")
//           //.set(`Authorization`, `${testData.authHeader()}`)
//           .send(bookToAdd)
//           .expect(400, { error: `Missing key '${key}' in request body` })
//       );
//     });
//   });
// });
