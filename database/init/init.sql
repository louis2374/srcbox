CREATE TABLE tbl_users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(32) NOT NULL UNIQUE,
    user_email VARCHAR(128) NOT NULL UNIQUE,
    user_password VARCHAR(96) NOT NULL,
    user_verified BOOLEAN NOT NULL,
    user_version INT NOT NULL DEFAULT 0
);

/* This makes it so when i search for a user by email/name, it is much faster */
CREATE INDEX index_user_name ON tbl_users(user_name);
CREATE INDEX index_user_email ON tbl_users(user_email);

CREATE TABLE tbl_posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    post_file_id VARCHAR(32) NULL,
    post_title VARCHAR(96) NOT NULL,
    post_description VARCHAR(256) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES tbl_users(user_id) ON DELETE CASCADE
);

CREATE TABLE tbl_comments (
    comment_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    comment_text VARCHAR(512) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES tbl_users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES tbl_posts(post_id) ON DELETE CASCADE
);

CREATE TABLE tbl_likes (
    user_id INT NOT NULL,
    post_id INT NOT NULL,

    PRIMARY KEY(user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES tbl_users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES tbl_posts(post_id) ON DELETE CASCADE
);

CREATE TABLE tbl_follows (
    user_id INT NOT NULL,
    user_id_followed INT NOT NULL,

    PRIMARY KEY(user_id, user_id_followed),
    FOREIGN KEY (user_id) REFERENCES tbl_users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_followed) REFERENCES tbl_users(user_id) ON DELETE CASCADE
);