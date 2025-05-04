// src/components/LoanForm.js
import React, { useState, useEffect } from 'react';
import { getBooks, getReaders } from '../services/api';

const LoanForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    bookId: '',
    readerId: '',
    dueDate: ''
  });
  const [books, setBooks] = useState([]);
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksData, readersData] = await Promise.all([
          getBooks(),
          getReaders()
        ]);
        
        // Lọc sách có sẵn
        const availableBooks = booksData.filter(book => book.isAvailable);
        
        setBooks(availableBooks);
        setReaders(readersData);
        
        // Set default due date (14 days from now)
        const defaultDueDate = new Date();
        defaultDueDate.setDate(defaultDueDate.getDate() + 14);
        setFormData(prev => ({ 
          ...prev, 
          dueDate: defaultDueDate.toISOString().split('T')[0]
        }));

        setError(null);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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

  if (books.length === 0) {
    return <div className="alert alert-warning">Không có sách nào có sẵn để cho mượn.</div>;
  }

  if (readers.length === 0) {
    return <div className="alert alert-warning">Không có độc giả nào trong hệ thống.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="bookId" className="form-label">Sách</label>
        <select
          className="form-select"
          id="bookId"
          name="bookId"
          value={formData.bookId}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn sách --</option>
          {books.map(book => (
            <option key={book.id} value={book.id}>
              {book.title} - {book.author} (ISBN: {book.isbn})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="readerId" className="form-label">Độc giả</label>
        <select
          className="form-select"
          id="readerId"
          name="readerId"
          value={formData.readerId}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn độc giả --</option>
          {readers.map(reader => (
            <option key={reader.id} value={reader.id}>
              {reader.name} - {reader.email}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="dueDate" className="form-label">Ngày hạn trả</label>
        <input
          type="date"
          className="form-control"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <button type="submit" className="btn btn-primary">Tạo phiếu mượn</button>
    </form>
  );
};

export default LoanForm;