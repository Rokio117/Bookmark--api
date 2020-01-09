const express = require("express");
const jsonBodyParser = express.json();
const authRouter = express.Router();
const authService = require("./auth-service");
const { validateRequiredKeys } = require("./middleware");
const { validateValueTypes } = require("./middleware");
const { catchError } = require("./middleware");
const { checkPasswords } = require("./middleware");
const { userExists } = require("./middleware");
const helpers = require("./bookmark-service");

authRouter.post(
  "/login",
  jsonBodyParser,
  validateRequiredKeys(["user_name", "password"]),
  validateValueTypes,
  userExists,
  checkPasswords,
  (req, res, next) => {
    const response = {
      ...req.user,
      authToken: authService.createJwt(req.user.username, {
        user_id: req.user.id
      })
    };

    res.json(response);
  }
);

authRouter.post(
  "/register",
  jsonBodyParser,
  validateRequiredKeys(["user_name", "password", "repeat_password"]),
  validateValueTypes,
  userExists,
  (req, res, next) => {
    const { password, repeat_password, user_name } = req.body;

    if (repeat_password !== password) {
      let err = new Error(`Passwords don't match`);
      err.status = 400;
      return next(err);
    }
    helpers.hashPassword(password).then(hashedPassword => {
      const userObject = { password: hashedPassword, username: user_name };
      helpers.registerUser(req.app.get("db"), userObject).then(user => {
        const newUser = user[0];
        const responseJwt = {
          username: newUser.username,
          id: newUser.id,
          authToken: authService.createJwt(newUser.username, {
            user_id: newUser.id
          })
        };
        res.json(responseJwt);
      });
    });
  }
);

authRouter.use(catchError);

module.exports = authRouter;
