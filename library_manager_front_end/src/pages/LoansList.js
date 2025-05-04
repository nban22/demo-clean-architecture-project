// src/pages/LoansList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLoans, returnBook } from '../services/api';
import LoanItem from '../components/LoanItem';

const LoansList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const data = await getLoans();
      setLoans(data);
      setError(null);
    } catch (err) {
      setError('Lỗi khi tải danh sách phiếu mượn. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleReturn = async (id) => {
    if (window.confirm('Xác nhận trả sách?')) {
      try {
        await returnBook(id);
        // Cập nhật lại danh sách phiếu mượn
        fetchLoans();
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

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Danh sách phiếu mượn</h2>
        <Link to="/loans/create" className="btn btn-primary">
          Tạo phiếu mượn mới
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loans.length === 0 ? (
        <div className="alert alert-info">
          Không có phiếu mượn nào trong hệ thống.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Sách</th>
                <th>Độc giả</th>
                <th>Ngày mượn</th>
                <th>Ngày hạn trả</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(loan => (
                <LoanItem 
                  key={loan.id} 
                  loan={loan} 
                  onReturn={handleReturn} 
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoansList;