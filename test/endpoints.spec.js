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
    //return testHelpers.seedUsers(db, seedData.users());
    return testHelpers.seedAllTables(db, seedData.allTestData());
  });
  describe.skip("happy case for post new book", () => {
    it("tests to see if the userbookinfo was submitted", () => {
      //const authHeader = testData.authHeader();

      const user = {
        username: "Demo",
        password:
          "$2a$12$XFXXLoeBCpkD6nkZtdoSEeI.6BEpEk4cC/djrnYB/Da8HjkC/tmzi",
        id: 1
      };
      const authHeader = testHelpers.makeAuthHeader(
        user,
        process.env.JWT_SECRET
      );

      return supertest(app)
        .post("/api/bookmark/userinfo/Demo/books/add")
        .set("Authorization", authHeader)
        .send(testData.newBook())
        .expect(expectedData.expectedUserBookInfo());
    });
  });
  describe("Happy case for deleting a user book info", () => {
    it("delets a book", () => {
      return supertest(app)
        .delete("/api/bookmark/Demo/book/delete")
        .set("Authorization", testHelpers.authHeader())
        .send({ bookInfoId: 1 })
        .expect(200);
    });
  });
  describe.only("Happy test for deleting a note", () => {
    it("delets a note", () => {
      return supertest(app)
        .delete("/api/bookmark/Demo/notes")
        .set("Authorization", testHelpers.authHeader())
        .send({ noteId: 1 })
        .expect(200);
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

//book for add book
// {
// 	"ontab":"current",
// 	"currentpage":null,
// 	"startedon":null,
// 	"finishedon":null,
// 	"userid":1,
// 	"title":"Go Fish",
// 	"coverart":"alksda",
// 	"description":"Go fish",
// 	"googleid":"12345"

// }
