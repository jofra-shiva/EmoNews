import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
      alert("Registration Failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box animate-fade-in">
        <div className="register-logo">📝</div>
        <Link to="/tamil" style={{ textDecoration: 'none' }}>
          <h1>EMONews AI (TAMIL) <span className="author-tag">BY SHIVA</span></h1>
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
          BY SHIVA
        </div>
      </div>
    </div>
  );
};

export default Register;
