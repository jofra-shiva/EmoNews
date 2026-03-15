import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const history = useHistory();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const API_URL = process.env.REACT_APP_API_URL || "/api";
      await axios.post(`${API_URL}/register`, { name, email, password });
      history.push("/");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration Failed";
      alert(errorMsg);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box animate-fade-in">
        <div className="register-logo"><span role="img" aria-label="memo">📝</span></div>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 className="register-title">EMONews AI</h1>
        </Link>
        <p>Join EmoNews AI for personalized news</p>
        
        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="input-field"
            />
          </div>
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
          <button type="submit" className="register-button">Get Started</button>
        </form>
        
        <p className="login-link">
          Already have an account? <a href="/">Sign In</a>
        </p>

        <div className="branding-footer">
          <span className="author-tag">BY SHIVA</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
