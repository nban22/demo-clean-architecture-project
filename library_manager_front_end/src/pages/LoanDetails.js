// src/pages/LoanDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLoanById, returnBook } from '../services/api';

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        setLoading(true);
        const data = await getLoanById(parseInt(id));
        setLoan(data);
      } catch (err) {
        setError('Không thể tải thông tin phiếu mượn. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [id]);

  const handleReturn = async () => {
    if (window.confirm('Xác nhận trả sách?')) {
      try {
        await returnBook(parseInt(id));
        // Tải lại thông tin phiếu mượn
        const updatedLoan = await getLoanById(parseInt(id));
        setLoan(updatedLoan);
      } catch (err) {
        setError('Lỗi khi trả sách. Vui lòng thử lại sau.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Đang tải...</span>
      </div>
    </div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!loan) {
    return <div className="alert alert-warning">Không tìm thấy phiếu mượn</div>;
  }

  return (
    <div className="container">
      <h2 className="mb-4">Chi tiết phiếu mượn</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Phiếu mượn #{loan.id}</h5>
          <div className="card-text">
            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>Sách:</strong> {loan.bookTitle}</p>
                <p><strong>Độc giả:</strong> {loan.readerName}</p>
                <p><strong>Ngày mượn:</strong> {new Date(loan.loanDate).toLocaleDateString()}</p>
                <p><strong>Ngày hạn trả:</strong> {new Date(loan.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Trạng thái:</strong> {
                  loan.returnDate 
                    ? <span className="badge bg-success">Đã trả ngày {new Date(loan.returnDate).toLocaleDateString()}</span>
                    : loan.isOverdue
                      ? <span className="badge bg-danger">Quá hạn</span>
                      : <span className="badge bg-warning">Đang mượn</span>
                }</p>
                
                {loan.isOverdue && !loan.returnDate && (
                  <p className="text-danger">
                    <strong>Quá hạn:</strong> {
                      Math.ceil((new Date() - new Date(loan.dueDate)) / (1000 * 60 * 60 * 24))
                    } ngày
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3">
            {!loan.returnDate && (
              <button onClick={handleReturn} className="btn btn-success me-2">
                Trả sách
              </button>
            )}
            <Link to="/loans" className="btn btn-secondary">
              Quay lại
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;