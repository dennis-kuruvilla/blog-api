create table author (author_id char(4) not null,  author_name varchar(25), 
author_email varchar(50) not null,primary key(author_id));

CREATE TABLE post (
    post_id char(4) NOT NULL,
    title varchar(25),
    description varchar(200),
    author char(4),
    PRIMARY KEY (post_id),
    FOREIGN KEY (author) REFERENCES author(author_id)
);
