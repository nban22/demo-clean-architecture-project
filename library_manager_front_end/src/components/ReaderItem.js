// src/components/ReaderItem.js
import React from 'react';
import { Link } from 'react-router-dom';

const ReaderItem = ({ reader, onDelete }) => {
  return (
    <tr>
      <td>{reader.name}</td>
      <td>{reader.email}</td>
      <td>{reader.phoneNumber}</td>
      <td>{new Date(reader.membershipDate).toLocaleDateString()}</td>
      <td>
        <Link to={`/readers/${reader.id}`} className="btn btn-info btn-sm me-2">
          Chi tiết
        </Link>
        <Link to={`/readers/edit/${reader.id}`} className="btn btn-warning btn-sm me-2">
          Sửa
        </Link>
        <button 
          onClick={() => onDelete(reader.id)} 
          className="btn btn-danger btn-sm"
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default ReaderItem;