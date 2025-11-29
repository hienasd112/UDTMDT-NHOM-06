import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiLogin } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 1. Gọi API đăng nhập
      const userData = await apiLogin({ email, password });

      // 2. Cập nhật state toàn cục (thông tin user)
      login(userData);

      // --- 3. ĐIỀU HƯỚNG DỰA TRÊN ROLE ---
      if (userData && userData.role === 'admin') {
        // Nếu là admin, chuyển đến trang quản lý sản phẩm
        navigate("/admin/products");
      } else {
        // Nếu là user thường, chuyển về trang chủ
        navigate("/");
      }

    } catch (err) {
      // Hiển thị lỗi từ API (ví dụ: Sai mật khẩu)
      setError(err.message || "Email hoặc mật khẩu không đúng.");
      console.error("Lỗi đăng nhập:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Container chính với màu sắc và đổ bóng đẹp hơn */}
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-2xl transition duration-500 hover:shadow-emerald-300/50">
        <h2 className="text-center text-4xl font-extrabold text-violet-700">
          🔑 Đăng nhập
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Hiển thị lỗi */}
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200 animate-pulse">
              {error}
            </p>
          )}

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
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              // Tinh chỉnh input: bo góc, đổ bóng nhẹ, focus màu xanh ngọc
              className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 transition duration-150 shadow-sm"
              placeholder="admin@gmail.com"
            />
          </div>

          {/* Input Mật khẩu */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              🔒 Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              // Tinh chỉnh input
              className="appearance-none relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 transition duration-150 shadow-sm"
              placeholder="123123"
            />
          </div>

          {/* Nút Đăng nhập */}
          <div>
            <button
              type="submit"
              disabled={loading}
              // Nút nổi bật: màu xanh ngọc, đổ bóng, hiệu ứng hover
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-70 transition duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-400/50"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </div>
        </form>

        {/* Link tới trang Đăng ký */}
        <p className="text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-extrabold text-violet-600 hover:text-violet-700 hover:underline transition duration-150"
          >
            Đăng ký ngay 🚀
          </Link>
        </p>
      </div>
    </div>
  );
}