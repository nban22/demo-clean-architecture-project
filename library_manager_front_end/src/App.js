// src/App.js (cập nhật)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Cần thiết cho dropdown menu
import Navbar from './components/Navbar';
import Home from './pages/Home';

// Book pages
import BooksList from './pages/BooksList';
import BookDetails from './pages/BookDetails';
import CreateBook from './pages/CreateBook';
import BookEdit from './pages/BookEdit';

// Reader pages
import ReadersList from './pages/ReadersList';
import ReaderDetails from './pages/ReaderDetails';
import CreateReader from './pages/CreateReader';
import ReaderEdit from './pages/ReaderEdit';

// Loan pages
import LoansList from './pages/LoansList';
import ActiveLoansList from './pages/ActiveLoansList';
import LoanDetails from './pages/LoanDetails';
import CreateLoan from './pages/CreateLoan';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Book routes */}
          <Route path="/books" element={<BooksList />} />
          <Route path="/books/create" element={<CreateBook />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/books/edit/:id" element={<BookEdit />} />
          
          {/* Reader routes */}
          <Route path="/readers" element={<ReadersList />} />
          <Route path="/readers/create" element={<CreateReader />} />
          <Route path="/readers/:id" element={<ReaderDetails />} />
          <Route path="/readers/edit/:id" element={<ReaderEdit />} />
          
          {/* Loan routes */}
          <Route path="/loans" element={<LoansList />} />
          <Route path="/loans/active" element={<ActiveLoansList />} />
          <Route path="/loans/create" element={<CreateLoan />} />
          <Route path="/loans/:id" element={<LoanDetails />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;