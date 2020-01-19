const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config");
const authService = {
  getUserWithUserName(knex, username) {
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
