import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

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

  if (error) return <p className="error">{error}</p>;
  if (!overview) return <p>Loading...</p>;

  return (
    <div className="overview-container">
      <h2>Customer Overview for Customer ID: {overview.customer_id}</h2>
      <p><strong>Total Loans:</strong> {overview.total_loans}</p>
      <h3>Loans</h3>
      <table>
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
              <td>{loan.loan_id}</td>
              <td>Rs.{loan.principal.toFixed(2)}</td>
              <td>Rs.{loan.total_amount.toFixed(2)}</td>
              <td>Rs.{loan.total_interest.toFixed(2)}</td>
              <td>Rs.{loan.emi_amount.toFixed(2)}</td>
              <td>Rs.{loan.amount_paid.toFixed(2)}</td>
              <td>{loan.emis_left}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerOverview;