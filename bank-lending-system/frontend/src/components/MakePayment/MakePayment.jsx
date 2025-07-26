import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';

const MakePayment = () => {
  const { loan_id } = useParams();
  const [formData, setFormData] = useState({
    amount: '',
    payment_type: 'EMI',
  });
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/loans/${loan_id}/payments`, {
        amount: parseFloat(formData.amount),
        payment_type: formData.payment_type,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessage(`Payment recorded! Remaining Balance: ${response.data.remaining_balance}, EMIs Left: ${response.data.emis_left}`);
      setFormData({ amount: '', payment_type: 'EMI' });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error recording payment');
    }
  };

  return (
    <div className="form-container">
      <h2>Make Payment for Loan ID: {loan_id}</h2>
      {message && <p className={message.includes('recorded') ? 'message success' : 'error'}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Payment Type</label>
          <select
            value={formData.payment_type}
            onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
          >
            <option value="EMI">EMI</option>
            <option value="LUMP_SUM">Lump Sum</option>
          </select>
        </div>
        <button type="submit">Submit Payment</button>
      </form>
    </div>
  );
};

export default MakePayment;