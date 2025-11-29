import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react"; // Thêm icon ArrowLeft

// Hàm getImageUrl (cần cho trang này)
const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://dummyimage.com/600x600/cccccc/ffffff.png&text=No+Image";
  if (imagePath.startsWith("http")) return imagePath;
  const base = ""; // Proxy
  return `${base}${imagePath}`;
};

export default function Cart() {
  // Lấy dữ liệu và hàm từ CartContext qua hook useCart
  const { cartItems, cartTotal, cartCount, removeFromCart, updateQuantity, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4 md:p-8 lg:p-12">
      <div className="container mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-4xl font-extrabold text-emerald-800 md:text-5xl animate-fade-in-down">
          🛒 Giỏ hàng của bạn <span className="text-violet-600">({cartCount} sản phẩm)</span>
        </h1>

        {/* Trường hợp giỏ hàng trống */}
        {cartItems.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl md:p-16 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-200/50">
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-5521501-4610090.png" 
              alt="Giỏ hàng trống"
              className="mx-auto mb-8 h-48 w-48 object-contain animate-bounce-slow"
            />
            <p className="mb-8 text-2xl font-semibold text-gray-600">
              Oops\! Giỏ hàng của bạn đang trống rỗng. Hãy thêm một vài sản phẩm yêu thích vào giỏ nhé.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-emerald-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 transform animate-pulse-once"
            >
              <ArrowLeft size={24} /> Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          // Trường hợp giỏ hàng có sản phẩm
          <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-3 lg:gap-12">
            {/* Danh sách sản phẩm trong giỏ */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Ảnh sản phẩm */}
                  <Link to={`/product/${item._id}`} className="block flex-shrink-0 w-32 h-32">
                    <img
                      src={getImageUrl(item.images && item.images[0])}
                      alt={item.name}
                      className="aspect-square w-full h-full rounded-xl object-cover border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-200"
                    />
                  </Link>

                  {/* Thông tin sản phẩm */}
                  <div className="flex-1 text-center md:text-left">
                    <Link
                      to={`/product/${item._id}`}
                      className="block text-xl font-bold text-gray-800 hover:text-violet-700 transition-colors duration-200 line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-2 text-2xl font-extrabold text-emerald-600">
                      {item.price.toLocaleString("vi-VN")} ₫
                    </p>
                    <p className="mt-1 text-sm text-gray-500 italic">
                      Tổng phụ: {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 mt-4 md:mt-0">
                    {/* Quantity Input */}
                    <div className="flex items-center rounded-full border-2 border-emerald-300 bg-emerald-50 overflow-hidden shadow-sm">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-3 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-l-full"
                        disabled={item.quantity <= 1}
                        aria-label="Giảm số lượng"
                      >
                        <Minus size={20} strokeWidth={2.5} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                        className="w-16 text-center text-lg font-semibold text-gray-800 bg-transparent focus:outline-none focus:ring-0 appearance-none [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                        aria-label={`Số lượng cho ${item.name}`}
                      />
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-3 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-r-full"
                        // disabled={item.quantity >= item.stock} // Nếu có thông tin về số lượng tồn kho
                        aria-label="Tăng số lượng"
                      >
                        <Plus size={20} strokeWidth={2.5} />
                      </button>
                    </div>
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                      title="Xóa sản phẩm khỏi giỏ hàng"
                      aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                    >
                      <Trash2 size={22} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))}
              {/* Nút xóa tất cả */}
              <div className="p-4 text-center md:text-right">
                <button
                  onClick={clearCart}
                  className="inline-flex items-center gap-2 text-base font-medium text-red-500 hover:text-red-700 hover:underline transition-colors duration-200 group"
                >
                  <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                  Xóa tất cả sản phẩm khỏi giỏ
                </button>
              </div>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="sticky top-24 rounded-3xl bg-white p-8 shadow-xl border border-emerald-100 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-200/50">
              <h2 className="mb-6 border-b-2 border-emerald-200 pb-4 text-3xl font-bold text-emerald-800">
                Tóm tắt đơn hàng 📝
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg text-gray-700">
                  <span className="font-semibold">Tạm tính ({cartCount} sản phẩm)</span>
                  <span className="font-bold text-gray-800">{cartTotal.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between items-center text-lg text-gray-700">
                  <span className="font-semibold">Phí vận chuyển</span>
                  <span className="font-bold text-green-600">Miễn phí 🎉</span>
                </div>
                <div className="border-t-2 border-dashed border-emerald-300 pt-6 mt-6 flex justify-between items-center text-2xl font-extrabold text-gray-900">
                  <span>Tổng cộng</span>
                  <span className="text-violet-700 animate-pulse">{cartTotal.toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>
              {/* Nút Thanh toán */}
              <Link
                to="/checkout"
                className="mt-8 block w-full rounded-full bg-violet-600 py-4 text-center text-xl font-bold text-white shadow-lg transition-all duration-300 hover:bg-violet-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-violet-300 transform animate-bounce-slowest"
              >
                Tiến hành thanh toán ngay <ShoppingCart size={24} className="inline-block ml-2" />
              </Link>
              <Link
                to="/"
                className="mt-4 block w-full text-center text-base font-medium text-emerald-600 hover:text-emerald-800 hover:underline transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} /> Hoặc tiếp tục mua sắm
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}