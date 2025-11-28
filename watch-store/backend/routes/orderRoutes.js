import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getOrders,
  updateOrderToDelivered,
  deleteOrder,
  getDashboardStats
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// --- CÁC ROUTE CỤ THỂ (SPECIFIC) PHẢI ĐẶT LÊN TRÊN ---

// (ĐÃ DI CHUYỂN LÊN ĐÂY)
// Admin lấy thống kê
router.route('/stats')
  .get(protect, admin, getDashboardStats);

// User lấy đơn hàng của mình
router.route('/myorders')
  .get(protect, getMyOrders);

// --- ROUTE GỐC (ROOT) ---
router.route('/')
  .post(protect, addOrderItems) // User tạo đơn hàng
  .get(protect, admin, getOrders); // Admin lấy tất cả đơn hàng

// --- CÁC ROUTE ĐỘNG (PARAMETERIZED) LUÔN ĐẶT CUỐI CÙNG ---
// (Vì '/:id' sẽ khớp với CẢ 'stats' VÀ 'myorders' nếu đặt sai)

// Các route liên quan đến 1 ID đơn hàng cụ thể
router.route('/:id')
  .get(protect, getOrderById) // User/Admin lấy chi tiết
  .delete(protect, admin, deleteOrder); // Admin xóa đơn hàng

// Cập nhật thanh toán
router.route('/:id/pay')
  .put(protect, updateOrderToPaid); 

// Cập nhật giao hàng
router.route('/:id/deliver')
  .put(protect, admin, updateOrderToDelivered); 


export default router;