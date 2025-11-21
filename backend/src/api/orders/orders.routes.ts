import { Router } from 'express';
import { orderController } from './orders.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/:id', orderController.getOrder);
router.put('/:id/status', orderController.updateStatus);

export default router;