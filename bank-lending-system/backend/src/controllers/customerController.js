const db = require('../models/db');

exports.getOverview = (req, res) => {
  const customer_id = req.customer_id;

  db.get('SELECT * FROM Customers WHERE customer_id = ?', [customer_id], (err, customer) => {
    if (err || !customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    db.all('SELECT * FROM Loans WHERE customer_id = ?', [customer_id], (err, loans) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch loans' });
      }
      const loanDetails = loans.map(loan => ({
        loan_id: loan.loan_id,
        principal: loan.principal_amount,
        total_amount: loan.total_amount,
        total_interest: loan.total_amount - loan.principal_amount,
        emi_amount: loan.monthly_emi,
        amount_paid: loan.amount_paid,
        emis_left: Math.max(0, loan.total_amount - loan.amount_paid) > 0 ? Math.ceil((loan.total_amount - loan.amount_paid) / loan.monthly_emi) : 0,
      }));

      res.status(200).json({
        customer_id,
        total_loans: loans.length,
        loans: loanDetails,
      });
    });
  });
};