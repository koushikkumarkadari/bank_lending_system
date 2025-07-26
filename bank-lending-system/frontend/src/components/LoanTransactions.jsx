import React, { useState, useEffect, useContext } from 'react';
   import { useParams, useNavigate } from 'react-router-dom';
   import axios from 'axios';
   import { AuthContext } from '../context/AuthContext.jsx';

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

     if (error) return <p className="error">{error}</p>;
     if (!ledger) return <p>Loading...</p>;

     return (
       <div className="ledger-container">
         <h2>Loan Transactions for Loan ID: {ledger.loan_id}</h2>
         <p><strong>Monthly EMI:</strong> ${ledger.monthly_emi.toFixed(2)}</p>
         <p><strong>Balance Amount:</strong> ${ledger.balance_amount.toFixed(2)}</p>
         <p><strong>EMIs Left:</strong> {ledger.emis_left}</p>
         <h3>Payment Transactions</h3>
         <table>
           <thead>
             <tr>
               <th>Payment ID</th>
               <th>Amount</th>
               <th>Payment Type</th>
               <th>Date</th>
             </tr>
           </thead>
           <tbody>
             {ledger.transactions.map((txn) => (
               <tr key={txn.payment_id}>
                 <td>{txn.payment_id}</td>
                 <td>${txn.amount.toFixed(2)}</td>
                 <td>{txn.payment_type}</td>
                 <td>{new Date(txn.payment_date).toLocaleString()}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     );
   };

   export default LoanTransactions;