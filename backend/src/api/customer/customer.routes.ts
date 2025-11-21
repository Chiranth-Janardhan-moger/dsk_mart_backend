import { Router } from 'express';
import { customerController } from './customer.controller';
import { authMiddleware, roleGuard } from '../../middleware/auth';

const router = Router();

router.get('/products', customerController.getProducts);
router.get('/products/:id', customerController.getProduct);

router.use(authMiddleware, roleGuard(['customer']));

router.post('/orders', customerController.createOrder);
router.get('/orders', customerController.getOrders);
router.get('/orders/:id', customerController.getOrderDetails);
router.get('/orders/:id/track', customerController.trackOrder);
router.post('/addresses', customerController.createAddress);
router.get('/addresses', customerController.getAddresses);
router.put('/addresses/:id', customerController.updateAddress);
router.delete('/addresses/:id', customerController.deleteAddress);

export default router;
