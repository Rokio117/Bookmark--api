

CREATE TABLE IF NOT EXISTS bookmark_user_book_info (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  ontab TEXT NOT NULL,
  currentpage INTEGER,
  startedon TEXT,
  finishedon TEXT,
  userid INTEGER REFERENCES bookmark_users(id) NOT NULL,
  bookid INTEGER REFERENCES bookmark_books(id) NOT NULL
)