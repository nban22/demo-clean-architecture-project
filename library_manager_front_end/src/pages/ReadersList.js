// src/pages/ReadersList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReaders, deleteReader } from '../services/api';
import ReaderItem from '../components/ReaderItem';

const ReadersList = () => {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReaders = async () => {
    try {
      setLoading(true);
      const data = await getReaders();
      setReaders(data);
      setError(null);
    } catch (err) {
      setError('Lỗi khi tải danh sách độc giả. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReaders();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa độc giả này?')) {
      try {
        await deleteReader(id);
        setReaders(readers.filter(reader => reader.id !== id));
      } catch (err) {
        setError('Lỗi khi xóa độc giả. Vui lòng thử lại sau.');
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
        <h2>Danh sách độc giả</h2>
        <Link to="/readers/create" className="btn btn-primary">
          Thêm độc giả mới
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {readers.length === 0 ? (
        <div className="alert alert-info">
          Không có độc giả nào trong hệ thống. Hãy thêm độc giả mới!
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Ngày đăng ký</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {readers.map(reader => (
                <ReaderItem 
                  key={reader.id} 
                  reader={reader} 
                  onDelete={handleDelete} 
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReadersList;