import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [credentials, setCredentials] = useState({ email: "", password: ""});
    const [error, setError] = useState("");
    
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/loginuser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: credentials.email, password: credentials.password })
            });
            const json = await response.json();
            if (!json.success) {
                setError(json.errors);
            } else {
                localStorage.setItem("userEmail", credentials.email);
                console.log(localStorage.getItem("userEmail"));
                localStorage.setItem("authToken", json.authToken);
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            setError("Internal server error");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className='container'>
            <form onSubmit={handleSubmit} className='container p-4 mt-5' style={{ width: "23rem",backgroundColor:"#D3D3D3",borderRadius:"22px" }}>
                <h2 className='d-flex justify-content-center'>Login</h2>
                {error ?<p style={{backgroundColor:"#f45e5e",padding:"10px",borderRadius:"22px"}}>{error}</p>:""}
                <div className="form-outline mb-4 mt-3">
                    <label className="form-label" htmlFor="form2Example1">Email address</label>
                    <input type="email" id="form2Example1" className="form-control" name='email' value={credentials.email} onChange={onChange} />
                </div>

                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example2">Password</label>
                    <input type="password" id="form2Example2" className="form-control" name='password' value={credentials.password} onChange={onChange} />
                </div>

                <div className="row mb-4">
                    <div className="col d-flex justify-content-center">
                        <div className="form-check">
                            {/* Provide an onChange handler or use defaultChecked */}
                            <input className="form-check-input" type="checkbox" value="" id="form2Example31" defaultChecked={false} />
                            <label className="form-check-label" htmlFor="form2Example31"> Remember me </label>
                        </div>
                    </div>

                    <div className="col">
                        <a href="#!" style={{textDecoration:"none"}}>Forgot password?</a>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>

                <div className="text-center">
                    <p>Not a member? <Link to='/signup'>Register</Link></p>
                </div>
            </form>
        </div>
    );
}
