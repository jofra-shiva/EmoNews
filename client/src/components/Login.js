import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const API_URL = process.env.REACT_APP_API_URL || "/api";
      const response = await axios.post(`${API_URL}/login`, { email, password });

      // The backend returns "Sucess" (single 'c')
      if (response.data === "Sucess" || response.data === "Success") {
        localStorage.setItem("isAuthenticated", "true");
        history.push("/dashboard");
      } else {
        alert(response.data);
      }
    } catch (error) {
      alert("Login Failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box animate-fade-in">
        <div className="login-logo"><span role="img" aria-label="mask">🎭</span></div>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to EmoNews AI</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        
        <p className="register-link">
          New to EmoNews? <a href="/register">Create an account</a>
        </p>

        <div className="branding-footer">
          BY SHIVA
        </div>
      </div>
    </div>
  );
};

export default Login;
