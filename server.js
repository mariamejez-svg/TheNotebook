const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {

        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed."));
        }

    }
});

/* =========================
   ADMIN SETTINGS
========================= */

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
    res.send("TheNotebook backend is running.");
});


/* =========================
   ADMIN LOGIN
========================= */

app.post("/api/admin/login", (req, res) => {

    try {

        const {
            username,
            password
        } = req.body || {};

        if (!username || !password) {

            return res.status(400).json({
                error: "Username and password are required."
            });

        }

        if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {

            console.error(
                "Missing ADMIN_USERNAME, ADMIN_PASSWORD or JWT_SECRET."
            );

            return res.status(500).json({
                error: "Admin authentication is not configured."
            });

        }

        if (
            username !== ADMIN_USERNAME ||
            password !== ADMIN_PASSWORD
        ) {

            return res.status(401).json({
                error: "Invalid username or password."
            });

        }

        const token = jwt.sign(
            {
                username: username
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.json({
            message: "Login successful.",
            token: token
        });

    }

    catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        return res.status(500).json({
            error: "Unable to login."
        });

    }

});


/* =========================
   ADMIN AUTHENTICATION
========================= */

function requireAdmin(req, res, next) {

    const authorization =
        req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {

        return res.status(401).json({
            error: "Unauthorized."
        });

    }

    const token =
        authorization.substring(7).trim();

    if (!token || !JWT_SECRET) {

        return res.status(401).json({
            error: "Invalid or expired session."
        });

    }

    try {

        jwt.verify(
            token,
            JWT_SECRET
        );

        next();

    }

    catch (error) {

        console.error(
            "AUTH ERROR:",
            error.message
        );

        return res.status(401).json({
            error: "Invalid or expired session."
        });

    }

}


/* =========================
   GET ALL BLOGS
   PUBLIC
========================= */

app.get("/api/blogs", (req, res) => {

    try {

        const blogs = db.prepare(`
            SELECT *
            FROM blogs
            ORDER BY created_at DESC
        `).all();

        return res.json(blogs);

    }

    catch (error) {

        console.error(
            "GET BLOGS ERROR:",
            error
        );

        return res.status(500).json({
            error: "Unable to load blogs."
        });

    }

});


/* =========================
   GET ONE BLOG
   PUBLIC
========================= */

app.get("/api/blogs/:id", (req, res) => {

    try {

        const blog = db.prepare(`
            SELECT *
            FROM blogs
            WHERE id = ?
        `).get(req.params.id);

        if (!blog) {

            return res.status(404).json({
                error: "Blog not found."
            });

        }

        return res.json(blog);

    }

    catch (error) {

        console.error(
            "GET BLOG ERROR:",
            error
        );

        return res.status(500).json({
            error: "Unable to load blog."
        });

    }

});


/* =========================
   CREATE BLOG
   ADMIN ONLY
========================= */

app.post(
    "/api/blogs",
    requireAdmin,
    (req, res) => {

        try {

            const {
                title,
                content,
                category,
                image
            } = req.body || {};

            if (
                !title ||
                !title.trim() ||
                !content ||
                !content.trim()
            ) {

                return res.status(400).json({
                    error:
                        "Title and content are required."
                });

            }

            const result = db.prepare(`
                INSERT INTO blogs
                (title, content, category, image)
                VALUES (?, ?, ?, ?)
            `).run(

                title.trim(),

                content.trim(),

                category && category.trim()
                    ? category.trim()
                    : "Journal",

                image || null

            );

            return res.status(201).json({

                message:
                    "Blog published successfully.",

                id:
                    result.lastInsertRowid

            });

        }

        catch (error) {

            console.error(
                "CREATE BLOG ERROR:",
                error
            );

            return res.status(500).json({
                error:
                    "Unable to publish blog."
            });

        }

    }
);


/* =========================
   UPDATE BLOG
   ADMIN ONLY
========================= */

app.put(
    "/api/blogs/:id",
    requireAdmin,
    (req, res) => {

        try {

            const {
                title,
                content,
                category
            } = req.body || {};

            if (
                !title ||
                !title.trim() ||
                !content ||
                !content.trim()
            ) {

                return res.status(400).json({
                    error:
                        "Title and content are required."
                });

            }

            const result = db.prepare(`
                UPDATE blogs
                SET
                    title = ?,
                    content = ?,
                    category = ?
                WHERE id = ?
            `).run(

                title.trim(),

                content.trim(),

                category && category.trim()
                    ? category.trim()
                    : "Journal",

                req.params.id

            );

            if (result.changes === 0) {

                return res.status(404).json({
                    error: "Blog not found."
                });

            }

            return res.json({

                message:
                    "Blog updated successfully."

            });

        }

        catch (error) {

            console.error(
                "UPDATE BLOG ERROR:",
                error
            );

            return res.status(500).json({
                error:
                    "Unable to update blog."
            });

        }

    }
);


/* =========================
   DELETE BLOG
   ADMIN ONLY
========================= */

app.delete(
    "/api/blogs/:id",
    requireAdmin,
    (req, res) => {

        try {

            const result = db.prepare(`
                DELETE FROM blogs
                WHERE id = ?
            `).run(req.params.id);

            if (result.changes === 0) {

                return res.status(404).json({
                    error: "Blog not found."
                });

            }

            return res.json({

                message:
                    "Blog deleted successfully."

            });

        }

        catch (error) {

            console.error(
                "DELETE BLOG ERROR:",
                error
            );

            return res.status(500).json({
                error:
                    "Unable to delete blog."
            });

        }

    }
);


/* =========================
   GET REVIEWS
   PUBLIC
========================= */

app.get(
    "/api/blogs/:id/reviews",
    (req, res) => {

        try {

            const reviews = db.prepare(`
                SELECT *
                FROM reviews
                WHERE blog_id = ?
                ORDER BY created_at DESC
            `).all(req.params.id);

            return res.json(reviews);

        }

        catch (error) {

            console.error(
                "GET REVIEWS ERROR:",
                error
            );

            return res.status(500).json({
                error:
                    "Unable to load reviews."
            });

        }

    }
);


/* =========================
   ADD REVIEW
   PUBLIC
========================= */

app.post(
    "/api/blogs/:id/reviews",
    (req, res) => {

        try {

            const {
                name,
                content
            } = req.body || {};

            if (
                !name ||
                !name.trim() ||
                !content ||
                !content.trim()
            ) {

                return res.status(400).json({
                    error:
                        "Name and review are required."
                });

            }

            const blog = db.prepare(`
                SELECT id
                FROM blogs
                WHERE id = ?
            `).get(req.params.id);

            if (!blog) {

                return res.status(404).json({
                    error:
                        "Blog not found."
                });

            }

            const result = db.prepare(`
                INSERT INTO reviews
                (blog_id, name, content)
                VALUES (?, ?, ?)
            `).run(

                req.params.id,

                name.trim(),

                content.trim()

            );

            return res.status(201).json({

                message:
                    "Review posted successfully.",

                id:
                    result.lastInsertRowid

            });

        }

        catch (error) {

            console.error(
                "ADD REVIEW ERROR:",
                error
            );

            return res.status(500).json({
                error:
                    "Unable to post review."
            });

        }

    }
);


/* =========================
   LIKES TABLE
========================= */

db.prepare(`
    CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blog_id INTEGER NOT NULL,
        visitor_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        UNIQUE(blog_id, visitor_id),

        FOREIGN KEY (blog_id)
        REFERENCES blogs(id)
        ON DELETE CASCADE
    )
`).run();


/* =========================
   GET LIKES
   PUBLIC
========================= */

app.get(
    "/api/blogs/:id/likes",
    (req, res) => {

        try {

            const blog = db.prepare(`
                SELECT id
                FROM blogs
                WHERE id = ?
            `).get(req.params.id);

            if (!blog) {

                return res.status(404).json({
                    error: "Blog not found."
                });

            }

            const result = db.prepare(`
                SELECT COUNT(*) AS count
                FROM likes
                WHERE blog_id = ?
            `).get(req.params.id);

            const visitorId =
                String(
                    req.query.visitor_id || ""
                ).trim();

            let liked = false;

            if (visitorId) {

                const existing =
                    db.prepare(`
                        SELECT id
                        FROM likes
                        WHERE blog_id = ?
                        AND visitor_id = ?
                    `).get(
                        req.params.id,
                        visitorId
                    );

                liked = !!existing;

            }

            return res.json({

                count:
                    Number(result.count || 0),

                liked:
                    liked

            });

        }

        catch (error) {

            console.error(
                "GET LIKES ERROR:",
                error
            );

            return res.status(500).json({
                error:
                    "Unable to load likes."
            });

        }

    }
);


/* =========================
   ADD LIKE
   PUBLIC
========================= */

app.post(
    "/api/blogs/:id/likes",
    (req, res) => {

        try {

            const visitorId =
                String(
                    req.body?.visitor_id || ""
                ).trim();

            if (!visitorId) {

                return res.status(400).json({
                    error:
                        "Visitor ID is required."
                });

            }

            const blog = db.prepare(`
                SELECT id
                FROM blogs
                WHERE id = ?
            `).get(req.params.id);

            if (!blog) {

                return res.status(404).json({
                    error:
                        "Blog not found."
                });

            }

            db.prepare(`
                INSERT OR IGNORE INTO likes
                (blog_id, visitor_id)
                VALUES (?, ?)
            `).run(
                req.params.id,
                visitorId
            );

            const result = db.prepare(`
                SELECT COUNT(*) AS count
                FROM likes
                WHERE blog_id = ?
            `).get(req.params.id);

            return res.status(201).json({

                count:
                    Number(result.count || 0),

                liked:
                    true

            });

        }

        catch (error) {

            console.error(
                "ADD LIKE ERROR:",
                error
            );

            return res.status(500).json({
                error:
                    "Unable to add like."
            });

        }

    }
);


/* =========================
   REMOVE LIKE
   PUBLIC
========================= */

app.delete(
    "/api/blogs/:id/likes",
    (req, res) => {

        try {

            const visitorId =
                String(
                    req.body?.visitor_id ||
                    req.query?.visitor_id ||
                    ""
                ).trim();

            if (!visitorId) {

                return res.status(400).json({
                    error:
                        "Visitor ID is required."
                });

            }

            const blog = db.prepare(`
                SELECT id
                FROM blogs
                WHERE id = ?
            `).get(req.params.id);

            if (!blog) {

                return res.status(404).json({
                    error:
                        "Blog not found."
                });

            }

            db.prepare(`
                DELETE FROM likes
                WHERE blog_id = ?
                AND visitor_id = ?
            `).run(
                req.params.id,
                visitorId
            );

            const result = db.prepare(`
                SELECT COUNT(*) AS count
                FROM likes
                WHERE blog_id = ?
            `).get(req.params.id);

            return res.json({

                count:
                    Number(result.count || 0),

                liked:
                    false

            });

        }

        catch (error) {

            console.error(
                "REMOVE LIKE ERROR:",
                error
            );

            return res.status(500).json({
                error:
                    "Unable to remove like."
            });

        }

    }
);


/* =========================
   SERVER
========================= */

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `TheNotebook server running on port ${PORT}`
        );

    }
);
