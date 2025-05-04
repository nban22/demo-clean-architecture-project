// src/pages/CreateBook.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookForm from '../components/BookForm';
import { createBook } from '../services/api';

const CreateBook = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (bookData) => {
    try {
      await createBook(bookData);
      navigate('/books');
    } catch (err) {
      setError('Lỗi khi tạo sách mới. Vui lòng thử lại.');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Thêm sách mới</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card">
        <div className="card-body">
          <BookForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CreateBook;