import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Truck, ShieldCheck, Clock, Star, ShoppingBag, Zap, Award, Gift } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

// --- Helper: Format tiền tệ ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function Home() {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  // Lấy sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        
        // Kiểm tra dữ liệu an toàn
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        setProducts([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 4. Hàm xử lý khi nhấn nút Thêm vào giỏ
  const handleAddToCart = (e, product) => {
    e.preventDefault(); 
    if (product.stock === 0) {
        toast.error("Sản phẩm này đã hết hàng!");
        return;
    }
    addToCart(product, 1); 
    toast.success(`Đã thêm "${product.name}" vào giỏ!`);
  };

  // Lọc sản phẩm
  const listToRender = Array.isArray(products) ? products : [];
  const newArrivals = listToRender.slice(0, 8); 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* ================= 1. HERO BANNER ================= */}
      <section className="relative bg-gray-900 text-white overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0">
           <img 
             src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2000&auto=format&fit=crop" 
             alt="Luxury Watch Background"
             className="w-full h-full object-cover opacity-30"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-left space-y-6 pt-10 md:pt-0 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-amber-400 font-bold text-sm tracking-wider uppercase">
              <Award size={16} /> New Collection 2025
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-xl">
              Đẳng Cấp <br/> <span className="text-amber-400">Quý Ông</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-lg mx-auto md:mx-0 font-light leading-relaxed">
              Tuyệt tác thời gian từ những thương hiệu hàng đầu thế giới. Nâng tầm vị thế của bạn ngay hôm nay.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-amber-500/30 transform hover:-translate-y-1 transition-all border border-transparent">
                Mua Sắm Ngay <ArrowRight size={20} />
              </Link>
              <Link to="/products?brand=Rolex" className="inline-flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                Xem Rolex
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/20 rounded-full blur-[80px]"></div>
            <img 
              src="https://pngimg.com/d/watches_PNG9868.png" 
              alt="Luxury Watch" 
              className="relative w-[400px] h-[400px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 z-10"
            />
          </div>
        </div>
      </section>

      {/* ================= 2. DỊCH VỤ ================= */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-emerald-50 border border-emerald-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shrink-0"> <ShieldCheck size={28} /> </div>
              <div> <h3 className="text-lg font-bold text-gray-800">100% Chính Hãng</h3> <p className="text-gray-600 text-sm mt-1">Đền gấp 10 lần nếu phát hiện hàng giả.</p> </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-blue-50 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shrink-0"> <Truck size={28} /> </div>
              <div> <h3 className="text-lg font-bold text-gray-800">Miễn Phí Vận Chuyển</h3> <p className="text-gray-600 text-sm mt-1">Giao hàng hỏa tốc toàn quốc.</p> </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-amber-50 border border-amber-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg shrink-0"> <Gift size={28} /> </div>
              <div> <h3 className="text-lg font-bold text-gray-800">Quà Tặng Hấp Dẫn</h3> <p className="text-gray-600 text-sm mt-1">Tặng dây da và gói bảo hành 5 năm.</p> </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. SẢN PHẨM MỚI (GRID) ================= */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hàng Mới Về</h2>
            <div className="w-20 h-1.5 bg-emerald-600 mx-auto rounded-full"></div>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Cập nhật những mẫu đồng hồ mới nhất, dẫn đầu xu hướng thời trang năm nay.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <div key={product._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 relative flex flex-col h-full">
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-10">
                     {product.stock === 0 ? (
                        <span className="bg-gray-800 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">HẾT HÀNG</span>
                     ) : (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <Zap size={10} fill="currentColor" /> NEW
                        </span>
                     )}
                  </div>

                  {/* Image (XỬ LÝ ĐÚNG LOGIC LINK ẢNH) */}
                  <Link to={`/product/${product._id}`} className="block relative h-72 overflow-hidden bg-white p-4 flex items-center justify-center">
                    <img 
                      // 1. Ưu tiên product.image
                      // 2. Nếu không có, thử lấy phần tử đầu của product.images
                      // 3. Nếu không có, dùng ảnh placeholder
                      src={product.image || (product.images && product.images[0]) || 'https://placehold.co/400x400/e0e0e0/888888.png?text=Watch'} 
                      
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                      
                      // Nếu link ảnh bị lỗi (chết link), thay bằng placeholder
                      onError={(e) => { e.target.src = "https://placehold.co/400x400/e0e0e0/888888.png?text=No+Image"; }}
                    />
                    
                    {/* Hover Button */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                       <span className="bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform text-sm">
                         Xem Chi Tiết
                       </span>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">{product.category?.name || 'WatchStore'}</p>
                    <Link to={`/product/${product._id}`} className="flex-grow">
                      <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                      <span className="text-xs text-gray-400 ml-1">(5.0)</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-lg font-extrabold text-emerald-700">
                        {formatCurrency(product.price)}
                      </span>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.stock === 0}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
                            product.stock === 0 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-gray-100 text-gray-600 hover:bg-emerald-600 hover:text-white'
                        }`}
                        title="Thêm vào giỏ hàng"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
                <p className="text-lg">Đang cập nhật sản phẩm...</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
             <Link to="/products" className="inline-block border-2 border-emerald-600 text-emerald-600 px-10 py-3 rounded-full font-bold hover:bg-emerald-600 hover:text-white transition-all uppercase tracking-wider text-sm">
               Xem Tất Cả Sản Phẩm
             </Link>
          </div>
        </div>
      </section>

      {/* ================= 4. BANNER QUẢNG CÁO ================= */}
      <section className="py-24 relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
           <img src="https://images.unsplash.com/photo-1619134778706-c73105206560?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="Banner" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-amber-400 font-bold tracking-[0.3em] uppercase mb-4 block text-sm">Limited Edition</span>
          <h2 className="text-3xl md:text-5xl font-black mb-6 drop-shadow-lg">ĐỒNG HỒ CƠ CAO CẤP</h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto drop-shadow-md">
            Sở hữu ngay những tuyệt tác cơ khí với thiết kế lộ máy độc đáo. Số lượng có hạn.
          </p>
          <Link to="/products?category=Automatic" className="inline-block bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-amber-400 hover:text-gray-900 transition-all shadow-xl hover:shadow-amber-400/50 transform hover:-translate-y-1">
            Khám Phá Ngay
          </Link>
        </div>
      </section>

      {/* ================= 5. THƯƠNG HIỆU ================= */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-400 text-sm font-bold tracking-widest uppercase mb-10">Đối tác phân phối chính hãng</p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['ROLEX', 'OMEGA', 'SEIKO', 'CASIO', 'TISSOT'].map((brand) => (
              <h3 key={brand} className="text-2xl md:text-4xl font-black text-gray-300 hover:text-emerald-800 cursor-pointer transition-colors select-none">
                {brand}
              </h3>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}