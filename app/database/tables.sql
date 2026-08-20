DROP TABLE IF EXISTS owner CASCADE;
DROP TABLE IF EXISTS admin CASCADE;
DROP TABLE IF EXISTS language CASCADE;
DROP TABLE IF EXISTS repository CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS topicXrepository CASCADE;
DROP TABLE IF EXISTS license CASCADE;


CREATE TABLE owner (
id TEXT PRIMARY KEY NOT NULL,
url TEXT NOT NULL UNIQUE,
login TEXT NOT NULL UNIQUE,
avatar_url TEXT UNIQUE);
/**
@table: owner
@description: The repository owner
*/

CREATE TABLE admin (
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
website_url TEXT);
/**
@table: admin
@description: User admin owner of stargazers ... 
@columnsDescription:  id() bio(The user bio) avatar_url(Profile photo url) company() created_at(Date when user was created) email() location() login(Username used to "login" ) name(Name for public) url() website_url()
*/

CREATE TABLE language (
id TEXT PRIMARY KEY NOT NULL,
color TEXT NOT NULL DEFAULT '#FFD1AA00',
name TEXT NOT NULL UNIQUE);
/**
@table: language
@description: Programming Language object
@columnsDescription:  id() color(Badge color) name()
*/

CREATE TABLE repository (
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
readme_url TEXT UNIQUE,
license_id TEXT,
primary_language_id TEXT,
owner_id TEXT NOT NULL,
owner_starred_id TEXT NOT NULL);

CREATE TABLE topics (
id TEXT PRIMARY KEY NOT NULL,
name TEXT NOT NULL UNIQUE,
stargazer_count INTEGER NOT NULL DEFAULT 0);
/**
@table: topics
@description: Repositories Tags
*/

CREATE TABLE topicXrepository (
idRepo TEXT NOT NULL,
idTopic TEXT NOT NULL);
/**
@table: topicXrepository
@description: Relation for Topics and Repositories (N:N)
*/

CREATE TABLE license (
id TEXT PRIMARY KEY NOT NULL,
name TEXT NOT NULL UNIQUE,
url INTEGER NOT NULL UNIQUE);
/**
@table: license
@columnsDescription:  id() name() url()
*/

ALTER TABLE repository ADD CONSTRAINT repository_license_id_license_id FOREIGN KEY (license_id) REFERENCES license(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE repository ADD CONSTRAINT repository_primary_language_id_language_id FOREIGN KEY (primary_language_id) REFERENCES language(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE repository ADD CONSTRAINT repository_owner_id_owner_id FOREIGN KEY (owner_id) REFERENCES owner(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE repository ADD CONSTRAINT repository_owner_starred_id_admin_id FOREIGN KEY (owner_starred_id) REFERENCES admin(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE topicXrepository ADD CONSTRAINT topicXrepository_idRepo_repository_id FOREIGN KEY (idRepo) REFERENCES repository(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE topicXrepository ADD CONSTRAINT topicXrepository_idTopic_topics_id FOREIGN KEY (idTopic) REFERENCES topics(id) ON DELETE SET NULL ON UPDATE CASCADE;