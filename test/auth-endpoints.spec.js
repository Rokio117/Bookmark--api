const knex = require("knex");
const app = require("../src/app");
const testHelpers = require("./testHelper");

describe.only("Auth Endpoints", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());
});
