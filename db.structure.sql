--
-- File generated with SQLiteStudio v3.1.1 on Sun Oct 21 16:24:58 2018
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: t_metadata
CREATE TABLE t_metadata ("key" VARCHAR PRIMARY KEY, value VARCHAR);

-- Table: t_post
CREATE TABLE t_post (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT UNIQUE, permalink TEXT UNIQUE, post_date DATETIME DEFAULT (CURRENT_TIMESTAMP), entry TEXT, author INTEGER REFERENCES t_user (id));

-- Table: t_sessions
CREATE TABLE t_sessions (sid PRIMARY KEY, expired, sess);

-- Table: t_user
CREATE TABLE t_user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, email TEXT UNIQUE, password TEXT UNIQUE);

-- Trigger: decrease_t_post_count
CREATE TRIGGER decrease_t_post_count AFTER DELETE ON t_post
BEGIN
    UPDATE t_metadata SET value = value - 1 WHERE key = 't_post_count';  
END;

-- Trigger: increase_t_post_count
CREATE TRIGGER increase_t_post_count AFTER INSERT ON t_post
BEGIN
    INSERT INTO t_metadata (key, value)
    SELECT 't_post_count', '0'
    WHERE NOT EXISTS (SELECT 1 FROM t_metadata WHERE key = 't_post_count');  
    UPDATE t_metadata SET value = value + 1 WHERE key = 't_post_count';  
END;

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
