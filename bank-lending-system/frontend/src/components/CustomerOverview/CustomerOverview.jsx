import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './CustomerOverview.css';

const CustomerOverview = () => {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOverview = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/customers/overview`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOverview(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching overview');
      }
    };
    fetchOverview();
  }, [user, navigate]);

  if (error) return <p className="error">Error: {error}</p>;
  if (!overview) return <p className="loading">Loading...</p>;

  return (
    <div className="overview-container">
      <h2>Customer Overview for Customer ID: {overview.customer_id}</h2>
      <div className="summary-card">
        <p className="total-loans"><strong>Total Loans:</strong> {overview.total_loans}</p>
      </div>
      
      <h3>Loans</h3>
      <div className="table-wrapper">
        <table className="overview-table">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Principal</th>
              <th>Total Amount</th>
              <th>Total Interest</th>
              <th>EMI Amount</th>
              <th>Amount Paid</th>
              <th>EMIs Left</th>
            </tr>
          </thead>
          <tbody>
            {overview.loans.map((loan) => (
              <tr key={loan.loan_id}>
                <td data-label="Loan ID">{loan.loan_id}</td>
                <td data-label="Principal">Rs.{loan.principal.toFixed(2)}</td>
                <td data-label="Total Amount">Rs.{loan.total_amount.toFixed(2)}</td>
                <td data-label="Total Interest">Rs.{loan.total_interest.toFixed(2)}</td>
                <td data-label="EMI Amount">Rs.{loan.emi_amount.toFixed(2)}</td>
                <td data-label="Amount Paid">Rs.{loan.amount_paid.toFixed(2)}</td>
                <td data-label="EMIs Left">{loan.emis_left}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerOverview;