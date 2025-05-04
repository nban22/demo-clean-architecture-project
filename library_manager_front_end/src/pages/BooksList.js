// src/pages/BooksList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, deleteBook } from '../services/api';
import BookItem from '../components/BookItem';

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError('Lỗi khi tải danh sách sách. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cuốn sách này?')) {
      try {
        await deleteBook(id);
        setBooks(books.filter(book => book.id !== id));
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

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Danh sách sách</h2>
        <Link to="/books/create" className="btn btn-primary">
          Thêm sách mới
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {books.length === 0 ? (
        <div className="alert alert-info">
          Không có sách nào trong thư viện. Hãy thêm sách mới!
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ISBN</th>
                <th>Tiêu đề</th>
                <th>Tác giả</th>
                <th>Năm xuất bản</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <BookItem 
                  key={book.id} 
                  book={book} 
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

export default BooksList;