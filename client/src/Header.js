function Header({ user, setPage }) {
    return (
        <div className="topbar">
            <a href="#" onClick={() => setPage("posts")}>Home</a>
            <a href="#" onClick={() => setPage("create")}>Create Post</a>
            <a href="#" onClick={() => setPage("signup")}>Sign Up</a>
            <a href="#" onClick={() => setPage("signin")}>Sign In</a>
        </div>
    );
}

export default Header;