import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
    const [credentials, setCredentials] = useState({ email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (credentials.password === credentials.confirmPassword) {
            try {
                const response = await fetch("http://localhost:5000/api/createuser", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: credentials.email, password: credentials.password })
                });
                const json = await response.json();
                console.log(json);
                if (!json.success) {
                    setError(json.errors);
                } else {
                    localStorage.setItem("userEmail", credentials.email);
                    localStorage.setItem("authToken", json.authToken);
                    // Redirect to another page after successful signup
                    navigate('/'); // Use navigate() to redirect
                }
            } catch (error) {
                console.error(error);
                setError("Internal server error");
            }
        } else {
            setError("Password did not match");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className='container'>
            <form onSubmit={handleSubmit} className='container p-4 mt-5' style={{ width: "23rem", backgroundColor: "#D3D3D3", borderRadius: "22px" }}>
                <h2 className='d-flex justify-content-center'>Sign Up</h2>
                {error ?<p style={{backgroundColor:"#f45e5e",padding:"10px",borderRadius:"22px"}}>{error}</p>:""}
                <div className="form-outline mb-4 mt-3">
                    <label className="form-label" htmlFor="form2Example1">Email address</label>
                    <input type="email" id="form2Example1" className="form-control" name='email' value={credentials.email} onChange={onChange} />
                </div>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example2">Password</label>
                    <input type="password" id="form2Example2" className="form-control" name='password' value={credentials.password} onChange={onChange} />
                </div>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example2">Confirm Password</label>
                    <input type="password" id="form2Example2" className="form-control" name='confirmPassword' value={credentials.confirmPassword} onChange={onChange} />
                </div>

                <button type="submit" className="btn btn-primary btn-block mb-4">Sign Up</button>

                <div className="text-center">
                    <p>Already a member? <Link to='/login'>Login</Link></p>
                </div>
            </form>
        </div>
    );
}
