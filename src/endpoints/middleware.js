const express = require("express");
const bookmarkService = require("./bookmark-service");
const authService = require("./auth-service");
const knex = require("knex");
const bcrypt = require("bcryptjs");

const notNullStringKeys = [
  "googleid",
  "title",
  "ontab",
  "notetitle",
  "notecontent",
  "user_name",
  "password"
];

const notNullArrayKeys = ["authors"];

const stringOrNullKeys = [
  "coverart",
  "startedon",
  "finishedon",
  "description",
  "notedate"
];

const numberOrNullKeys = ["currentPage"];

const allPossibleKeys = [
  ...notNullStringKeys,
  ...notNullArrayKeys,
  ...stringOrNullKeys,
  ...numberOrNullKeys
];

function validateRequiredKeys(requiredKeys = []) {
  //make sure correct keys are present for each endpoint
  //
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
      // if(!allPossibleKeys.includes(sentKey)){
      //   //evaluates if all received keys are needed somewhere in the app
      //   let err = new Error(`Unexpected key '${sentKey}, in request body`)
      // }
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
    //if there is a req body and it isn't empty
    const receivedKeys = Object.keys(req.body);
    receivedKeys.forEach(receivedKey => {
      if (!allPossibleKeys.includes(receivedKey)) {
        let err = new Error(`Unexpected key ${receivedKey} in body`);
        err.status = 400;
        console.log("1");
        return next(err);
      }
      if (notNullStringKeys.includes(receivedKey)) {
        //if required string keys includes the key
        if (
          typeof req.body[receivedKey] !== "string" ||
          !req.body[receivedKey]
        ) {
          //if the key's value is not a string
          let err = new Error(`${receivedKey} must be a string`);
          err.status = 400;
          console.log("2");
          return next(err);
        }
      }
      if (notNullArrayKeys.includes(receivedKey)) {
        //if required array list includes the key
        if (Array.isArray(req.body[receivedKey])) {
          let err = new Error(`${receivedKey} must be an array`);
          err.status = 400;
          console.log("3");
          return next(err);
        }
      }
      if (stringOrNullKeys.includes(receivedKey)) {
        //if list of keys that can be either strings or null includes this key
        if (
          typeof req.body[receivedKey] !== "string" ||
          req.body[receivedKey] !== null
        ) {
          let err = new Error(`${receivedKey} must be a string or null`);
          err.status = 400;
          console.log("4");
          return next(err);
        }
      }
      if (numberOrNullKeys.includes(receivedKey)) {
        //value should be a number or null
        if (isNaN(req.body[receivedKey]) || req.body[receivedKey] !== null) {
          let err = new Error(`${receivedKey} must be a number or null`);
          err.status = 400;
          console.log("5");
          return next(err);
        }
      }
      console.log("6");
      //next();
    });
    next();
  }
}

// function userExists(req,res,next){
//   authService.getUserWithUserName(req.body.user_name).then(res=>{
//     if(!res.length){
//       let err = new Error(``)
//     }
//   })
// }

function catchError(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Unknown server error";
  return res.status(status).json({
    error: message
  });
}

function userExists(req, res, next) {
  //!!!!!! sets user property to req
  console.log(req.body, "req.body in userExists");
  console.log(req.body.user_name, "req.body.username");
  authService
    .getUserWithUserName(req.app.get("db"), req.body.user_name)
    .then(user => {
      console.log(user, "user after getuser");
      if (!user.length) {
        let err = new Error("Incorrect username or password");
        err.status = 400;
        return next(err);
      }
      req.user = user[0];
      next();
    });
}

function checkPasswords(req, res, next) {
  //!!!!!this must be called after userExists or req.user has been called

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

module.exports = {
  validateRequiredKeys,
  validateValueTypes,
  catchError,
  userExists,
  checkPasswords
};