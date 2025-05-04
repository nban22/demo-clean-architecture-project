// src/pages/CreateReader.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReaderForm from '../components/ReaderForm';
import { createReader } from '../services/api';

const CreateReader = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (readerData) => {
    try {
      await createReader(readerData);
      navigate('/readers');
    } catch (err) {
      setError('Lỗi khi tạo độc giả mới. Vui lòng thử lại.');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Thêm độc giả mới</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card">
        <div className="card-body">
          <ReaderForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CreateReader;