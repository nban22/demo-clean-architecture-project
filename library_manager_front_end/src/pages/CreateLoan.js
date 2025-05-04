// src/pages/CreateLoan.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoanForm from '../components/LoanForm';
import { createLoan } from '../services/api';

const CreateLoan = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (loanData) => {
    try {
      // Convert string IDs to integers
      const processedData = {
        ...loanData,
        bookId: parseInt(loanData.bookId),
        readerId: parseInt(loanData.readerId)
      };
      
      await createLoan(processedData);
      navigate('/loans');
    } catch (err) {
      setError('Lỗi khi tạo phiếu mượn. Vui lòng thử lại.');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Tạo phiếu mượn mới</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card">
        <div className="card-body">
          <LoanForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CreateLoan;