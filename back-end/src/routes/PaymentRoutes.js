import express from 'express';
import * as paymentController from '../controllers/PaymentController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: Quản lý thanh toán phí
 */

/**
 * @swagger
 * /api/payment/get-all-payment:
 *   get:
 *     summary: Lấy danh sách tất cả thanh toán
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/get-all-payment', paymentController.getAllPayments);

/**
 * @swagger
 * /api/payment/get-payment-by-id/{id}:
 *   get:
 *     summary: Lấy thanh toán theo ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/get-payment-by-id/:id', paymentController.getPaymentById);

/**
 * @swagger
 * /api/payment/create-payment:
 *   post:
 *     summary: Tạo thanh toán mới
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HouseholdID:
 *                 type: string
 *                 description: ID hộ gia đình
 *               CollectionID:
 *                 type: string
 *                 description: ID đợt thu
 *               Amount:
 *                 type: number
 *                 description: Số tiền thanh toán
 *               PaymentDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày thanh toán
 *               PaymentMethod:
 *                 type: string
 *                 enum: ['Tiền mặt', 'Chuyển khoản']
 *                 description: Phương thức thanh toán
 *               CollectorName:
 *                 type: string
 *                 description: Tên người thu
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/create-payment', paymentController.createPayment);

/**
 * @swagger
 * /api/payment/update-payment/{id}:
 *   put:
 *     summary: Cập nhật thanh toán
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/update-payment/:id', paymentController.updatePayment);

/**
 * @swagger
 * /api/payment/delete-payment/{id}:
 *   delete:
 *     summary: Xóa thanh toán
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/delete-payment/:id', paymentController.deletePayment);

export default router;
