import { useState } from "react";

function Signup({ onSignupSuccess }) {
    const [formData, setFormData] = useState({ user_id: "", password: "", name: "" });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            
            await response.json();

            if (!response.ok) {
                return;
            }

            if (onSignupSuccess) onSignupSuccess();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
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

                {error && <p className="error">{error}</p>}

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

                <div className="form-bar content-bar">
                    <label htmlFor="name">First Name:</label><br />
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">Sign Up</button>
            </form>
        </div>
    );
}

export default Signup;