import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import './CreateLoan.css';

const CreateLoan = () => {
  const [formData, setFormData] = useState({
    loan_amount: '',
    loan_period_years: '',
    interest_rate_yearly: '',
  });
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/loans`, {
        loan_amount: parseFloat(formData.loan_amount),
        loan_period_years: parseInt(formData.loan_period_years),
        interest_rate_yearly: parseFloat(formData.interest_rate_yearly),
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessage(`Loan created successfully! Loan ID: ${response.data.loan_id}`);
      setFormData({
        loan_amount: '',
        loan_period_years: '',
        interest_rate_yearly: '',
      });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error creating loan');
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="create-loan-container">
      <div className="form-card">
        <h2>Create New Loan</h2>
        {message && (
          <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="loan-form">
          <div className="form-group">
            <label htmlFor="loan_amount">Loan Amount</label>
            <input
              id="loan_amount"
              type="number"
              step="0.01"
              value={formData.loan_amount}
              onChange={(e) => handleChange('loan_amount', e.target.value)}
              required
              placeholder="Enter loan amount"
            />
          </div>
          <div className="form-group">
            <label htmlFor="loan_period_years">Loan Period (Years)</label>
            <input
              id="loan_period_years"
              type="number"
              value={formData.loan_period_years}
              onChange={(e) => handleChange('loan_period_years', e.target.value)}
              required
              placeholder="Enter loan period"
              min="1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="interest_rate_yearly">Interest Rate (% per year)</label>
            <input
              id="interest_rate_yearly"
              type="number"
              step="0.01"
              value={formData.interest_rate_yearly}
              onChange={(e) => handleChange('interest_rate_yearly', e.target.value)}
              required
              placeholder="Enter interest rate"
              min="0"
              max="100"
            />
          </div>
          <button type="submit" className="submit-btn">
            Create Loan
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLoan;