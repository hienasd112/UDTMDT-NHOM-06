import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { 
    CreditCard, Smartphone, Banknote, ArrowLeft, AlertCircle, 
    ShieldAlert, Tag, CheckCircle, MapPin, User, Phone, 
    Gift, CornerDownRight, Loader, XCircle, ArrowRight
} from 'lucide-react';

// --- Component Spinner  ---
const SpinnerIcon = ({ color = 'text-white' }) => (
  <svg className={`animate-spin h-5 w-5 ${color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// --- Component Coupon List  ---
const CouponList = ({ availableCoupons, onApplyCoupon, couponLoading, appliedCoupon }) => {
    // State để mở/đóng danh sách coupon
    const [isOpen, setIsOpen] = useState(false);

    if (availableCoupons.length === 0) return null; 

    return (
        <div className="mt-4 border-t border-emerald-100 pt-4">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-sm font-extrabold text-emerald-600 hover:text-emerald-800 transition py-2"
            >
                <span className="flex items-center gap-2">
                    <Gift size={18} className="text-amber-500" /> KHO ƯU ĐÃI CỦA BẠN ({availableCoupons.length})
                </span>
                <ArrowRight size={16} className={`text-emerald-500 transform transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
            </button>

            {isOpen && (
                <div className="mt-3 space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {availableCoupons.map((coupon) => (
                        <div key={coupon.code} className={`p-4 rounded-xl flex justify-between items-center border transition duration-300 ${
                            appliedCoupon?.code === coupon.code 
                                ? 'bg-green-100 border-green-500 opacity-90 shadow-inner' 
                                : 'bg-white border-gray-200 hover:shadow-lg hover:border-emerald-300'
                        }`}>
                            <div className="flex flex-col">
                                <span className={`font-black text-base ${appliedCoupon?.code === coupon.code ? 'text-green-800' : 'text-emerald-700'}`}>{coupon.code}</span>
                                <span className="text-xs text-gray-600 mt-1">
                                    Giảm **{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : coupon.discountAmount.toLocaleString('vi-VN') + ' ₫'}** cho đơn hàng từ **{coupon.minPurchase.toLocaleString('vi-VN')} ₫**
                                </span>
                            </div>
                            {appliedCoupon?.code === coupon.code ? (
                                <span className="text-xs font-bold text-green-700 flex items-center gap-1 bg-green-200 px-2 py-1 rounded-full">
                                    <CheckCircle size={14} /> ĐÃ DÙNG
                                </span>
                            ) : (
                                <button 
                                    // Gọi hàm áp dụng mã với code của coupon này
                                    onClick={() => onApplyCoupon(coupon.code)}
                                    disabled={couponLoading}
                                    className="text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-full shadow-md transition disabled:opacity-50 flex items-center"
                                >
                                    {couponLoading ? <Loader size={14} className="animate-spin" /> : 'Sử dụng'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            {/* Thêm CSS cho scrollbar (cần thêm vào CSS chung của app nếu dùng Tailwind) */}
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f3f4f6; }
            `}</style>
        </div>
    );
};


// --- Component Chính CheckoutPage ---
export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State cho form
  const [shippingInfo, setShippingInfo] = useState({ fullName: '', phone: '', address: '' });
  const [selectedPayment, setSelectedPayment] = useState('');
  const [processing, setProcessing] = useState(false); 

  // State cho lỗi
  const [error, setError] = useState(''); 
  const [formErrors, setFormErrors] = useState({ fullName: '', phone: '', address: '' });

  // State cho Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // State cho danh sách Coupon (LẤY TỪ DB)
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [availableCouponsLoading, setAvailableCouponsLoading] = useState(false);

  // Hàm GỌI API THỰC TẾ lấy danh sách Coupon
  const fetchAvailableCoupons = async () => {
    setAvailableCouponsLoading(true);
    setCouponError('');

    try {
        // GỌI ĐẾN ENDPOINT MỚI TẠO Ở BACKEND
        const { data: availableCouponsData } = await axios.get('/api/coupons/available'); 
        setAvailableCoupons(availableCouponsData);
        
    } catch (apiError) {
        console.error("Lỗi khi lấy danh sách ưu đãi:", apiError);
        setCouponError("Không thể tải danh sách ưu đãi.");
    } finally {
        setAvailableCouponsLoading(false);
    }
  };
	
  useEffect(() => {
     if(user) {
        setShippingInfo(prev => ({ 
            fullName: user.fullName || prev.fullName || '', 
            phone: user.phone || prev.phone || '', 
            address: user.address || prev.address || '',
        }));
     }
      fetchAvailableCoupons();
  }, [user]);

  // --- TÍNH TOÁN  ---
  const shippingCost = cartTotal > 1000000 ? 0 : 30000;
  const taxAmount = 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = cartTotal + shippingCost + taxAmount - discountAmount;

  // Xử lý thay đổi input 
    const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
    setError('');
  };
  
  // Kiểm tra form (validation) 
  const validateForm = () => {
    let isValid = true;
    const errors = { fullName: '', phone: '', address: '' };
    if (shippingInfo.fullName.trim().length < 2) { errors.fullName = "Họ tên không hợp lệ."; isValid = false; }
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(shippingInfo.phone)) { errors.phone = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)."; isValid = false; }
    if (shippingInfo.address.trim().length < 10) { errors.address = "Địa chỉ phải có ít nhất 10 ký tự."; isValid = false; }
    setFormErrors(errors);
    return isValid;
  };

  // --- XỬ LÝ ÁP DỤNG MÃ 
  const handleApplyCoupon = async (codeToApply = couponCode) => {
    const finalCode = codeToApply.trim().toUpperCase();
    if (!finalCode) { setCouponError('Vui lòng nhập mã'); return; }

    setCouponLoading(true); setCouponError(''); setError('');
    try {
      // Gọi API validate từ Backend
      const { data } = await axios.post('/api/coupons/validate', {
        code: finalCode, cartTotal: cartTotal,
      });
      setAppliedCoupon(data);
      setCouponCode(''); 
    } catch (apiError) {
      setCouponError(apiError.response?.data?.message || "Lỗi khi áp dụng mã");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };
  
  // --- HÀM HỦY MÃ ---
  const handleRemoveCoupon = () => {
      setAppliedCoupon(null);
      setCouponError('');
  }

  // --- XỬ LÝ ĐẶT HÀNG  ---
  const handlePayment = async () => {
    // 1. Kiểm tra validation
    if (!validateForm()) {
      setError('Vui lòng kiểm tra lại thông tin giao hàng.');
      return;
    }
    if (!selectedPayment) {
      setError('Vui lòng chọn phương thức thanh toán.');
      return;
    }
    
    setError('');
    setProcessing(true); // Bắt đầu loading

    // 2. Tạo đối tượng đơn hàng
    const orderData = {
      orderItems: cartItems.map(i => ({ product: i._id, name: i.name, qty: i.quantity, price: i.price, image: i.images?.[0] || '' })),
      shippingAddress: shippingInfo,
      paymentMethod: selectedPayment,
      itemsPrice: cartTotal,
      taxPrice: taxAmount,
      shippingPrice: shippingCost,
      discountPrice: discountAmount, 
      couponCode: appliedCoupon ? appliedCoupon.code : null, 
      totalPrice: finalTotal, 
    };

    try {
      // 3. LUÔN LUÔN tạo đơn hàng trong DB trước
      const { data: createdOrder } = await axios.post('/api/orders', orderData);
      console.log("Đã tạo đơn hàng (chưa TT):", createdOrder._id);

      // 4. Xử lý tùy theo phương thức thanh toán
      if (selectedPayment === 'cod') {
        // --- Thanh toán COD ---
        clearCart();
        setProcessing(false); // Dừng loading
        navigate(`/order-success`); 
      
      } else if (selectedPayment === 'vnpay') {
        // --- Thanh toán VNPAY (LOGIC GỐC) ---
        console.log("Đang yêu cầu link VNPAY cho đơn:", createdOrder._id);
        
        // Gọi API backend để lấy URL VNPAY
        const { data: paymentData } = await axios.post('/api/payment/create-vnpay-url', {
           orderId: createdOrder._id,
           amount: createdOrder.totalPrice, 
           language: 'vn',
        });

        // Backend trả về paymentUrl
        if (paymentData && paymentData.paymentUrl) {
           clearCart(); // Xóa giỏ hàng
           // Chuyển hướng người dùng sang cổng VNPAY
           window.location.href = paymentData.paymentUrl;
        } else {
           throw new Error("Không nhận được URL thanh toán VNPAY");
        }
      }

    } catch (apiError) {
      console.error("Lỗi khi xử lý đặt hàng:", apiError);
      setError(apiError.response?.data?.message || "Lỗi khi tạo đơn hàng. Vui lòng thử lại.");
      setProcessing(false); // Dừng loading nếu lỗi
    }
  };


  // --- RENDER (GIAO DIỆN) ---
  if (cartItems.length === 0 && !processing) {
    return (
      <div className="container mx-auto px-4 py-12 text-center bg-white shadow-2xl rounded-xl mt-10 max-w-lg">
        <p className="text-xl text-gray-600 mb-4">Giỏ hàng của bạn trống.</p>
        <Link to="/" className="text-white bg-emerald-600 hover:bg-emerald-700 font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300">Quay lại mua sắm</Link>
        </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-emerald-50 min-h-screen py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <Link to="/cart" className="mb-8 inline-flex items-center gap-2 text-base text-emerald-600 hover:text-emerald-800 transition font-medium"> 
            <ArrowLeft size={20} className="text-amber-500" /> Quay lại giỏ hàng 
        </Link>
        <h1 className="text-4xl font-extrabold text-emerald-800 mb-10">
            🌿 Hoàn tất Thanh toán
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* --- Bên trái: Thông tin & Thanh toán --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Form Địa chỉ giao hàng */}
             <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100 transform transition duration-500 hover:shadow-emerald-300/50">
                <h2 className="text-2xl font-black mb-6 text-emerald-700 flex items-center gap-3 border-b pb-3 border-emerald-100">
                    <MapPin size={24} className="text-amber-500" /> THÔNG TIN GIAO HÀNG
                </h2>
                {error && ( 
                    <div className="mb-5 text-base text-red-700 bg-red-100 p-4 rounded-xl flex items-start gap-2 border border-red-400 font-medium shadow-md"> 
                        <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-red-600" /> 
                        <span>**Lỗi Đơn Hàng:** {error}</span> 
                    </div> 
                )}
                <div className="space-y-6 mt-4">
                  <InputV2 label="Họ và tên" name="fullName" value={shippingInfo.fullName} onChange={handleShippingChange} required error={formErrors.fullName} icon={<User size={18} className="text-emerald-500" />} />
                  <InputV2 label="Số điện thoại" name="phone" value={shippingInfo.phone} onChange={handleShippingChange} required placeholder="VD: 0912xxxxxx" error={formErrors.phone} icon={<Phone size={18} className="text-emerald-500" />} />
                  <InputV2 label="Địa chỉ chi tiết" name="address" value={shippingInfo.address} onChange={handleShippingChange} required placeholder="Số nhà, tên đường, phường/xã, quận/huyện..." error={formErrors.address} icon={<MapPin size={18} className="text-emerald-500" />} />
                </div>
             </div>
             
            {/* Chọn phương thức thanh toán */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100 transform transition duration-500 hover:shadow-emerald-300/50">
              <h2 className="text-2xl font-black mb-6 text-emerald-700 flex items-center gap-3 border-b pb-3 border-emerald-100">
                    <CreditCard size={24} className="text-amber-500" /> PHƯƠNG THỨC THANH TOÁN
                </h2>
              <div className="space-y-4 mt-4">
                 <PaymentOptionV2 value="vnpay" selected={selectedPayment} onChange={setSelectedPayment} icon={<CreditCard size={24} className="text-blue-600"/>} title="💳 Thanh toán qua VNPAY-QR"> Thanh toán ngay bằng thẻ ATM, Visa, Mastercard hoặc ứng dụng Ngân hàng/Ví điện tử. </PaymentOptionV2>
                 <PaymentOptionV2 value="cod" selected={selectedPayment} onChange={setSelectedPayment} icon={<Banknote size={24} className="text-green-600"/>} title="💰 Thanh toán khi nhận hàng (COD)"> Kiểm tra hàng và thanh toán tiền mặt cho nhân viên giao hàng khi nhận sản phẩm. </PaymentOptionV2>
              </div>
            </div>
          </div>

          {/* --- Bên phải: Tóm tắt đơn hàng (Sticky) --- */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-600 p-8 rounded-2xl shadow-2xl sticky top-8 border-4 border-white text-white">
              <h2 className="text-2xl font-black mb-5 border-b-2 border-emerald-400 pb-4 flex items-center gap-3">
                    <Tag size={24} className="text-amber-300"/> TỔNG KẾT ĐƠN HÀNG
                </h2>
              
              {/* Ô NHẬP MÃ GIẢM GIÁ */}
              <div className="mb-6 bg-emerald-700/50 p-4 rounded-xl border border-emerald-500">
                {!appliedCoupon ? (
                  <>
                    <label htmlFor="couponCode" className="block text-sm font-extrabold text-emerald-200 mb-2">Nhập Mã Giảm Giá</label>
                    <div className="flex">
                      <input
                        type="text" id="couponCode" value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="VD: FREESHIP25"
                        className={`block w-full rounded-l-lg border-gray-300 shadow-lg sm:text-sm p-3 font-semibold text-gray-800 ${couponError ? 'border-red-500' : 'focus:border-amber-500 focus:ring-amber-500'}`}
                        disabled={couponLoading}
                      />
                      <button
                        onClick={() => handleApplyCoupon(couponCode)} // Gọi với mã trong input
                        disabled={couponLoading}
                        className="flex-shrink-0 rounded-r-lg bg-amber-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-amber-600 disabled:opacity-50 transition flex items-center justify-center shadow-lg"
                      >
                        {couponLoading ? <SpinnerIcon color="text-white" /> : "ÁP DỤNG"}
                      </button>
                    </div>
                    {couponError && <p className="mt-1.5 text-xs font-bold text-red-300 flex items-center gap-1"><ShieldAlert size={14} /> {couponError}</p>}
                  </>
                ) : (
                  <div className="text-sm text-green-200 bg-emerald-900/50 p-3 rounded-lg border border-green-500 shadow-md">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold flex items-center gap-1.5 text-base">
                        <CheckCircle size={16} className="text-green-400" /> Mã: {appliedCoupon.code}
                      </span>
                      <button onClick={handleRemoveCoupon} className="text-sm font-extrabold text-red-400 hover:text-red-300 transition" title="Hủy mã">HỦY</button>
                    </div>
                    <p className="mt-1 text-sm">🎉 GIẢM: **{appliedCoupon.discountAmount.toLocaleString('vi-VN')} ₫**</p>
                  </div>
                )}

                {/* HIỂN THỊ DANH SÁCH COUPON */}
                {availableCouponsLoading ? (
                    <div className="mt-4 flex items-center justify-center text-emerald-200">
                         <SpinnerIcon color="text-emerald-200" /> <span className='ml-2 text-sm'>Đang tải ưu đãi...</span>
                    </div>
                ) : (
                    <CouponList 
                        availableCoupons={availableCoupons} 
                        onApplyCoupon={handleApplyCoupon} 
                        couponLoading={couponLoading}
                        appliedCoupon={appliedCoupon}
                    />
                )}
              </div>
              
              {/* TÍNH TOÁN TIỀN */}
              <div className="space-y-3 mb-6 text-base border-t border-emerald-500 pt-4">
                <div className="flex justify-between font-medium"><span>Tạm tính</span> <span>{cartTotal.toLocaleString('vi-VN')} ₫</span></div>
                <div className="flex justify-between font-medium">
                    <span>Phí vận chuyển</span> 
                    <span className={shippingCost > 0 ? "" : "text-green-300 font-extrabold"}>
                        {shippingCost > 0 ? shippingCost.toLocaleString('vi-VN') + ' ₫' : 'MIỄN PHÍ!'}
                    </span>
                </div>
                {discountAmount > 0 && (
                   <div className="flex justify-between text-amber-300 font-extrabold border-t border-dashed pt-3">
                     <span>GIẢM GIÁ (COUPON)</span>
                     <span>- {discountAmount.toLocaleString('vi-VN')} ₫</span>
                   </div>
                )}
              </div>
              
              {/* Tổng cộng */}
              <div className="border-t-4 border-amber-500 pt-5 flex justify-between text-2xl font-extrabold">
                <span>TỔNG THANH TOÁN</span>
                <span className="text-4xl text-amber-300">{finalTotal.toLocaleString('vi-VN')} ₫</span>
              </div>
              
              {/* Nút Đặt hàng */}
              <button
                onClick={handlePayment}
                disabled={processing || cartItems.length === 0}
                className={`mt-8 w-full rounded-full px-6 py-4 text-xl font-black shadow-2xl transition duration-300 transform hover:scale-[1.03] ${ 
                    processing 
                    ? 'bg-gray-400 cursor-wait' 
                    : (cartItems.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/50') 
                }`}
              >
                {processing ? ( 
                    <div className="flex items-center justify-center gap-2"> 
                        <SpinnerIcon /> ĐANG XỬ LÝ... 
                    </div> 
                ) : ( 
                    `THANH TOÁN NGAY`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component PaymentOption NÂNG CẤP 
const PaymentOptionV2 = ({ value, selected, onChange, icon, title, children }) => (
    <label className={`flex items-start p-5 border rounded-2xl cursor-pointer transition duration-300 ease-in-out shadow-lg transform hover:scale-[1.01] ${
        selected === value 
        ? 'border-emerald-600 ring-4 ring-emerald-200 bg-emerald-50' 
        : 'border-gray-300 hover:border-amber-500 bg-white'
    }`}>
        <input 
            type="radio" 
            name="paymentMethod" 
            value={value} 
            checked={selected === value} 
            onChange={() => onChange(value)} 
            className="mt-1 h-6 w-6 text-amber-500 focus:ring-amber-500 border-gray-300 flex-shrink-0"
        />
        <div className="ml-4 flex-grow">
            <div className='flex items-center gap-2 mb-1'>
                {icon}
                <span className="font-extrabold text-gray-800 text-lg">{title}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{children}</p>
        </div>
    </label>
);

const InputV2 = ({ label, name, type = 'text', value, onChange, required = false, placeholder = '', error = '', icon }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-2"> {label} {required && <span className="text-red-500">*</span>} </label>
    <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            {icon}
        </div>
        <input
            type={type} id={name} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder}
            className={`block w-full rounded-xl shadow-md p-3 pl-10 transition text-gray-800 font-medium ${ 
                error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500' 
            }`}
            aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined}
        />
    </div>
    {error && ( <p id={`${name}-error`} className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1"> <ShieldAlert size={14} className='text-red-500' /> {error} </p> )}
  </div>
);