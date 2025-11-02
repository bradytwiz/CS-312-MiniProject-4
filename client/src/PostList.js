import { useState, useEffect } from "react";

function PostList({ user, refresh, onEdit }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/posts")
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort(
                    (a, b) => new Date(b.date_created) - new Date(a.date_created)
                );
                setPosts(sorted);
            })
            .catch(err => {
                console.error(err);
            });
    }, [refresh]); 

    const handleEdit = (id) => {
        if (onEdit) onEdit(id);
    };

    const handleDelete = async (id) => {

        try {
            const response = await fetch(`http://localhost:8000/api/posts/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            await response.json(); 

            if (!response.ok) {
                return;
            }

            setPosts(posts.filter(post => post.blog_id !== id));
        } catch (err) {
            console.error(err);
        }
    };



    return (
        <div className="content">
            {posts.length === 0 ? (
                <div className="no-posts">
                    <p>No posts yet, start Posting!</p>
                </div>
            ) : (
                posts.map(post => (
                    <div className="post" key={post.blog_id}>
                        <div className="post-buttons">
                            {user && String(user.id) === String(post.creator_user_id) && (
                                <>
                                    <button onClick={() => handleEdit(post.blog_id)}>Edit</button>
                                    <button onClick={() => handleDelete(post.blog_id)}>Delete</button>
                                </>
                            )}
                        </div>

                        <div className="post-header">
                            <h2>{post.title}</h2>
                            <small>Posted By {post.creator_name}</small>
                        </div>

                        <div className="post-content">
                            <p>{post.body}</p>
                            <small>Posted {new Date(post.date_created).toLocaleString()}</small>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default PostList;