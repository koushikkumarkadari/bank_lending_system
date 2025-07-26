import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import './LoanTransactions.css';

const LoanTransactions = () => {
  const { loan_id } = useParams();
  const [ledger, setLedger] = useState(null);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchLedger = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/loans/${loan_id}/ledger`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLedger(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching loan transactions');
      }
    };
    fetchLedger();
  }, [user, navigate, loan_id]);

  if (error) return <p className="error">Error: {error}</p>;
  if (!ledger) return <p className="loading">Loading...</p>;

  return (
    <div className="transactions-container">
      <div className="loan-header">
        <h2>Loan Transactions</h2>
        <p className="loan-id">Loan ID: {ledger?.loan_id}</p>
      </div>
      
      <div className="loan-summary">
        <div className="summary-card">
          <h3>Loan Summary</h3>
          <div className="summary-items">
            <div className="summary-item">
              <span className="label">Monthly EMI:</span>
              <span className="value">Rs.{ledger?.monthly_emi?.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Balance Amount:</span>
              <span className="value">Rs.{ledger?.balance_amount?.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="label">EMIs Left:</span>
              <span className="value">{ledger?.emis_left}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <h3>Payment Transactions</h3>
        <div className="table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Amount</th>
                <th>Payment Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ledger?.transactions?.map((txn) => (
                <tr key={txn.payment_id}>
                  <td data-label="Payment ID">{txn.payment_id}</td>
                  <td data-label="Amount">Rs.{txn.amount.toFixed(2)}</td>
                  <td data-label="Payment Type">{txn.payment_type}</td>
                  <td data-label="Date">{new Date(txn.payment_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoanTransactions;