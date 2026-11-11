CREATE TABLE IF NOT EXISTS ht (
    id INTEGER PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS db_version (
    id INTEGER PRIMARY KEY,
    version TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS owner (
    id TEXT PRIMARY KEY NOT NULL,
    url TEXT NOT NULL UNIQUE,
    login TEXT NOT NULL UNIQUE,
    avatar_url TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS admin (
    id TEXT PRIMARY KEY NOT NULL,
    bio TEXT,
    avatar_url TEXT UNIQUE,
    company TEXT,
    created_at TEXT NOT NULL,
    email TEXT UNIQUE,
    location TEXT,
    login TEXT NOT NULL UNIQUE,
    name TEXT,
    url TEXT NOT NULL UNIQUE,
    website_url TEXT,
    stargazercount INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS language (
id TEXT PRIMARY KEY NOT NULL,
color TEXT DEFAULT '#FFD1AA00',
name TEXT NOT NULL UNIQUE);
/**
@table: language
@description: Programming Language object
@columnsDescription:  id() color(Badge color) name()
*/

CREATE TABLE IF NOT EXISTS topic (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE,
    stargazer_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS license (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS repository (
    id TEXT PRIMARY KEY NOT NULL,
    created_at TEXT,
    description TEXT,
    disk_usage INTEGER NOT NULL DEFAULT 0,
    fork_count INTEGER NOT NULL DEFAULT 0,
    homepage_url TEXT,
    is_archived BOOLEAN NOT NULL,
    name TEXT NOT NULL,
    pushed_at TEXT,
    ssh_url TEXT NOT NULL UNIQUE,
    stargazer_count INTEGER NOT NULL,
    url TEXT NOT NULL UNIQUE,
    license_id TEXT REFERENCES license(id) ON DELETE SET NULL ON UPDATE CASCADE,
    readme_url TEXT UNIQUE,
    primary_language_id TEXT REFERENCES language(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    owner_id TEXT NOT NULL REFERENCES owner(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    owner_starred_id TEXT NOT NULL REFERENCES admin(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS topicxrepository (
    idrepo TEXT NOT NULL REFERENCES repository(id) ON DELETE CASCADE ON UPDATE CASCADE,
    idtopic TEXT NOT NULL REFERENCES topic(id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE language ALTER COLUMN color DROP NOT NULL;

TRUNCATE TABLE
    ht,
    db_version,
    topicxrepository,
    repository,
    topic,
    license,
    language,
    owner,
    admin
RESTART IDENTITY CASCADE;

ALTER TABLE db_version ALTER COLUMN version SET NOT NULL;
