const express = require("express");
const bookmarkRouter = express();
const jsonBodyParser = express.json();
const PORT = process.env.PORT || 3000;
const { validateRequiredKeys } = require("./middleware");
const { validateValueTypes } = require("./middleware");
const { catchError } = require("./middleware");
const { checkPasswords } = require("./middleware");
const { userExists } = require("./middleware");
const { verifyJwt } = require("./middleware");
const helpers = require("./bookmark-service");

bookmarkRouter.get("/testJwt", jsonBodyParser, verifyJwt, (req, res) => {
  res.json({ ok: true });
});

bookmarkRouter.get(
  "/userInfo/:username",
  jsonBodyParser,
  verifyJwt,
  (req, res) => {
    //1.get userid
    //2.get userbookinfo
    //3.get book info
    //4.get author info
    //5.get notes
    //6.format how client is expecting
    //7 send

    helpers.getNotes(req.app.get("db"), req.body.bookinfoid).then(book => {
      res.json(book);
    });
    //res.json({ ok: true });
  }
);

bookmarkRouter.use(catchError);

//make sure when register you bcrypt the password before storing

module.exports = bookmarkRouter;
