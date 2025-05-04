// src/pages/Home.js (cập nhật)
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <div className="text-center my-5">
        <h1>Hệ thống Quản lý Thư viện</h1>
        <p className="lead">Ứng dụng quản lý sách, độc giả và các hoạt động mượn/trả sách</p>
      </div>

      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">Quản lý Sách</h3>
              <p className="card-text">Thêm, sửa, xóa và xem danh sách sách trong thư viện</p>
              <div className="d-grid gap-2">
                <Link to="/books" className="btn btn-primary">
                  Xem danh sách sách
                </Link>
                <Link to="/books/create" className="btn btn-outline-primary">
                  Thêm sách mới
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">Quản lý Độc giả</h3>
              <p className="card-text">Thêm, sửa, xóa và xem danh sách độc giả</p>
              <div className="d-grid gap-2">
                <Link to="/readers" className="btn btn-success">
                  Xem danh sách độc giả
                </Link>
                <Link to="/readers/create" className="btn btn-outline-success">
                  Thêm độc giả mới
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">Quản lý Mượn/Trả</h3>
              <p className="card-text">Tạo phiếu mượn mới và quản lý việc trả sách</p>
              <div className="d-grid gap-2">
                <Link to="/loans" className="btn btn-info">
                  Xem tất cả phiếu mượn
                </Link>
                <Link to="/loans/active" className="btn btn-warning">
                  Phiếu mượn đang hoạt động
                </Link>
                <Link to="/loans/create" className="btn btn-outline-info">
                  Tạo phiếu mượn mới
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;