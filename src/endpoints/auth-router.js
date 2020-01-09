const express = require("express");
const jsonBodyParser = express.json();
const authRouter = express.Router();
const authService = require("./auth-service");
const { validateRequiredKeys } = require("./middleware");
const { validateValueTypes } = require("./middleware");
const { catchError } = require("./middleware");
const { checkPasswords } = require("./middleware");
const { userExists } = require("./middleware");

authRouter.post(
  "/login",
  jsonBodyParser,
  validateRequiredKeys(["user_name", "password"]),
  validateValueTypes,
  userExists,
  checkPasswords,
  (req, res, next) => {
    const { user_name, password } = req.body;
    const loginUser = { user_name, password };

    const response = {
      ...req.user,
      authToken: authService.createJwt(req.user.username, {
        user_id: req.user.id
      })
    };

    res.json(response);
  }
);

authRouter.use(catchError);

module.exports = authRouter;
