import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import './LoanLedger.css';

const LoanLedger = () => {
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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/loans/ledger`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLedger(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching ledger');
      }
    };
    fetchLedger();
  }, [user, navigate]);

  if (error) return <p className="error">{error}</p>;
  if (!ledger) return <p className="loading">Loading...</p>;

  return (
    <div className="ledger-container">
      <h2>Loan Ledger for Customer ID: {ledger.customer_id}</h2>
      <div className="table-wrapper">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Principal</th>
              <th>Total Amount</th>
              <th>Monthly EMI</th>
              <th>Amount Paid</th>
              <th>Balance Amount</th>
              <th>EMIs Left</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ledger.loans.map((loan) => (
              <tr key={loan.loan_id}>
                <td data-label="Loan ID">{loan.loan_id}</td>
                <td data-label="Principal">Rs.{loan.principal.toFixed(2)}</td> 
                <td data-label="Total Amount">Rs.{loan.total_amount.toFixed(2)}</td>
                <td data-label="Monthly EMI">Rs.{loan.monthly_emi.toFixed(2)}</td>
                <td data-label="Amount Paid">Rs.{loan.amount_paid.toFixed(2)}</td>
                <td data-label="Balance Amount">Rs.{loan.balance_amount.toFixed(2)}</td>
                <td data-label="EMIs Left">{loan.emis_left}</td>
                <td data-label="Status">{loan.status}</td>
                <td data-label="Actions" className="actions-cell">
                  <Link to={`/make-payment/${loan.loan_id}`}>
                    <button 
                      className="action-btn payment-btn"
                      disabled={loan.status === 'PAID_OFF'}
                    >
                      Pay
                    </button>
                  </Link>
                  <Link to={`/loans/${loan.loan_id}/transactions`}>
                    <button className="action-btn transactions-btn">
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanLedger;