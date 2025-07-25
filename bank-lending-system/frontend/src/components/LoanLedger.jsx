import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

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
  if (!ledger) return <p>Loading...</p>;

  return (
    <div className="ledger-container">
      <h2>Loan Ledger for Customer ID: {ledger.customer_id}</h2>
      <table>
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {ledger.loans.map((loan) => (
            <tr key={loan.loan_id}>
              <td>{loan.loan_id}</td>
              <td>${loan.principal.toFixed(2)}</td>
              <td>${loan.total_amount.toFixed(2)}</td>
              <td>${loan.monthly_emi.toFixed(2)}</td>
              <td>${loan.amount_paid.toFixed(2)}</td>
              <td>${loan.balance_amount.toFixed(2)}</td>
              <td>{loan.emis_left}</td>
              <td>{loan.status}</td>
              <td>
                <Link to={`/make-payment/${loan.loan_id}`}>
                  <button disabled={loan.status === 'PAID_OFF'}>Make Payment</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanLedger;