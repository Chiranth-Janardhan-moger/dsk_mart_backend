import { Router } from 'express';
import { driverController } from './driver.controller';
import { authMiddleware, roleGuard } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware, roleGuard(['delivery_boy']));

router.get('/orders', driverController.getAssignedOrders);
router.get('/orders/:id', driverController.getOrderDetails);
router.post('/orders/:id/confirm', driverController.confirmDelivery);
router.post('/orders/:id/validate-scan', driverController.validateScan);
router.get('/history', driverController.getHistory);
router.get('/profile', driverController.getProfile);
router.put('/profile', driverController.updateProfile);
router.get('/earnings', driverController.getEarnings);

export default router;