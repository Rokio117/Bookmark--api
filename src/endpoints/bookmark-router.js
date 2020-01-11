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
const authService = require("./auth-service");

bookmarkRouter.get("/testJwt", jsonBodyParser, verifyJwt, (req, res) => {
  res.json({ ok: true });
});

bookmarkRouter.get(
  "/userInfo/:username",
  jsonBodyParser,
  verifyJwt,
  (req, res) => {
    //1. Get user info(including id)
    //2. Get all userBookInfos
    //3. For each user book info, retrieve all information for it
    //4.combine into into array
    //5. send array

    const knex = req.app.get("db");
    authService.getUserWithUserName(knex, req.params.username).then(user => {
      const userid = user[0].id;
      helpers.getUserBookInfo(knex, userid).then(userbookinfos => {
        if (userbookinfos.length === 0) {
          fullUserBooks = [];
        } else {
          const allBookInfos = userbookinfos.map(userbookinfo => {
            return helpers.getBook(knex, userbookinfo.bookid).then(bookinfo => {
              return helpers.getNotes(knex, userbookinfo.id).then(booknotes => {
                //userBookinfo is an object
                //bookinfo is an object
                //booknotes is an array

                return { ...userbookinfo, ...bookinfo, notes: booknotes };
              });
            });
          });

          Promise.all(allBookInfos).then(allBookInfos => {
            const fullUserProfile = {
              id: user[0].id,
              username: user[0].username,

              books: [...allBookInfos]
            };
            res.json(fullUserProfile);
          });
        }
      });
    });
  }
);

bookmarkRouter.use(catchError);

module.exports = bookmarkRouter;
