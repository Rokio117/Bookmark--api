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
const { validateBookExists } = require("./middleware");
const { verifyTab } = require("./middleware");

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
          const newUserData = {
            id: userid,
            username: user[0].username,
            books: []
          };
          res.json(newUserData);
        } else {
          const allBookInfos = userbookinfos.map(userbookinfo => {
            return helpers.getBook(knex, userbookinfo.bookid).then(bookinfo => {
              return helpers.getNotes(knex, userbookinfo.id).then(booknotes => {
                return helpers
                  .getAuthor(req.app.get("db"), userbookinfo.id)
                  .then(foundAuthors => {
                    //userBookinfo is an object
                    //bookinfo is an object
                    //booknotes is an array

                    let authors = [];
                    foundAuthors.forEach(foundAuthor =>
                      authors.push(foundAuthor.author)
                    );
                    return {
                      ...userbookinfo,
                      ...bookinfo,
                      notes: booknotes,
                      authors: authors
                    };
                  });
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

bookmarkRouter.post(
  "/userinfo/:username/books/add",
  jsonBodyParser,
  verifyJwt,

  validateRequiredKeys([
    "ontab",
    "currentpage",
    "startedon",
    "finishedon",
    "userid",
    "title",
    "coverart",
    "description",
    "googleid"
  ]),
  verifyTab,
  (req, res, next) => {
    const {
      ontab,
      currentpage,
      startedon,
      finishedon,
      userid,
      title,
      coverart,
      description,
      googleid
    } = req.body;
    const bookObject = {
      title,
      coverart,
      description,
      googleid
    };
    const userBookInfoObject = {
      ontab,
      currentpage,
      startedon,
      finishedon,
      userid
    };
    helpers
      .findOrPostBook(req.app.get("db"), googleid, bookObject)
      .then(bookid => {
        const fullUserBook = { ...userBookInfoObject, bookid: bookid };

        helpers
          .postUserBookInfo(req.app.get("db"), fullUserBook)
          .then(response => {
            res.json(response);
          });
      });
  }
);

bookmarkRouter.delete(
  "/:username/book/delete",
  jsonBodyParser,
  verifyJwt,
  validateRequiredKeys(["bookInfoId"]),
  validateBookExists,
  (req, res, next) => {
    helpers
      .deleteUserBookInfo(req.app.get("db"), req.body.bookInfoId)
      .then(response => {
        res.status(204).json();
      });
  }
);

bookmarkRouter
  .route("/:username/notes")
  .delete(
    jsonBodyParser,
    verifyJwt,
    validateRequiredKeys(["noteId"]),
    (req, res, next) => {
      helpers.getNote(req.app.get("db"), req.body.noteId).then(noteId => {
        if (!noteId.length) {
          let err = new Error("Note not found");
          err.status = 404;
          return next(err);
        } else
          helpers
            .deleteNote(req.app.get("db"), req.body.noteId)
            .then(response => {
              res.status(204).send();
            });
      });
      //2. if it does delete it
    }
  )
  .post(
    jsonBodyParser,
    verifyJwt,
    validateRequiredKeys([
      "notetitle",
      "notedate",
      "notecontent",
      "bookInfoId"
    ]),
    (req, res, next) => {
      const { notetitle, notedate, notecontent, bookInfoId } = req.body;
      const newNoteObject = {
        notetitle,
        notedate,
        notecontent,
        bookinfoid: bookInfoId
      };

      helpers.findBookInfoById(req.app.get("db"), bookInfoId).then(foundId => {
        if (!foundId.length) {
          let err = new Error("Book for note found");
          err.status = 404;
          return next(err);
        } else {
          helpers.postNote(req.app.get("db"), newNoteObject).then(response => {
            res.json(response);
          });
        }
      });
    }
  );

bookmarkRouter
  .route("/:username/book/update")
  .patch(
    jsonBodyParser,
    verifyJwt,
    validateRequiredKeys([
      "currentpage",
      "startedon",
      "finishedon",
      "bookInfoId"
    ]),
    (req, res, next) => {
      const { currentpage, startedon, finishedon, bookInfoId } = req.body;
      const newBookInfo = { currentpage, startedon, finishedon };

      helpers.findBookInfoById(req.app.get("db"), bookInfoId).then(foundId => {
        if (!foundId.length) {
          //traced to here
          let err = new Error("Book not found");
          err.status = 404;
          return next(err);
        } else {
          helpers
            .updateUserBook(req.app.get("db"), newBookInfo, bookInfoId)
            .then(response => {
              res.json(response);
            });
        }
      });
    }
  );

bookmarkRouter
  .route("/book/changeTab")
  .patch(
    jsonBodyParser,
    verifyJwt,
    validateRequiredKeys(["bookInfoId", "ontab"]),
    verifyTab,
    (req, res, next) => {
      const { bookInfoId, ontab } = req.body;

      helpers
        .findBookInfoById(req.app.get("db"), bookInfoId)
        .then(foundBookInfoId => {
          if (!foundBookInfoId.length) {
            let err = new Error("Book not found");
            err.status = 404;
            return next(err);
          } else {
            helpers
              .patchUserBookInfoOnTab(req.app.get("db"), bookInfoId, ontab)
              .then(response => {
                res.json(response);
              });
          }
        });
    }
  );

bookmarkRouter.use(catchError);

module.exports = bookmarkRouter;
