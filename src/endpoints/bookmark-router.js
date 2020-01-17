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
        console.log(userbookinfos, "userbookinfos in get user profile");
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
            //console.log(userbookinfo, "userbookinfo in tier 1");
            return helpers.getBook(knex, userbookinfo.bookid).then(bookinfo => {
              //console.log(bookinfo, "bookinfo in tier 2");
              return helpers.getNotes(knex, userbookinfo.id).then(booknotes => {
                //console.log(booknotes, "booknotes in tier 3");
                return helpers
                  .getAuthor(req.app.get("db"), bookinfo.id)
                  .then(foundAuthors => {
                    //userBookinfo is an object
                    //bookinfo is an object
                    //booknotes is an array
                    //console.log(foundAuthors, "foundauthors in tier 4");
                    let authors = [];
                    foundAuthors.forEach(foundAuthor =>
                      authors.push(foundAuthor.author)
                    );
                    // const bookinfo = {
                    //   bookid: bookinfo.id,
                    //   title: bookinfo.title,
                    //   coverart: bookinfo.coverart,
                    //   description: bookinfo.description,
                    //   googleid: bookinfo.googleid
                    // };
                    //console.log(bookinfo, "formatted bookinfo after others");
                    return {
                      ...bookinfo,
                      ...userbookinfo,
                      //
                      notes: booknotes,
                      authors: authors
                    };
                  });
              });
            });
          });

          Promise.all(allBookInfos).then(allBookInfos => {
            console.log(allBookInfos, "allbookinfos in promise.all");
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
    "googleid",
    "authors"
  ]),
  verifyTab,
  (req, res, next) => {
    const {
      authors,
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
        const getAuthors = authors.map(author => {
          helpers
            .findOrPostAuthor(req.app.get("db"), author, bookid)
            .then(response => {
              console.log(response, "response of find or post author");
              return response;
            });
        });
        Promise.all(getAuthors).then(foundAuthors => {
          console.log(foundAuthors, "foundauthors after get or find authors");
          const fullUserBook = { ...userBookInfoObject, bookid: bookid };

          helpers
            .postUserBookInfo(req.app.get("db"), fullUserBook)
            .then(response => {
              console.log(response, "response of postUserbookInfo");
              res.json(response);
            });
        });
      });
  }
);

bookmarkRouter.delete(
  "/:username/book/delete",
  jsonBodyParser,
  verifyJwt,
  validateRequiredKeys(["bookInfoId"]),

  (req, res, next) => {
    helpers
      .deleteUserBookInfo(req.app.get("db"), req.body.bookInfoId)
      .then(response => {
        res.status(204).send();
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
              res.status(204).json("ok");
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
      console.log(bookInfoId, ontab, "bookinfoid and ontab in handler");
      helpers
        .findBookInfoById(req.app.get("db"), bookInfoId)
        //find user book info
        .then(foundBookInfoId => {
          if (!foundBookInfoId.length) {
            console.log("user book not found in patch book info");
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
