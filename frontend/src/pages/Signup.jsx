import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/api.js";

const Signup = () => {
  const [inputs, setInputs] = useState({
    fullname:'',
    username:'',
    password:'',
    confirmpassword:'',
    
  });
  const [gender, setGender] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
   
    if (!inputs.fullname || !inputs.username || !inputs.password || !inputs.confirmpassword || !gender) {
      setError("Please fill all fields and select gender");
      return;
    }
    if (inputs.password !== inputs.confirmpassword) {
      setError("Passwords do not match");
      return;
    }
    if(inputs.password.length < 6){
      setError("Passwords must be atleast 6 characters");
      return;
    }
    
    setLoading(true);
    setError("");

    //  API call:
    try {
            const res = await signup(inputs,gender);
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
         
          <p>Create your account</p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "red",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label-custom">Full Name</label>
          <input type="text" className="input-custom"
            placeholder="Enter your full name"
            value={inputs.fullname} 
            onChange={(e) => setInputs({...inputs,fullname:e.target.value})} />
        </div>

        <div className="mb-3">
          <label className="form-label-custom">Username</label>
          <input type="text" className="input-custom"
            placeholder="Choose a username"
            value={inputs.username} 
            onChange={(e) => setInputs({...inputs,username:e.target.value})} />
        </div>

        <div className="mb-3">
          <label className="form-label-custom">Password</label>
          <input type="password" className="input-custom"
            placeholder="Create a password"
            value={inputs.password} 
            onChange={(e) => setInputs({...inputs,password:e.target.value})} />
        </div>

        <div className="mb-3">
          <label className="form-label-custom">Confirm Password</label>
          <input type="password" className="input-custom"
            placeholder="Confirm your password"
            value={inputs.confirmpassword} 
            onChange={(e) => setInputs({...inputs,confirmpassword:e.target.value})} />
        </div>

        <div className="mb-4">
          <label className="form-label-custom">Gender</label>
          <div style={{ display: "flex", gap: 12 }}>
            <div
              className={`gender-option ${gender === "male" ? "male-active" : ""}`}
              onClick={() => setGender("male")}
            >
              <div className="gender-emoji">👨</div>
              <div className="gender-label">Male</div>
            </div>
            <div
              className={`gender-option ${gender === "female" ? "female-active" : ""}`}
              onClick={() => setGender("female")}
            >
              <div className="gender-emoji">👩</div>
              <div className="gender-label">Female</div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-auth" onClick={handleSignup} disabled={loading}>
          {loading && <span className="spinner-border spinner-border-sm me-2" />}
          <i className="bi bi-person-plus me-2"></i>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to={"/login"}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;