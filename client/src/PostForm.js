import { useState } from "react";

export default function PostForm({ user, onPostCreated }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("You must be signed in to create a post.");
            return;
        }

        if (!title.trim() || !body.trim()) {
            setError("Title and body cannot be empty.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, body }), // matches backend
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to create post.");
                return;
            }

            // Clear form
            setTitle("");
            setBody("");
            setError("");

            // Notify parent to refresh post list
            onPostCreated();

        } catch (err) {
            console.error(err);
            setError("Network error, please try again.");
        }
    };

    return (
        <div className="content">
            <form className="post-form" onSubmit={handleSubmit}>
                <div className="form-bar">
                    <label htmlFor="title">Title:</label><br />
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-bar content-bar">
                    <label htmlFor="body">Content:</label><br />
                    <textarea
                        id="body"
                        name="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows="6"
                        required
                    />
                </div>

                {error && <p className="error">{error}</p>}

                <button type="submit" className="submit-btn">Create Post</button>
            </form>
        </div>
    );
}
