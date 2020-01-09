const express = require("express");
const jsonBodyParser = express.json();
const jwt = require("jsonwebtoken");
const config = require("../config");
const authService = {
  getUserWithUserName(knex, username) {
    //retuns array where index 0 is player
    return knex
      .select("*")
      .from("bookmark_users")
      .where({ username });
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: "HS256"
    });
  }
};

module.exports = authService;
