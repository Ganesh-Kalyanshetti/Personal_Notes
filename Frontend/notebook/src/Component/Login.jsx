import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Style/login.css'

const LOGIN=`${import.meta.env.VITE_API_URL}/login`;
const  GETFOLDER=`${import.meta.env.VITE_API_URL}/getfolders`;

function Login() {
    const [form, setForm] = useState({ Username: '', Password: '', });
    const [message, setmsg] = useState('');

    const navigate = useNavigate();
    const handleChange = (e) => {

        setForm({ ...form, [e.target.name]: e.target.value });
        setmsg('');

    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(LOGIN, form);
            const data = res.data;
            setmsg(data.message || 'Login Success');

            if (data.token) {
                localStorage.setItem('token', data.token);

                const folderres = await axios.get(GETFOLDER, { headers: { Authorization: `Bearer ${data.token}` }, });

                const folders = folderres.data.folders || [];

                navigate('/dashboard', { state: { folders } });
            }
        }
        catch (e) {
            console.log(`error  ${e}`);
            setmsg(`Login Failed`);
        }
    }

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="welcome-box">
                    <h1>Welcome Back!</h1>
                    <p>You can seemlessly continue your personal notes</p>
                </div>
            </div>
            <div className="login-right">
                <div className="login-form-container">
                    <form onSubmit={handlesubmit}>
                        <input type="text" name="Username" placeholder="Username" value={form.Username} onChange={handleChange} />
                        <input type="password" name="Password" placeholder="Password" value={form.Password} onChange={handleChange} />
                        <button type="submit">Login</button>
                    </form>
                    <h3>{message}</h3>
                </div>
            </div>
        </div>
    );


}
export default Login;