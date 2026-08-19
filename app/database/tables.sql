DROP TABLE IF EXISTS owner CASCADE;
DROP TABLE IF EXISTS admin CASCADE;
DROP TABLE IF EXISTS language CASCADE;
DROP TABLE IF EXISTS repository CASCADE;

CREATE TABLE IF NOT EXISTS owner (
id TEXT PRIMARY KEY NOT NULL,
url TEXT NOT NULL UNIQUE,
login TEXT NOT NULL UNIQUE,
avatar_url TEXT NOT NULL UNIQUE);
/**
@table: user
@description: The repository owner
*/

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
website_url TEXT);
/**
@table: admin
@description: User admin owner of stargazers ... 
@columnsDescription:  id() bio(The user bio) avatar_url(Profile photo url) company() created_at(Date when user was created) email() location() login(Username used to "login" ) name(Name for public) url() website_url()
*/

CREATE TABLE IF NOT EXISTS language (
id TEXT PRIMARY KEY NOT NULL,
color TEXT NOT NULL,
name TEXT NOT NULL UNIQUE);
/**
@table: language
@description: Programming Language object
@columnsDescription:  id() color(Badge color) name()
*/

CREATE TABLE IF NOT EXISTS repository (
id TEXT PRIMARY KEY NOT NULL,
created_at TEXT NOT NULL,
description TEXT,
disk_usage INTEGER NOT NULL,
fork_count INTEGER NOT NULL,
homepage_url TEXT NOT NULL,
is_archived BOOLEAN NOT NULL,
name TEXT NOT NULL,
pushed_at TEXT,
ssh_url TEXT NOT NULL UNIQUE,
stargazer_count INTEGER NOT NULL,
url TEXT NOT NULL UNIQUE,
readme_url TEXT NOT NULL UNIQUE,
primary_language_id TEXT NOT NULL,
owner_id TEXT NOT NULL,
owner_starred_id TEXT NOT NULL);

-- ALTER TABLE repository ADD CONSTRAINT repository_primary_language_id_language_id FOREIGN KEY (primary_language_id) REFERENCES language(id) ON DELETE RESTRICT ON UPDATE CASCADE;
-- ALTER TABLE repository ADD CONSTRAINT repository_owner_id_user_id FOREIGN KEY (owner_id) REFERENCES owner(id) ON DELETE RESTRICT ON UPDATE CASCADE;
-- ALTER TABLE repository ADD CONSTRAINT repository_owner_starred_id_admin_id FOREIGN KEY (owner_starred_id) REFERENCES admin(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE repository ADD CONSTRAINT repository_primary_language_id_language_id FOREIGN KEY (primary_language_id) REFERENCES language(id) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE repository ADD CONSTRAINT repository_owner_id_user_id FOREIGN KEY (owner_id) REFERENCES owner(id) ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE repository ADD CONSTRAINT repository_owner_starred_id_admin_id FOREIGN KEY (owner_starred_id) REFERENCES admin(id) ON DELETE NO ACTION ON UPDATE CASCADE;
