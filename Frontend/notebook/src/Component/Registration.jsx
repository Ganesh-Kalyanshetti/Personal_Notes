import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Style/register.css';
import.meta.env.VITE_API_URL

// const API = "http://localhost:3000/register";
const API =`${import.meta.env.VITE_API_URL}/register`

function Registration() {
  const [form, setForm] = useState({ Full_Name: '', Username: '', Password: '' });
  const [message, setmsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setmsg('');
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API, form);
      const data = res.data;
      if (data.token) {
        setmsg(data.message || 'Registration Complete');
        localStorage.setItem('token', data.token);
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setmsg(data.message || 'Registration Failed');
      }
    } catch (e) {
      const errorMsg = e.response?.data?.message || 'Server error';
      setmsg(errorMsg);
    }
  };

  return (
    <div className="register-container">
      <div className="left-section">
        <h1>Welcome to SelfNotes</h1> <br />
        <h4>
        <p>Type it. Tuck it. Track it.Notes, docs, doodles, dreams
        </p><br />
        <p>All kept safe and simple in one cozy corner.Clean vibes. Quick access. Yours to the core.
        </p>
        </h4>
      </div>

      <div className="right-section">
        <div className="register-form">
          <form onSubmit={handlesubmit}>
            <input type="text" name="Full_Name" placeholder="Full Name" value={form.Full_Name} onChange={handleChange} required />
            <input type="text" name="Username" placeholder="Username" value={form.Username} onChange={handleChange} required />
            <input type="password" name="Password" placeholder="Password" value={form.Password} onChange={handleChange} required />
            <button type="submit">Register</button>
          </form>
          <h3 className="register-message">{message}</h3>
          <button type="button" onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Registration;
