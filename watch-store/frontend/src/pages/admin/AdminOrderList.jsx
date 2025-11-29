import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Truck, Eye, AlertCircle, Clock, Trash2, HelpCircle, Filter } from 'lucide-react';

// --- (Các helper) ---
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch (e) { return 'Invalid Date'; }
};
const getOrderStatus = (order) => {
  if (order.isDelivered) {
    return { text: "Hoàn thành", color: "text-green-700 bg-green-100", icon: <CheckCircle size={14} /> };
  }
  if (order.isPaid) {
    return { text: "Đã thanh toán", color: "text-blue-700 bg-blue-100", icon: <CheckCircle size={14} /> };
  }
  return { text: "Chờ xác nhận", color: "text-yellow-700 bg-yellow-100", icon: <Clock size={14} /> };
};
const Spinner = ({ size = 'h-5 w-5', color = 'text-emerald-600' }) => (
  <svg className={`animate-spin ${size} ${color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);



// --- Component Chính ---
export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingAction, setLoadingAction] = useState(null); 
  
  // --- (LẤY FILTER TỪ URL) ---
  const [searchParams] = useSearchParams();
  const [filterActive, setFilterActive] = useState(false);

  // Hàm gọi API
  const fetchAdminOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      // --- (ĐỌC CÁC PARAMS) ---
      const params = new URLSearchParams(searchParams);
      const startDate = params.get('startDate');
      const endDate = params.get('endDate');
      const isPaid = params.get('isPaid');
      const view = params.get('view');
      
      if(startDate || endDate || isPaid || view) {
        setFilterActive(true);
      } else {
        setFilterActive(false);
      }
      
      // --- (GỬI PARAMS LÊN BACKEND) ---
      // (axios sẽ tự động chuyển đổi params object thành query string)
      const { data } = await axios.get('/api/orders', { 
        params: Object.fromEntries(params) 
      }); 
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
         throw new Error("Dữ liệu trả về không đúng định dạng.");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Lỗi không xác định.';
      setError(`Lỗi khi tải danh sách đơn hàng: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- (CHẠY LẠI KHI FILTER THAY ĐỔI) ---
  useEffect(() => {
    fetchAdminOrders();
  }, [searchParams]); // Chạy lại mỗi khi URL query (searchParams) thay đổi

  // (Các hàm handleMarkDelivered và handleDeleteOrder giữ nguyên)
  const handleMarkDelivered = async (orderId) => {
    if (window.confirm('Xác nhận đơn hàng này đã được giao thành công?')) {
      setLoadingAction(`deliver_${orderId}`);
      try {
        await axios.put(`/api/orders/${orderId}/deliver`);
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, isDelivered: true, deliveredAt: new Date().toISOString() } : order
          )
        );
      } catch (err) {
        setError(`Lỗi khi cập nhật đơn hàng: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN đơn hàng này? (Hàng sẽ được hoàn kho)`)) {
      setLoadingAction(`delete_${orderId}`);
      try {
        await axios.delete(`/api/orders/${orderId}`);
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      } catch (err) {
        setError(`Lỗi khi xóa đơn hàng: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoadingAction(null);
      }
    }
  };

  // --- PHẦN RENDER (GIAO DIỆN) ---
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Quản lý Đơn hàng</h1>

      {error && (
        <div className="mb-4 text-red-700 bg-red-100 p-4 rounded-lg border border-red-300 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      {/* --- (HIỂN THỊ THÔNG BÁO LỌC) --- */}
      {filterActive && !loading && (
        <div className="mb-4 bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} />
            <p>Danh sách đơn hàng .</p>
          </div>
          <Link 
            to="/admin/orders" 
            className="font-semibold underline whitespace-nowrap text-blue-900 hover:text-blue-700"
            onClick={() => setFilterActive(false)}
          >
            Xem tất cả
          </Link>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-600 flex items-center justify-center gap-2">
          <Spinner /> Đang tải danh sách đơn hàng...
        </div>
      
      ) : orders.length === 0 && !error ? (
         <div className="text-center py-10 text-gray-500 bg-white shadow rounded-lg p-6">
           Hiện chưa có đơn hàng nào (khớp với bộ lọc của bạn).
         </div>
         
      ) : !error && (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 align-middle text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã ĐH</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                  const statusInfo = getOrderStatus(order);
                  const isActionLoading = loadingAction?.endsWith(order._id);

                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-500 hover:text-gray-700 cursor-pointer" title={order._id}>
                        #{order._id.substring(order._id.length - 6).toUpperCase()}
                      </td>
                      
                      {/* --- KHÁCH HÀNG  --- */}
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {order.user && order.user.fullName ? order.user.fullName : (
                          <span className='text-gray-400 italic'>[Đã xóa]</span>
                        )}
                      </td>
                      
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDateTime(order.createdAt)}</td>
                      <td className="px-4 py-3 text-gray-700 text-right whitespace-nowrap">{order.totalPrice.toLocaleString('vi-VN')} ₫</td>
                      
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 ${statusInfo.color} px-2 py-0.5 rounded-full text-xs font-semibold`}>
                          {statusInfo.icon} {statusInfo.text}
                        </span>
                         {!order.isPaid && order.paymentMethod !== 'cod' && ( 
                           <HelpCircle size={14} className="inline-block ml-1 text-red-500" title="Chưa thanh toán"/>
                         )}
                      </td>
                      
                      <td className="px-4 py-3 whitespace-nowrap text-center font-medium space-x-1">
                        <Link
                          to={`/order/${order._id}`}
                          className="text-blue-600 hover:text-blue-900 p-1 inline-block"
                          title="Xem chi tiết đơn hàng"
                        > <Eye size={17} /> </Link>
                        
                        {!order.isDelivered && (
                          <button
                            onClick={() => handleMarkDelivered(order._id)}
                            className={`text-emerald-600 hover:text-emerald-900 p-1 inline-block ${loadingAction === `deliver_${order._id}` ? 'opacity-50 cursor-wait' : ''}`}
                            title="Đánh dấu đã giao hàng"
                            disabled={isActionLoading}
                          >
                             {loadingAction === `deliver_${order._id}` ? ( <Spinner size="h-4 w-4" color="text-emerald-500"/> ) : ( <Truck size={17} /> )}
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className={`text-red-500 hover:text-red-700 p-1 inline-block ${loadingAction === `delete_${order._id}` ? 'opacity-50 cursor-wait' : ''}`}
                          title="Xóa đơn hàng"
                          disabled={isActionLoading}
                        >
                           {loadingAction === `delete_${order._id}` ? ( <Spinner size="h-4 w-4" color="text-red-500"/> ) : ( <Trash2 size={17} /> )}
                        </button>
                      </td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}