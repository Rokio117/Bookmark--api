const app = require("./app");
const knex = require("knex");

const { PORT, DATABASE_URL, TEST_DATABASE_URL, NODE_ENV } = require("./config");

const db = knex({
  client: "pg",
  connection: NODE_ENV === "test" ? TEST_DATABASE_URL : DATABASE_URL
});

app.set("db", db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
