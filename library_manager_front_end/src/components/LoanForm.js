// src/components/LoanForm.js - fixed version
import React, { useState, useEffect } from 'react';
import { getBooks, getReaders } from '../services/api';

const LoanForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    bookId: '',  // Initialize as empty string
    readerId: '', // Initialize as empty string
    dueDate: ''
  });
  const [books, setBooks] = useState([]);
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksData, readersData] = await Promise.all([
          getBooks(),
          getReaders()
        ]);
        
        // Filter available books
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
    console.log("books", books);
    console.log("readers", readers);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation errors when user makes changes
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.bookId) {
      errors.bookId = 'Vui lòng chọn sách';
    }
    if (!formData.readerId) {
      errors.readerId = 'Vui lòng chọn độc giả';
    }
    if (!formData.dueDate) {
      errors.dueDate = 'Vui lòng chọn ngày hạn trả';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Fix: Properly parse the IDs to integers, handling possible NaN values
    const bookIdInt = formData.bookId ? parseInt(formData.bookId, 10) : null;
    const readerIdInt = formData.readerId ? parseInt(formData.readerId, 10) : null;
    
    // Verify that the parsing was successful
    if (isNaN(bookIdInt) || isNaN(readerIdInt)) {
      setValidationErrors({
        ...validationErrors,
        bookId: isNaN(bookIdInt) ? 'ID sách không hợp lệ' : validationErrors.bookId,
        readerId: isNaN(readerIdInt) ? 'ID độc giả không hợp lệ' : validationErrors.readerId
      });
      return;
    }
    
    // Submit with properly parsed integer IDs

    console.log('Submitting loan data:', {
      bookId: bookIdInt,
      readerId: readerIdInt,
      dueDate: formData.dueDate
    });

    onSubmit({
      bookId: bookIdInt,
      readerId: readerIdInt,
      dueDate: formData.dueDate
    });
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
          className={`form-select ${validationErrors.bookId ? 'is-invalid' : ''}`}
          id="bookId"
          name="bookId"
          value={formData.bookId}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn sách --</option>
          {books.map(book => (
            <option key={book.id} value={book.id.toString()}>
              {book.title} - {book.author} (ISBN: {book.isbn})
            </option>
          ))}
        </select>
        {validationErrors.bookId && (
          <div className="invalid-feedback">{validationErrors.bookId}</div>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="readerId" className="form-label">Độc giả</label>
        <select
          className={`form-select ${validationErrors.readerId ? 'is-invalid' : ''}`}
          id="readerId"
          name="readerId"
          value={formData.readerId}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn độc giả --</option>
          {readers.map(reader => (
            <option key={reader.id} value={reader.id.toString()}>
              {reader.name} - {reader.email}
            </option>
          ))}
        </select>
        {validationErrors.readerId && (
          <div className="invalid-feedback">{validationErrors.readerId}</div>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="dueDate" className="form-label">Ngày hạn trả</label>
        <input
          type="date"
          className={`form-control ${validationErrors.dueDate ? 'is-invalid' : ''}`}
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
          min={new Date().toISOString().split('T')[0]}
        />
        {validationErrors.dueDate && (
          <div className="invalid-feedback">{validationErrors.dueDate}</div>
        )}
      </div>
      <button type="submit" className="btn btn-primary">Tạo phiếu mượn</button>
    </form>
  );
};

export default LoanForm;