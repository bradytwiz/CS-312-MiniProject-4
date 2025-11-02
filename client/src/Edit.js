import { useState, useEffect } from "react";

function Edit({  postId, onDone }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");


    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/posts/${postId}`);
                const data = await res.json();

                if (!res.ok) {
                    return;
                }

                setTitle(data.title);
                setBody(data.body);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPost();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !body.trim()) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:8000/api/posts/${postId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, content: body })
            });

            await res.json();

            if (!res.ok) {
                return;
            }

            onDone();
        } catch (err) {
            console.error(err);
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-bar content-bar">
                    <label htmlFor="body">Content:</label><br />
                    <textarea
                        id="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows="6"
                        required
                    />
                </div>

                {error && <p className="error">{error}</p>}

                <button type="submit" className="submit-btn">Update Post</button>
            </form>
        </div>
    );
}

export default Edit;