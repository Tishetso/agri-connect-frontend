import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const res = await fetch('http://localhost:8080/api/login',{
                method: 'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify(formData)
            });

            // const data = await res.json();
            // if (res.ok){
            //     localStorage.setItem('user', JSON.stringify({
            //         'token': data.token, role: data.role, name: data.name, region: data.region
            //     }));
            //     navigate(`/${data.role}`);
            // }else{
            //     alert("Invalid user.");
            // }

            let data;
            const text = await res.text(); // read once


            try{
                //parsing as JSON
                data = JSON.parse(text);

            }catch {
                //fallback to plain text if not json
               data = { error: text};
            }

            if (res.ok){
                //save user info to localstorage
                localStorage.clear();

                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        token: data.token,
                        role: data.role,
                        name: data.name,
                        region: data.region,
                    })
                );


                //navigate to role-based dashboard
                navigate(`/${data.role}`);

            }else{
                //show backend error message
                alert(data.error || "Login failed. Please try again.")
            }
        }catch(err){
            console.error(err)
            alert("server error. Please try again.");
        }

       
    };

    return (
        <div className="login-container">
            <h2>Login to AgriConnect</h2>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <button type="submit" className="login-btn">Login</button>
            </form>

            <p className="register-link">
                Don't have an account? <a href="/register">Register here</a>
            </p>
            <p className="forgotPassword-link">
                Forgot Password? <a href="/forgot-password">Reset it here</a>
            </p>
        </div>
    );
}

export default LoginPage;
