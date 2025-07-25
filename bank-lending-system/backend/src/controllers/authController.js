const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const dotenv = require('dotenv');

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  db.get('SELECT * FROM Customers WHERE email = ?', [email], async (err, customer) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (customer) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer_id = uuidv4();

    db.run(
      'INSERT INTO Customers (customer_id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)',
      [customer_id, name, email, hashedPassword, new Date().toISOString()],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to create customer' });
        }
        res.status(201).json({ message: 'Signup successful', customer_id });
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM Customers WHERE email = ?', [email], async (err, customer) => {
    if (err || !customer) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, customer.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ customer_id: customer.customer_id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, customer_id: customer.customer_id });
  });
};