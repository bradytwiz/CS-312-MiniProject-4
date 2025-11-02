import "./styles/main.css"
import Edit from "./Edit"
import PostForm from "./PostForm";
import PostList from "./PostList";
import Signup from "./Signup";
import Signin from "./Signin";
import Header from "./Header";
import Footer from "./Footer";
import { useState } from "react";

function App() {
    const [page, setPage] = useState("posts");
    const [editingPostId, setEditingPostId] = useState(null);
    const [user, setUser] = useState(null);
    const [refreshPosts, setRefreshPosts] = useState(false);

    const handlePostCreated = () => setRefreshPosts(!refreshPosts);

    const handleEditClick = (postId) => {
        setEditingPostId(postId);
        setPage("edit");
    };

    return (
        <div>
            <Header user={user} setPage={setPage} />

            <main>
                {page === "posts" && <PostList user={user} refresh={refreshPosts} onEdit={handleEditClick} />}
                {page === "create" && <PostForm user={user} onPostCreated={handlePostCreated} />}
                {page === "edit" && <Edit  
                    postId={editingPostId} 
                    onDone={() => { setPage("posts"); setRefreshPosts(!refreshPosts); }} 
                />}
                {page === "signup" && <Signup onSignupSuccess={() => setPage("signin")} />}
                {page === "signin" && <Signin onSigninSuccess={(user) => { setUser(user); setPage("posts"); }} />}
            </main>

            <Footer />
        </div>
    );
}

export default App;