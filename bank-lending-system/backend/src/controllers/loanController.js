const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');

exports.createLoan = (req, res) => {
  const { loan_amount, loan_period_years, interest_rate_yearly } = req.body;
  const customer_id = req.customer_id;

  if (loan_amount <= 0 || loan_period_years <= 0 || interest_rate_yearly < 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  db.get('SELECT * FROM Customers WHERE customer_id = ?', [customer_id], (err, customer) => {
    if (err || !customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const total_interest = loan_amount * loan_period_years * (interest_rate_yearly / 100);
    const total_amount = loan_amount + total_interest;
    const monthly_emi = total_amount / (loan_period_years * 12);
    const loan_id = uuidv4();

    db.run(
      'INSERT INTO Loans (loan_id, customer_id, principal_amount, total_amount, interest_rate, loan_period_years, monthly_emi, status, amount_paid, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [loan_id, customer_id, loan_amount, total_amount, interest_rate_yearly, loan_period_years, monthly_emi, 'ACTIVE', 0, new Date().toISOString()],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to create loan' });
        }
        res.status(201).json({
          loan_id,
          customer_id,
          total_amount_payable: total_amount,
          monthly_emi,
        });
      }
    );
  });
};

exports.makePayment = (req, res) => {
  const { loan_id } = req.params;
  const { amount, payment_type } = req.body;
  const customer_id = req.customer_id;

  if (amount <= 0 || !['EMI', 'LUMP_SUM'].includes(payment_type)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  db.get('SELECT * FROM Loans WHERE loan_id = ? AND status = ? AND customer_id = ?', [loan_id, 'ACTIVE', customer_id], (err, loan) => {
    if (err || !loan) {
      return res.status(404).json({ error: 'Loan not found, already paid off, or not authorized' });
    }

    const { total_amount, amount_paid, monthly_emi } = loan;
    const new_amount_paid = amount_paid + amount;
    const remaining_balance = Math.max(0, total_amount - new_amount_paid);
    const emis_left = remaining_balance > 0 ? Math.ceil(remaining_balance / monthly_emi) : 0;

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      const payment_id = uuidv4();
      db.run(
        'INSERT INTO Payments (payment_id, loan_id, amount, payment_type, payment_date) VALUES (?, ?, ?, ?, ?)',
        [payment_id, loan_id, amount, payment_type, new Date().toISOString()],
        (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Failed to record payment' });
          }

          const status = new_amount_paid >= total_amount ? 'PAID_OFF' : 'ACTIVE';
          db.run(
            'UPDATE Loans SET amount_paid = ?, status = ? WHERE loan_id = ?',
            [new_amount_paid, status, loan_id],
            (err) => {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Failed to update loan' });
              }
              db.run('COMMIT');
              res.status(200).json({
                payment_id,
                loan_id,
                message: 'Payment recorded successfully.',
                remaining_balance,
                emis_left,
              });
            }
          );
        }
      );
    });
  });
};

exports.getLedger = (req, res) => {
  const customer_id = req.customer_id;

  db.all('SELECT * FROM Loans WHERE customer_id = ?', [customer_id], (err, loans) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch loans' });
    }

    const loanDetails = loans.map(loan => ({
      loan_id: loan.loan_id,
      principal: loan.principal_amount,
      total_amount: loan.total_amount,
      monthly_emi: loan.monthly_emi,
      amount_paid: loan.amount_paid,
      balance_amount: Math.max(0, loan.total_amount - loan.amount_paid),
      emis_left: Math.max(0, loan.total_amount - loan.amount_paid) > 0 ? Math.ceil((loan.total_amount - loan.amount_paid) / loan.monthly_emi) : 0,
      status: loan.status,
    }));

    res.status(200).json({
      customer_id,
      loans: loanDetails,
    });
  });
};
exports.getLoanLedger = (req, res) => {
     const { loan_id } = req.params;
     const customer_id = req.customer_id;

     db.get('SELECT * FROM Loans WHERE loan_id = ? AND customer_id = ?', [loan_id, customer_id], (err, loan) => {
       if (err || !loan) {
         return res.status(404).json({ error: 'Loan not found or not authorized' });
       }

       db.all('SELECT payment_id, amount, payment_type, payment_date FROM Payments WHERE loan_id = ?', [loan_id], (err, payments) => {
         if (err) {
           return res.status(500).json({ error: 'Failed to fetch payments' });
         }

         const balance_amount = Math.max(0, loan.total_amount - loan.amount_paid);
         const emis_left = balance_amount > 0 ? Math.ceil(balance_amount / loan.monthly_emi) : 0;

         res.status(200).json({
           loan_id,
           monthly_emi: loan.monthly_emi,
           balance_amount,
           emis_left,
           transactions: payments.map(p => ({
             payment_id: p.payment_id,
             amount: p.amount,
             payment_type: p.payment_type,
             payment_date: p.payment_date,
           })),
         });
       });
     });
   };