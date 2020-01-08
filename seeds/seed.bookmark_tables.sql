BEGIN;

TRUNCATE 

bookmark_users,
bookmark_books,
bookmark_user_book_info,
bookmark_authors,
bookmark_notes
RESTART IDENTITY CASCADE;

INSERT INTO bookmark_users (username,password)
VALUES
('Demo','$2a$12$XFXXLoeBCpkD6nkZtdoSEeI.6BEpEk4cC/djrnYB/Da8HjkC/tmzi');

INSERT INTO bookmark_books (title,coverart,description,googleid)
VALUES 
('The Name of the Wind','http://books.google.com/books/content?id=c-qcoAEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api','I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep. My name is Kvothe. You may have heard of me So begins the tale of Kvothe - currently known as Kote, the unassuming innkeepter - from his childhood in a troupe of traveling players, through his years spent as a near-feral orphan in a crime-riddled city, to his daringly brazen yet successful bid to enter a difficult and dangerous school of magic. In these pages you will come to know Kvothe the notorious magician, the accomplished thief, the masterful musician, the dragon-slayer, the legend-hunter, the lover, the thief and the infamous assassin. The Name of the Wind is fantasy at its very best, and an astounding must-read title.','c-qcoAEACAAJ'),
('The Lorax',
'http://books.google.com/books/content?id=cJnXmrk7BxAC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
'Description: The Once-ler describes the results of the local pollution problem.',
'cJnXmrk7BxAC'),
('Murder, She Wrote: Manuscript for Murder',
'http://books.google.com/books/content?id=Vn9LDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
'Jessica Fletcher investigates a mysterious manuscript with deadly consequences in the latest entry in this USA Today bestselling series... Jessica Fletcher has had plenty to worry about over her storied career, both as a bestselling novelist and amateur sleuth. But she never had any reason to worry about her longtime publisher, Lane Barfield, who also happens to be a trusted friend. When mounting evidence of financial malfeasance leads to an FBI investigation of Lane, Jessica cant believe what shes reading. So when Barfield turns up dead, Jessica takes on the task of proving Barfields innocence--she cant fathom someone shes known and trusted for so long cheating her. Sure enough, Jessicas lone wolf investigation turns up several oddities and inconsistencies in Barfields murder. Jessica knows something is being covered up, but what exactly? The trail she takes to answer that question reveals something far more nefarious afoot, involving shadowy characters from the heights of power in Washington. At the heart of Jessicas investigation lies a manuscript Barfield had intended to bring out after all other publishers had turned it down. The problem is that manuscript has disappeared, all traces of its submission and very existence having been wiped off the books. With her own life now in jeopardy, Jessica refuses to back off and sets her sights on learning the contents of that manuscript and what about it may have led to several murders. Every step she takes brings her closer to the truth of what lies in the pages, as well as the person who penned them.',
'Vn9LDwAAQBAJ'),
('Holes',
'http://books.google.com/books/content?id=U_zINMa9cAAC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
'Winner of the Newbery Medal and the National Book Award! This #1 New York Times bestselling, modern classic in which boys are forced to dig holes day in and day out is now available with a splashy new look. Stanley Yelnats is under a curse. A curse that began with his no-good-dirty-rotten-pig-stealing-great-great-grandfather and has since followed generations of Yelnatses. Now Stanley has been unjustly sent to a boys’ detention center, Camp Green Lake, where the boys build character by spending all day, every day digging holes exactly five feet wide and five feet deep. There is no lake at Camp Green Lake. But there are an awful lot of holes. It doesn’t take long for Stanley to realize there’s more than character improvement going on at Camp Green Lake. The boys are digging holes because the warden is looking for something. But what could be buried under a dried-up lake? Stanley tries to dig up the truth in this inventive and darkly humorous tale of crime and punishment—and redemption. Includes a double bonus: an excerpt from Small Steps, the follow-up to Holes, as well as an excerpt from Louis Sachar’s new middle-grade novel, Fuzzy Mud. A smart jigsaw puzzle of a novel. --The New York Times WINNER OF THE BOSTON GLOBE-HORN BOOK AWARD A NEW YORK TIMES BOOK REVIEW NOTABLE CHILDRENS BOOK SELECTED FOR NUMEROUS BEST BOOK OF THE YEAR AND ALA HONORS',
'U_zINMa9cAAC');

INSERT INTO bookmark_authors (author,bookid)
VALUES
('Patrick Rothfuss',1),
('Dr. Seuss',2),
('Jon Land',3),
('Jessica Fletcher',3),
('Louis Sachar',4);

INSERT INTO bookmark_user_book_info (ontab,currentpage,startedon,finishedon,userid,bookid)
VALUES
('finished',171,'2018-10-11','2018-10-11',1,1),
('finished',null,null,null,1,2),
('current',1,'2020-01-01',null,1,3),
('upcoming',null,null,null,1,4);

INSERT INTO bookmark_notes (notetitle,notedate,notecontent,bookinfoid)
VALUES 
('Amazing','2018-10-11','A truly amazing fantasy novel. I cant wait to read the next one!',1),
('Unless',null,'Unless someone like you cares a whole awful lot, Nothing is going to get better. Its not.',2),
('My Fav',null,'This is my favorite Dr. Seuss book',2),
('Multiple Authors','2020-01-02','This book has multiple authors. Cool!!',3);

COMMIT;

