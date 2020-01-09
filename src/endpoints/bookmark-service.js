const bcrypt = require("bcryptjs");

const helpers = {
  registerUser(knex, userObject) {
    return knex
      .insert(userObject)
      .into("bookmark_users")
      .returning("*");
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  }
};

module.exports = helpers;
