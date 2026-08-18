const Database = require("better-sqlite3");

const db = new Database("thenotebook.db");


// =========================
// BLOGS TABLE
// =========================

db.prepare(`
    CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT DEFAULT 'Journal',
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();


// =========================
// REVIEWS / COMMENTS TABLE
// =========================

db.prepare(`
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blog_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (blog_id)
        REFERENCES blogs(id)
        ON DELETE CASCADE
    )
`).run();


console.log("TheNotebook database is ready.");


module.exports = db;