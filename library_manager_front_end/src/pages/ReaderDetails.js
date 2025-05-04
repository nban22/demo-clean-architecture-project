// src/pages/ReaderDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getReaderById, deleteReader } from '../services/api';

const ReaderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reader, setReader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReader = async () => {
      try {
        setLoading(true);
        const data = await getReaderById(parseInt(id));
        setReader(data);
      } catch (err) {
        setError('Không thể tải thông tin độc giả. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReader();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa độc giả này?')) {
      try {
        await deleteReader(parseInt(id));
        navigate('/readers');
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

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!reader) {
    return <div className="alert alert-warning">Không tìm thấy độc giả</div>;
  }

  return (
    <div className="container">
      <h2 className="mb-4">Chi tiết độc giả</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{reader.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">Email: {reader.email}</h6>
          <div className="card-text">
            <p><strong>Số điện thoại:</strong> {reader.phoneNumber || 'Chưa cung cấp'}</p>
            <p><strong>Ngày đăng ký:</strong> {new Date(reader.membershipDate).toLocaleDateString()}</p>
          </div>
          <div className="mt-3">
            <Link to={`/readers/edit/${reader.id}`} className="btn btn-warning me-2">
              Sửa
            </Link>
            <button onClick={handleDelete} className="btn btn-danger me-2">
              Xóa
            </button>
            <Link to="/readers" className="btn btn-secondary">
              Quay lại
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderDetails;