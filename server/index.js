import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "blog",
    password: "password",
    port: 5432,
});

db.connect();

let currentUser_id = null;
let currentName = null;

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/posts", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM blogs ORDER BY date_created DESC");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

app.get("/api/posts/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            "SELECT * FROM blogs WHERE blog_id = $1",
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Post not found." });

        const post = result.rows[0];

        res.json({
            blog_id: post.blog_id,
            title: post.title,
            body: post.body,
            creator_name: post.creator_name,
            creator_user_id: post.creator_user_id,
            date_created: post.date_created
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error." });
    }
});

app.post("/api/posts", async (req, res) => {
    const { title, body } = req.body; 

    if (!currentUser_id) {
        return res.status(401).json({ error: "Please log in before posting" });
    }

    if (!title || !body) {
        return res.status(400).json({ error: "Title and body are required" });
    }

    try {
        const result = await db.query(
            `INSERT INTO blogs (creator_name, creator_user_id, title, body)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [currentName, currentUser_id, title, body]
        );
        res.status(201).json({ success: true, post: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create post" });
    }
});

app.patch("/api/posts/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;


    try {
        const result = await db.query(
            `UPDATE blogs
             SET title = COALESCE($1, title),
                 body = COALESCE($2, body),
                 date_created = NOW()
             WHERE blog_id = $3 AND creator_user_id = $4
             RETURNING *;`,
            [title, content, id, currentUser_id]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ error: "Unauthorized or post not found" });
        }

        res.json({ success: true, updatedPost: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update post" });
    }
});

app.delete("/api/posts/:id", async (req, res) => {
    const { id } = req.params;

    if (!currentUser_id) {
        return res.status(401).json({ error: "You must be logged in to delete a post" });
    }

    try {
        const result = await db.query(
            `DELETE FROM blogs
             WHERE blog_id = $1 AND creator_user_id = $2
             RETURNING *`,
            [id, currentUser_id]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ error: "Unauthorized or post not found" });
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete post" });
    }
});

app.post("/api/signup", async (req, res) => {
    const { user_id, password, name } = req.body;
    try {
        await db.query(
            `INSERT INTO users (user_id, password, name)
             VALUES ($1, $2, $3)`,
            [user_id, password, name]
        );
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Username already taken" });
    }
});

app.post("/api/signin", async (req, res) => {
    const { user_id, password } = req.body;

    try {
        const result = await db.query("SELECT * FROM users WHERE user_id = $1", [user_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Username not found" });
        }
        if (result.rows[0].password !== password) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        currentUser_id = result.rows[0].user_id;
        currentName = result.rows[0].name;

        res.json({ success: true, user: { id: currentUser_id, name: currentName } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Signin failed" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});