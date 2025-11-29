import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* --- PHẦN 1: HERO BANNER (Tiêu đề) --- */}
      <div className="bg-emerald-700 py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Liên hệ với WatchStore</h1>
        <p className="text-lg text-emerald-100 max-w-2xl mx-auto px-4">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy ghé thăm cửa hàng hoặc liên hệ qua các kênh trực tuyến.
        </p>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-10">
        
        {/* --- PHẦN 2: CÁC THẺ THÔNG TIN (GRID) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Thẻ Địa chỉ */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Địa chỉ cửa hàng</h3>
            <p className="text-gray-600">
              87 Bùi Quang Là,<br />
              Quận Gò Vấp, TP. Hồ Chí Minh
            </p>
          </div>

          {/* Thẻ Hotline */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hotline hỗ trợ</h3>
            <p className="text-gray-600 mb-1">Mua hàng: <span className="font-semibold text-gray-800">0364389055</span></p>
            <p className="text-gray-600">Khiếu nại: <span className="font-semibold text-gray-800">0364389055</span></p>
          </div>

          {/* Thẻ Email */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Email liên hệ</h3>
            <p className="text-gray-600">support@watchstore.vn</p>
            <p className="text-gray-600">sales@watchstore.vn</p>
          </div>

          {/* Thẻ Giờ làm việc */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Giờ mở cửa</h3>
            <p className="text-gray-600">T2 - T6: 8:00 - 21:00</p>
            <p className="text-gray-600">T7 - CN: 9:00 - 22:00</p>
          </div>
        </div>

        {/* --- PHẦN 3: BẢN ĐỒ & MẠNG XÃ HỘI --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          
          {/* Cột Trái: Thông tin thêm & Mạng xã hội */}
          <div className="lg:col-span-1 space-y-8">
            {/* Box Mạng xã hội */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Kết nối với chúng tôi</h3>
              <div className="space-y-4">
                <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition">
                  <Facebook size={24} /> <span>Fanpage WatchStore</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-pink-600 transition">
                  <Instagram size={24} /> <span>@watchstore.official</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition">
                  <MessageCircle size={24} /> <span>Zalo Official</span>
                </a>
              </div>
            </div>

            {/* Box Câu hỏi thường gặp (Thay thế cho Form) */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Câu hỏi thường gặp</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Chính sách bảo hành đồng hồ ra sao?</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Tôi có thể đổi trả hàng trong bao lâu?</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Cửa hàng có hỗ trợ trả góp không?</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Cột Phải: Bản đồ (Chiếm 2/3) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-[400px] lg:h-auto">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.669658423711!2d106.66488007465863!3d10.75992005949503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f9023a3a85d%3A0x96d9b7990433e0e9!2zTmjDoCBiw6FuIGjDoG5n!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;