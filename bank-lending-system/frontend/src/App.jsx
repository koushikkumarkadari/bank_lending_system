import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import CreateLoan from './components/CreateLoan.jsx';
import MakePayment from './components/MakePayment.jsx';
import LoanLedger from './components/LoanLedger.jsx';
import CustomerOverview from './components/CustomerOverview.jsx';
import LoanTransactions from './components/LoanTransactions.jsx';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Signup />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-loan" element={<CreateLoan />} />
              <Route path="/make-payment/:loan_id" element={<MakePayment />} />
              <Route path="/ledger" element={<LoanLedger />} />
              <Route path="/overview" element={<CustomerOverview />} />
              <Route path="/loans/:loan_id/transactions" element={<LoanTransactions />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;