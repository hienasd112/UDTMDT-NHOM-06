import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiRegister } from "../services/auth";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation cơ bản
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 1. Gọi API đăng ký
      const userData = await apiRegister({ fullName, email, password });

      // 2. Cập nhật state toàn cục (tự động login)
      login(userData);

      // 3. Điều hướng về trang chủ
      navigate("/");

    } catch (err) {
      // Hiển thị lỗi từ API (ví dụ: email đã tồn tại)
      setError(err.message || "Đã xảy ra lỗi trong quá trình đăng ký.");
      console.error("Lỗi đăng ký:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Container chính với màu sắc và đổ bóng đẹp hơn */}
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-2xl transition duration-500 hover:shadow-teal-300/50">
        <h2 className="text-center text-4xl font-extrabold text-emerald-700">
          ✨ Tạo tài khoản mới
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Hiển thị lỗi */}
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200 animate-pulse">
              {error}
            </p>
          )}

          {/* Input Họ tên */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              👤 Họ và tên
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              // Tinh chỉnh input: bo góc, đổ bóng nhẹ, focus màu xanh ngọc
              className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 transition duration-150 shadow-sm"
              placeholder="Nguyễn Văn A"
            />
          </div>

          {/* Input Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              📧 Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              // Tinh chỉnh input
              className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 transition duration-150 shadow-sm"
              placeholder="ban@email.com"
            />
          </div>

          {/* Input Mật khẩu */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              🔒 Mật khẩu (ít nhất 6 ký tự)
            </label>
            <input
              id="password"
              type="password"
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              // Tinh chỉnh input
              className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 transition duration-150 shadow-sm"
              placeholder="••••••••"
            />
          </div>

          {/* Input Xác nhận Mật khẩu */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              ✅ Xác nhận mật khẩu
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              // Tinh chỉnh input
              className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 transition duration-150 shadow-sm"
              placeholder="••••••••"
            />
          </div>

          {/* Nút Đăng ký */}
          <div>
            <button
              type="submit"
              disabled={loading}
              // Nút nổi bật: màu xanh ngọc, đổ bóng, hiệu ứng hover
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-70 transition duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-400/50"
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </div>
        </form>

        {/* Link tới trang Đăng nhập */}
        <p className="text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-extrabold text-violet-600 hover:text-violet-700 hover:underline transition duration-150"
          >
            Đăng nhập ngay 👈
          </Link>
        </p>
      </div>
    </div>
  );
}