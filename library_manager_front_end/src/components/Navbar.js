// src/components/Navbar.js (cập nhật)
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Quản lý Thư viện</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Trang chủ</Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Sách
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/books">Danh sách sách</Link></li>
                <li><Link className="dropdown-item" to="/books/create">Thêm sách mới</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Độc giả
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/readers">Danh sách độc giả</Link></li>
                <li><Link className="dropdown-item" to="/readers/create">Thêm độc giả mới</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Phiếu mượn
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/loans">Tất cả phiếu mượn</Link></li>
                <li><Link className="dropdown-item" to="/loans/active">Phiếu mượn đang hoạt động</Link></li>
                <li><Link className="dropdown-item" to="/loans/create">Tạo phiếu mượn mới</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;