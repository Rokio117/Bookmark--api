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
  patchUserBookInfoOnTab(knex, userid, bookid, ontab) {
    return knex("bookmark_user_book_info")
      .where({ userid, bookid })
      .update({ ontab });
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
        console.log(foundId[0], "foundin in find or post book");
        if (!foundId[0]) {
          console.log("went top path");
          return knex("bookmark_books")
            .insert(bookObject)
            .returning("id")
            .then(result => {
              //sends an array with one number in it
              console.log(result, "result after insert");
              return result[0];
            });
        } else {
          //sends an array with an object with key id in it
          console.log(foundId[0].id, "went bottom path");
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
    return knex.insert(noteObject).into("bookmark_notes");
  },
  deleteUserBookInfo(knex, bookinfoid) {
    //will also delete notes due to cascade
    return knex
      .select("bookmark_user_book_info")
      .where({ id: bookinfoid })
      .del();
  },
  deleteNote(knex, noteid) {
    return knex
      .select("bookmark_notes")
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
  getUserBookInfo(knex, userid) {
    return knex
      .select("*")
      .from("bookmark_user_book_info")
      .where({ userid });
  }
};

module.exports = helpers;
