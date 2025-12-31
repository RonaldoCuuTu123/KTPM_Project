import express from 'express';
import * as householdController from '../controllers/HouseholdController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Households
 *     description: Quản lý hộ khẩu tổ dân phố
 */

/**
 * @swagger
 * /api/households/get-all-households:
 *   get:
 *     summary: Lấy danh sách tất cả hộ khẩu
 *     tags: [Households]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/get-all-households', householdController.getAllHouseholds);

/**
 * @swagger
 * /api/households/create-household:
 *   post:
 *     summary: Tạo hộ khẩu mới
 *     tags: [Households]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HouseholdNumber:
 *                 type: string
 *                 description: Số nhà/hộ khẩu
 *                 example: "101"
 *               Street:
 *                 type: string
 *                 description: Đường phố/Ấp
 *                 example: "Đường La Khê"
 *               Ward:
 *                 type: string
 *                 description: Phường/Xã/Thị trấn
 *                 example: "La Khê"
 *               District:
 *                 type: string
 *                 description: Quận/Huyện
 *                 example: "Hà Đông"
 *               HouseholdHead:
 *                 type: string
 *                 description: Họ tên chủ hộ
 *                 example: "Nguyễn Văn A"
 *               Members:
 *                 type: integer
 *                 description: Số thành viên
 *                 example: 4
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/create-household', householdController.createHousehold);

router.get('/get-household-by-id/:id', householdController.getHouseholdById);
router.put('/update-household/:id', householdController.updateHousehold);
router.delete('/delete-household/:id', householdController.deleteHousehold);

/**
 * @swagger
 * /api/households/find-by-number:
 *   post:
 *     summary: Tìm hộ theo số nhà
 *     tags: [Households]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               householdNumber:
 *                 type: string
 *                 example: "101"
 *     responses:
 *       200:
 *         description: Tìm thấy
 */
router.post('/find-by-number', householdController.findHouseholdByNumber);

/**
 * @swagger
 * /api/households/split-household:
 *   post:
 *     summary: Tách hộ khẩu
 *     tags: [Households]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalHouseholdId:
 *                 type: integer
 *                 description: ID hộ gốc
 *               newHouseholdNumber:
 *                 type: string
 *                 description: Số nhà mới
 *                 example: "101A"
 *               newHouseholdHead:
 *                 type: string
 *                 description: Tên chủ hộ mới
 *               residentIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Danh sách ID cư dân chuyển sang hộ mới
 *               Notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tách hộ thành công
 */
router.post('/split-household', householdController.splitHousehold);

export default router;