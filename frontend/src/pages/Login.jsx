import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { loginapi } from "../api/loginapi.js";



const Login = () => {
  const [inputs, setInputs] = useState({
    username:"",
    password:"",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!inputs.username || !inputs.password) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    setError("");

    //  API call:
    try {
      const res = await loginapi(inputs);
      localStorage.setItem("chatapp-user", JSON.stringify(res.data));
      setLoading(false);
      navigate("/home");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
      setLoading(false);
    }
    
    };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="app-name">Chat<span>App</span></div>
          <p>Sign in to continue chatting</p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label-custom">Username</label>
          <input
            type="text"
            className="input-custom"
            placeholder="Enter your username"
            value={inputs.username}
            onChange={(e) => setInputs({...inputs,username:e.target.value})}
            onKeyPress={(e) => e.key === "Enter" && handleLogin(e)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label-custom">Password</label>
          <input
            type="password"
            className="input-custom"
            placeholder="Enter your password"
            value={inputs.password}
            onChange={(e) => setInputs({...inputs,password:e.target.value})}
            onKeyPress={(e) => e.key === "Enter" && handleLogin(e)}
          />
        </div>

        <button className="btn-auth" onClick={handleLogin} disabled={loading}>
          {loading && <span className="spinner-border spinner-border-sm me-2" />}
          <i className="bi bi-box-arrow-in-right me-2"></i>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to={"/signup"}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;