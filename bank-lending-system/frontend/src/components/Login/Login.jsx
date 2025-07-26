import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, formData);
      login(response.data.token, response.data.customer_id);
      setMessage('Login successful!');
      navigate('/create-loan');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error during login');
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {message && <p className={message.includes('successful') ? 'message success' : 'error'}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading} // Disable input during loading
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={loading} // Disable input during loading
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? (
            <span className="loader"></span>
          ) : (
            'Login'
          )}
        </button>
      </form>
      
    </div>
  );
};

export default Login;