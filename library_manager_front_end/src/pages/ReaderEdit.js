// src/pages/ReaderEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReaderForm from '../components/ReaderForm';
import { getReaderById, updateReader } from '../services/api';

const ReaderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reader, setReader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReader = async () => {
      try {
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

  const handleSubmit = async (readerData) => {
    try {
      await updateReader(parseInt(id), readerData);
      navigate(`/readers/${id}`);
    } catch (err) {
      setError('Lỗi khi cập nhật độc giả. Vui lòng thử lại.');
      console.error(err);
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
      <h2 className="mb-4">Chỉnh sửa độc giả</h2>
      <div className="card">
        <div className="card-body">
          <ReaderForm reader={reader} onSubmit={handleSubmit} isEditing={true} />
        </div>
      </div>
    </div>
  );
};

export default ReaderEdit;