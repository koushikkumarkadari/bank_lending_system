const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

const loanRoutes = require('./routes/loans');
const customerRoutes = require('./routes/customers');
const authRoutes = require('./routes/auth');

app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});