const express = require("express");
const bookmarkService = require("./bookmark-service");
const authService = require("./auth-service");
const knex = require("knex");
const bcrypt = require("bcryptjs");
const config = require("../config");
const jwt = require("jsonwebtoken");
const notNullStringKeys = [
  "googleid",
  "title",
  "ontab",
  "notetitle",
  "notecontent",
  "user_name",
  "password",
  "repeat_password"
];

const notNullArrayKeys = ["authors"];

const stringOrNullKeys = [
  "coverart",
  "startedon",
  "finishedon",
  "description",
  "notedate"
];

const numberOrNullKeys = ["currentPage", "userid", "bookInfoId"];

const allPossibleKeys = [
  ...notNullStringKeys,
  ...notNullArrayKeys,
  ...stringOrNullKeys,
  ...numberOrNullKeys
];

function validateRequiredKeys(requiredKeys = []) {
  //make sure correct keys are present for each endpoint
  return function(req, res, next) {
    const sentKeys = Object.keys(req.body) ? Object.keys(req.body) : [];
    requiredKeys.forEach(key => {
      if (!sentKeys.includes(key)) {
        //evaluates if all required keys are received
        let err = new Error(`Missing key '${key}' in request body`);
        err.status = 400;
        return next(err);
      }
    });

    sentKeys.forEach(sentKey => {
      if (!requiredKeys.includes(sentKey)) {
        let err = new Error(`Unnecessary key ${sentKey} in request body`);
        err.status = 400;
        return next(err);
      }
    });
    return next();
  };
}

function validateValueTypes(req, res, next) {
  if (req.body && req.body !== {}) {
    const receivedKeys = Object.keys(req.body);
    receivedKeys.forEach(receivedKey => {
      if (!allPossibleKeys.includes(receivedKey)) {
        let err = new Error(`Unexpected key ${receivedKey} in body`);
        err.status = 400;

        return next(err);
      }
      if (notNullStringKeys.includes(receivedKey)) {
        if (
          typeof req.body[receivedKey] !== "string" ||
          !req.body[receivedKey]
        ) {
          let err = new Error(`${receivedKey} must be a string`);
          err.status = 400;

          return next(err);
        }
      }
      if (notNullArrayKeys.includes(receivedKey)) {
        if (Array.isArray(req.body[receivedKey])) {
          let err = new Error(`${receivedKey} must be an array`);
          err.status = 400;
          return next(err);
        }
      }
      if (stringOrNullKeys.includes(receivedKey)) {
        if (
          typeof req.body[receivedKey] !== "string" ||
          req.body[receivedKey] !== null
        ) {
          let err = new Error(`${receivedKey} must be a string or null`);
          err.status = 400;

          return next(err);
        }
      }
      if (numberOrNullKeys.includes(receivedKey)) {
        if (typeof req.body[receivedKey] !== "number") {
          let err = new Error(`${receivedKey} must be a number or null`);
          err.status = 400;

          return next(err);
        } else if (req.body[receivedKey] !== null) {
          let err = new Error(`${receivedKey} must be a number or null`);
          err.status = 400;

          return next(err);
        }
      }
    });
    next();
  }
}

function catchError(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Unknown server error";
  return res.status(status).json({
    error: message
  });
}

function userExists(req, res, next) {
  // sets user property to req

  authService
    .getUserWithUserName(req.app.get("db"), req.body.user_name)
    .then(user => {
      if (req.body.repeat_password) {
        if (user.length) {
          let err = new Error("Username is taken");
          err.status = 400;
          return next(err);
        }
      } else if (!user.length) {
        let err = new Error("Incorrect username or password");
        err.status = 400;
        return next(err);
      }
      req.user = user[0];
      next();
    });
}

function checkPasswords(req, res, next) {
  //this must be called after userExists or req.user has been called

  return bcrypt
    .compare(req.body.password, req.user.password)
    .then(passwordsMatch => {
      if (!passwordsMatch) {
        let err = new Error("Incorrect username or password");
        err.status = 400;
        return next(err);
      }
      next();
    });
}

function verifyJwt(req, res, next) {
  const authToken = req.get("Authorization") || "";
  let bearerToken;
  if (!authToken.toLowerCase().startsWith("bearer")) {
    let err = new Error(`Missing bearer token`);
    err.status = 401;
    return next(err);
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }
  try {
    jwt.verify(bearerToken, config.JWT_SECRET, {
      algorithms: ["HS256"]
    });
  } catch (error) {
    let err = new Error("Unauthorized request");
    err.status = 401;
    return next(err);
  }
  next();
}

function validateBookExists(req, res, next) {
  bookmarkService
    .findBook(req.app.get("db"), req.body.bookInfoId)
    .then(result => {
      if (result.length === 0) {
        let err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }
      next();
    });
}

function verifyTab(req, res, next) {
  const expectedTabs = ["finished", "current", "upcoming"];
  if (!expectedTabs.includes(req.body.ontab)) {
    let err = new Error(
      "Tab must be one of 'finished', 'current', or 'upcoming'"
    );
    err.status = 400;
    return next(err);
  }
  next();
}

module.exports = {
  validateRequiredKeys,
  validateValueTypes,
  catchError,
  userExists,
  checkPasswords,
  verifyJwt,
  validateBookExists,
  verifyTab
};
