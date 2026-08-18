const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!JWT_SECRET || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.warn("WARNING: Admin environment variables are not configured.");
}


// =========================
// HOME
// =========================

app.get("/", (req, res) => {
    res.send("TheNotebook backend is running.");
});


// =========================
// ADMIN LOGIN
// =========================

app.post("/api/admin/login", (req, res) => {

    const { username, password } = req.body;

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
            username,
            role: "admin"
        },
        JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    res.json({
        message: "Login successful.",
        token
    });
});


// =========================
// AUTH MIDDLEWARE
// =========================

function requireAdmin(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Admin authentication required."
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        if (decoded.role !== "admin") {
            return res.status(403).json({
                error: "Admin access required."
            });
        }

        req.admin = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            error: "Invalid or expired admin session."
        });

    }
}


// =========================
// GET ALL BLOGS
// PUBLIC
// =========================

app.get("/api/blogs", (req, res) => {

    const blogs = db.prepare(`
        SELECT *
        FROM blogs
        ORDER BY created_at DESC
    `).all();

    res.json(blogs);
});


// =========================
// GET ONE BLOG
// PUBLIC
// =========================

app.get("/api/blogs/:id", (req, res) => {

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

    res.json(blog);
});


// =========================
// CREATE BLOG
// ADMIN ONLY
// =========================

app.post("/api/blogs", requireAdmin, (req, res) => {

    const {
        title,
        content,
        category,
        image
    } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            error: "Title and content are required."
        });
    }

    const result = db.prepare(`
        INSERT INTO blogs
        (title, content, category, image)
        VALUES (?, ?, ?, ?)
    `).run(
        title,
        content,
        category || "Journal",
        image || null
    );

    res.json({
        message: "Blog published successfully.",
        id: result.lastInsertRowid
    });
});


// =========================
// UPDATE BLOG
// ADMIN ONLY
// =========================

app.put("/api/blogs/:id", requireAdmin, (req, res) => {

    const {
        title,
        content,
        category
    } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            error: "Title and content are required."
        });
    }

    const result = db.prepare(`
        UPDATE blogs
        SET title = ?,
            content = ?,
            category = ?
        WHERE id = ?
    `).run(
        title,
        content,
        category || "Journal",
        req.params.id
    );

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Blog not found."
        });
    }

    res.json({
        message: "Blog updated successfully."
    });
});


// =========================
// DELETE BLOG
// ADMIN ONLY
// =========================

app.delete("/api/blogs/:id", requireAdmin, (req, res) => {

    const result = db.prepare(`
        DELETE FROM blogs
        WHERE id = ?
    `).run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Blog not found."
        });
    }

    res.json({
        message: "Blog deleted successfully."
    });
});


// =========================
// REVIEWS / COMMENTS
// =========================

// GET REVIEWS
// PUBLIC

app.get("/api/blogs/:id/reviews", (req, res) => {

    const reviews = db.prepare(`
        SELECT *
        FROM reviews
        WHERE blog_id = ?
        ORDER BY created_at DESC
    `).all(req.params.id);

    res.json(reviews);
});


// ADD REVIEW
// PUBLIC

app.post("/api/blogs/:id/reviews", (req, res) => {

    const {
        name,
        content
    } = req.body;

    if (!name || !content) {

        return res.status(400).json({
            error: "Name and review are required."
        });

    }

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
        INSERT INTO reviews
        (blog_id, name, content)
        VALUES (?, ?, ?)
    `).run(
        req.params.id,
        name.trim(),
        content.trim()
    );

    res.json({
        message: "Review posted successfully.",
        id: result.lastInsertRowid
    });

});


// =========================
// SERVER
// =========================

app.listen(5000, () => {

    console.log(
        "TheNotebook server running on http://localhost:5000"
    );

});
