const bcrypt = require("bcryptjs");

const helpers = {
  registerUser(knex, userObject) {
    return knex
      .insert(userObject)
      .into("bookmark_users")
      .returning("*");
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  patchUserBookInfoCurrentPage(knex, userid, bookid, currentpage) {
    return knex("bookmark_user_book_info")
      .where({ userid, bookid })
      .update({ currentpage });
  },
  patchUserBookInfoStartedOn(knex, userid, bookid, startedon) {
    return knex("bookmark_user_book_info")
      .where({ userid, bookid })
      .update({ startedon });
  },
  patchUserBookInfoFinishedOn(knex, userid, bookid, finishedon) {
    return knex("bookmark_user_book_info")
      .where({ userid, bookid })
      .update({ finishedon });
  },
  patchUserBookInfoOnTab(knex, bookInfoid, ontab) {
    return knex("bookmark_user_book_info")
      .where({ id: bookInfoid })
      .update({ ontab })
      .returning("*");
  },
  findBook(knex, id) {
    return knex("bookmark_books")
      .select("id")
      .where({ id });
  },
  findOrPostBook(knex, googleid, bookObject) {
    //returns id as number
    return knex
      .select("id")
      .from("bookmark_books")
      .where({ googleid })
      .then(foundId => {
        if (!foundId[0]) {
          return knex("bookmark_books")
            .insert(bookObject)
            .returning("id")
            .then(result => {
              //sends an array with one number in it

              return result[0];
            });
        } else {
          //sends an array with an object with key id in it

          return foundId[0].id;
        }
      });
  },
  findAuthor(knex, name, bookid) {
    //returns array of found author including
    return knex
      .select("*")
      .from("bookmark_authors")
      .where({ author: name, bookid });
  },
  findOrPostAuthor(knex, author, bookid) {
    return knex
      .select("id")
      .from("bookmark_authors")
      .where({ author, bookid })
      .then(foundId => {
        if (!foundId.length) {
          const newAuthor = { author, bookid };
          return knex.insert(newAuthor).returning("id");
        } else return foundId[0];
      });
  },
  postUserBookInfo(knex, bookinfo) {
    //bookinfo contains ontab,currentpage,startedon,finishedon,userid,bookid
    return knex
      .insert(bookinfo)
      .into("bookmark_user_book_info")
      .returning("*");
  },
  postNote(knex, noteObject) {
    //noteObject contains notetitle,notedate,notecontent,bookinfoid
    return knex
      .insert(noteObject)
      .into("bookmark_notes")
      .returning("*");
  },
  deleteUserBookInfo(knex, bookinfoid) {
    //will also delete notes due to cascade
    return knex("bookmark_user_book_info")
      .where({ id: bookinfoid })
      .del();
  },
  deleteNote(knex, noteid) {
    return knex("bookmark_notes")
      .where({ id: noteid })
      .del();
  },
  getBook(knex, bookid) {
    //returns book object
    //works!
    return knex
      .select("*")
      .from("bookmark_books")
      .where({ id: bookid })
      .then(response => {
        return response[0];
      });
  },
  getAuthor(knex, bookid) {
    //sends back list since more than one auther may be possible
    //works!
    return knex
      .select("*")
      .from("bookmark_authors")
      .where({ bookid });

    //may need to be whereIn
  },
  getNotes(knex, bookinfoid) {
    //sucessfully gets all notes for a book!!!!!
    return knex
      .select("*")
      .from("bookmark_notes")
      .where({ bookinfoid });
    //may need to be whereIn
  },
  getNote(knex, noteId) {
    return knex
      .select("*")
      .from("bookmark_notes")
      .where({ id: noteId });
  },
  getUserBookInfo(knex, userid) {
    return knex
      .select("*")
      .from("bookmark_user_book_info")
      .where({ userid });
  },
  findBookInfoById(knex, bookinfoid) {
    return knex
      .select("id")
      .from("bookmark_user_book_info")
      .where({ id: bookinfoid });
  },
  updateUserBook(knex, newBookInfo, bookinfoid) {
    return knex("bookmark_user_book_info")
      .update(newBookInfo)
      .where({ id: bookinfoid })
      .returning("*");
  }
};

module.exports = helpers;
