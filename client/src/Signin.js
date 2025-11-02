import { useState } from "react";

function Signin({ onSigninSuccess }) {
    const [formData, setFormData] = useState({ user_id: "", password: "" });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/api/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                return;
            }

            if (onSigninSuccess) onSigninSuccess(data.user);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit} className="post-form">
                <div className="form-bar">
                    <label htmlFor="user_id">Username:</label><br />
                    <input
                        type="text"
                        id="user_id"
                        name="user_id"
                        value={formData.user_id}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-bar">
                    <label htmlFor="password">Password:</label><br />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className="error">{error}</p>}

                <button type="submit" className="submit-btn">Sign In</button>
            </form>
        </div>
    );
}

export default Signin;