// src/components/BookForm.js
import React, { useState, useEffect } from 'react';

const BookForm = ({ book, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    id: 0,
    isbn: '',
    title: '',
    author: '',
    publicationYear: new Date().getFullYear(),
    isAvailable: true
  });

  useEffect(() => {
    if (book) {
      setFormData(book);
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {isEditing && (
        <input type="hidden" name="id" value={formData.id} />
      )}
      <div className="mb-3">
        <label htmlFor="isbn" className="form-label">ISBN</label>
        <input
          type="text"
          className="form-control"
          id="isbn"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          required
          disabled={isEditing}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Tiêu đề</label>
        <input
          type="text"
          className="form-control"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="author" className="form-label">Tác giả</label>
        <input
          type="text"
          className="form-control"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="publicationYear" className="form-label">Năm xuất bản</label>
        <input
          type="number"
          className="form-control"
          id="publicationYear"
          name="publicationYear"
          value={formData.publicationYear}
          onChange={handleChange}
          required
          min="1000"
          max="2100"
        />
      </div>
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="isAvailable"
          name="isAvailable"
          checked={formData.isAvailable}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="isAvailable">Có sẵn để mượn</label>
      </div>
      <button type="submit" className="btn btn-primary">
        {isEditing ? 'Cập nhật' : 'Thêm mới'}
      </button>
    </form>
  );
};

export default BookForm;