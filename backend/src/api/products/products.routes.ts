import { Router } from 'express';
import { productController } from './products.controller';
import { authMiddleware, roleGuard } from '../../middleware/auth';

const router = Router();

router.get('/', productController.getAllProducts);
router.post('/', authMiddleware, roleGuard(['admin']), productController.createProduct);
router.put('/:id', authMiddleware, roleGuard(['admin']), productController.updateProduct);
router.delete('/:id', authMiddleware, roleGuard(['admin']), productController.deleteProduct);

export default router;
