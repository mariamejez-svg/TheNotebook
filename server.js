const express = require("express");
const cors = require("cors");

const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());


// HOME
app.get("/", (req, res) => {
    res.send("TheNotebook backend is running.");
});


// GET ALL BLOGS
app.get("/api/blogs", (req, res) => {

    const blogs = db.prepare(`
        SELECT *
        FROM blogs
        ORDER BY created_at DESC
    `).all();

    res.json(blogs);
});


// GET ONE BLOG
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


// CREATE BLOG
app.post("/api/blogs", (req, res) => {

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


// UPDATE BLOG
app.put("/api/blogs/:id", (req, res) => {

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


// DELETE BLOG
app.delete("/api/blogs/:id", (req, res) => {

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

// GET REVIEWS FOR A BLOG
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
// SERVER
app.listen(5000, () => {

    console.log(
        "TheNotebook server running on http://localhost:5000"
    );

});