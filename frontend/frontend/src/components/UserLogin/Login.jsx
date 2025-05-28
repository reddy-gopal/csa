import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:3000/user/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: username,
                    password: password
                })
            });

            const data = await response.json();
            console.log("Login response:", data);

           
        } catch (error) {
            console.error("Login failed:", error);
            navigate("/register")

        }
    };

    return (
        <div>
            <div>
                <label>Username</label>
                <input
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleLogin}>Login</button>
            <p>Not a user? <Link to="/register">Register here</Link></p>

        </div>
    );
};

export default Login;
