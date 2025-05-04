// src/pages/BookEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookForm from '../components/BookForm';
import { getBookById, updateBook } from '../services/api';

const BookEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookById(parseInt(id));
        setBook(data);
      } catch (err) {
        setError('Không thể tải thông tin sách. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleSubmit = async (bookData) => {
    try {
      await updateBook(parseInt(id), bookData);
      navigate(`/books/${id}`);
    } catch (err) {
      setError('Lỗi khi cập nhật sách. Vui lòng thử lại.');
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

  if (!book) {
    return <div className="alert alert-warning">Không tìm thấy sách</div>;
  }

  return (
    <div className="container">
      <h2 className="mb-4">Chỉnh sửa sách</h2>
      <div className="card">
        <div className="card-body">
          <BookForm book={book} onSubmit={handleSubmit} isEditing={true} />
        </div>
      </div>
    </div>
  );
};

export default BookEdit;