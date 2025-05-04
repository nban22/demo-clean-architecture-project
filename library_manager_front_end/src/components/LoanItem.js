// src/components/LoanItem.js - Sửa lại
import React from 'react';
import { Link } from 'react-router-dom';

const LoanItem = ({ loan, onReturn }) => {
  const handleReturn = () => {
    if (!loan.returnDate && typeof onReturn === 'function') {
      onReturn(loan.id);
    }
  };

  return (
    <tr>
      <td>{loan.bookTitle}</td>
      <td>{loan.readerName}</td>
      <td>{new Date(loan.loanDate).toLocaleDateString()}</td>
      <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
      <td>
        {loan.returnDate 
          ? new Date(loan.returnDate).toLocaleDateString() 
          : loan.isOverdue 
            ? <span className="badge bg-danger">Quá hạn</span> 
            : <span className="badge bg-warning">Đang mượn</span>}
      </td>
      <td>
        <Link to={`/loans/${loan.id}`} className="btn btn-info btn-sm me-2">
          Chi tiết
        </Link>
        {!loan.returnDate && (
          <button 
            onClick={handleReturn}
            className="btn btn-success btn-sm"
          >
            Trả sách
          </button>
        )}
      </td>
    </tr>
  );
};

export default LoanItem;