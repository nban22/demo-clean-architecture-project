// src/pages/BookDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBookById, deleteBook } from '../services/api';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
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

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cuốn sách này?')) {
      try {
        await deleteBook(parseInt(id));
        navigate('/books');
      } catch (err) {
        setError('Lỗi khi xóa sách. Vui lòng thử lại sau.');
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

  if (!book) {
    return <div className="alert alert-warning">Không tìm thấy sách</div>;
  }

  return (
    <div className="container">
      <h2 className="mb-4">Chi tiết sách</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{book.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">Tác giả: {book.author}</h6>
          <div className="card-text">
            <p><strong>ISBN:</strong> {book.isbn}</p>
            <p><strong>Năm xuất bản:</strong> {book.publicationYear}</p>
            <p>
              <strong>Trạng thái:</strong>{' '}
              <span className={`badge ${book.isAvailable ? 'bg-success' : 'bg-danger'}`}>
                {book.isAvailable ? 'Có sẵn' : 'Đã mượn'}
              </span>
            </p>
          </div>
          <div className="mt-3">
            <Link to={`/books/edit/${book.id}`} className="btn btn-warning me-2">
              Sửa
            </Link>
            <button onClick={handleDelete} className="btn btn-danger me-2">
              Xóa
            </button>
            <Link to="/books" className="btn btn-secondary">
              Quay lại
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;