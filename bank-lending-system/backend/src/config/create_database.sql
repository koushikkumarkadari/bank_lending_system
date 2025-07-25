-- Drop existing tables if they exist
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS Loans;
DROP TABLE IF EXISTS Customers;

-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- Create Customers table with email and password
CREATE TABLE Customers (
  customer_id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Loans table
CREATE TABLE Loans (
  loan_id TEXT PRIMARY KEY,
  customer_id TEXT,
  principal_amount DECIMAL,
  total_amount DECIMAL,
  interest_rate DECIMAL,
  loan_period_years INTEGER,
  monthly_emi DECIMAL,
  status TEXT DEFAULT 'ACTIVE',
  amount_paid DECIMAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Create Payments table
CREATE TABLE Payments (
  payment_id TEXT PRIMARY KEY,
  loan_id TEXT,
  amount DECIMAL,
  payment_type TEXT,
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loan_id) REFERENCES Loans(loan_id)
);