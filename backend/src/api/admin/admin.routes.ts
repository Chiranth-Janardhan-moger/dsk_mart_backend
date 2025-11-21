import { Router } from 'express';
import { adminController } from './admin.controller';
import { authMiddleware, roleGuard } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware, roleGuard(['admin']));

router.get('/dashboard', adminController.getDashboard);
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrderDetails);
router.put('/orders/:id/assign', adminController.assignOrder);
router.get('/delivery-boys', adminController.getDeliveryBoys);
router.get('/leaderboard', adminController.getLeaderboard);
router.get('/revenue', adminController.getRevenue);
router.get('/transactions', adminController.getTransactions);
router.post('/delivery-boys', adminController.createDeliveryBoy);
router.put('/delivery-boys/:id', adminController.updateDeliveryBoy);
router.delete('/delivery-boys/:id', adminController.deleteDeliveryBoy);

export default router;
