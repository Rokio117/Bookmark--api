BEGIN;

TRUNCATE 

bookmark_users,
bookmark_books,
bookmark_user_book_info,
bookmark_authors,
bookmark_notes
RESTART IDENTITY CASCADE;

COMMIT;