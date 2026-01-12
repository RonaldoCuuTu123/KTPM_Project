import express from 'express';
import * as statisticsController from '../controllers/StatisticsController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Statistics
 *     description: Thống kê nhân khẩu
 */

/**
 * @swagger
 * /api/statistics/dashboard:
 *   get:
 *     summary: Lấy thống kê dashboard (tổng hộ, cư dân, phí thu được)
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/dashboard', statisticsController.getDashboardStats);

/**
 * @swagger
 * /api/statistics/by-gender:
 *   get:
 *     summary: Thống kê theo giới tính
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/by-gender', statisticsController.getResidentsByGender);

/**
 * @swagger
 * /api/statistics/by-age-group:
 *   get:
 *     summary: Thống kê theo độ tuổi
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/by-age-group', statisticsController.getResidentsByAgeGroup);

/**
 * @swagger
 * /api/statistics/temporary-status:
 *   get:
 *     summary: Thống kê tạm vắng/tạm trú
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/temporary-status', statisticsController.getTemporaryStats);

/**
 * @swagger
 * /api/statistics/by-date-range:
 *   get:
 *     summary: Thống kê theo khoảng thời gian
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/by-date-range', statisticsController.getResidentsByDateRange);

export default router;
