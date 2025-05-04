// src/components/BookItem.js
import React from 'react';
import { Link } from 'react-router-dom';

const BookItem = ({ book, onDelete }) => {
  return (
    <tr>
      <td>{book.isbn}</td>
      <td>{book.title}</td>
      <td>{book.author}</td>
      <td>{book.publicationYear}</td>
      <td>{book.isAvailable ? 'Có sẵn' : 'Đã mượn'}</td>
      <td>
        <Link to={`/books/${book.id}`} className="btn btn-info btn-sm me-2">
          Chi tiết
        </Link>
        <Link to={`/books/edit/${book.id}`} className="btn btn-warning btn-sm me-2">
          Sửa
        </Link>
        <button 
          onClick={() => onDelete(book.id)} 
          className="btn btn-danger btn-sm"
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default BookItem;