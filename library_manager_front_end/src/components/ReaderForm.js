// src/components/ReaderForm.js
import React, { useState, useEffect } from 'react';

const ReaderForm = ({ reader, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    email: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (reader) {
      setFormData(reader);
    }
  }, [reader]);

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

  return (
    <form onSubmit={handleSubmit}>
      {isEditing && (
        <input type="hidden" name="id" value={formData.id} />
      )}
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Họ tên</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
        <input
          type="text"
          className="form-control"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        {isEditing ? 'Cập nhật' : 'Thêm mới'}
      </button>
    </form>
  );
};

export default ReaderForm;