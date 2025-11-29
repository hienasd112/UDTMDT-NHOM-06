import React from 'react';

// Sử dụng thẻ <a> thay vì <Link> để tránh lỗi "missing Router context" 
// khi component này được render độc lập hoặc thiếu BrowserRouter bao bọc.
// import { Link } from 'react-router-dom'; 

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-gray-800 text-gray-300">
      {/* Container: Grid 3 cột */}
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3 lg:px-8">
        
        {/* Cột 1: Thông tin thương hiệu */}
        <div className="flex flex-col">
          <h4 className="mb-4 text-2xl font-bold text-white tracking-wide">WatchStore</h4>
          <p className="text-sm leading-relaxed max-w-xs">
            Chuyên cung cấp đồng hồ chính hãng từ các thương hiệu hàng đầu thế giới. 
            Cam kết chất lượng và sự hài lòng tuyệt đối cho khách hàng.
          </p>
        </div>

        {/* Cột 2: Liên kết Mua sắm */}
        <div>
          <h5 className="mb-4 text-lg font-semibold text-white border-b border-gray-600 pb-2 inline-block">
            Mua sắm
          </h5>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="/" className="transition hover:text-emerald-400 hover:translate-x-1 inline-block">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="/products" className="transition hover:text-emerald-400 hover:translate-x-1 inline-block">
                Tất cả sản phẩm
              </a>
            </li>
            <li>
              <a href="/products?movement=Automatic" className="transition hover:text-emerald-400 hover:translate-x-1 inline-block">
                Đồng hồ Automatic
              </a>
            </li>
            <li>
              <a href="/products?brand=G-Shock" className="transition hover:text-emerald-400 hover:translate-x-1 inline-block">
                Thương hiệu G-Shock
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Liên kết Hỗ trợ */}
        <div>
          <h5 className="mb-4 text-lg font-semibold text-white border-b border-gray-600 pb-2 inline-block">
            Hỗ trợ khách hàng
          </h5>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="/contact" className="transition hover:text-emerald-400 hover:translate-x-1 inline-block">
                Liên hệ & Góp ý
              </a>
            </li>
            <li>
              <a href="/faq" className="transition hover:text-emerald-400 hover:translate-x-1 inline-block">
                Câu hỏi thường gặp
              </a>
            </li>
            <li>
              <a href="/policy/warranty" className="transition hover:text-emerald-400 hover:translate-x-1 inline-block">
                Chính sách bảo hành
              </a>
            </li>
            <li>
              <a href="/policy/return" className="transition hover:text-emerald-400 hover:translate-x-1 inline-block">
                Chính sách đổi trả
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="bg-gray-900 py-6 text-center border-t border-gray-700">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {currentYear} WatchStore. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}