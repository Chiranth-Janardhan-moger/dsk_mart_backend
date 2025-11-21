import { Response, NextFunction, Request } from 'express';
import { Product } from '../../models/Product';
import { NotFoundError } from '../../utils/errors';

class ProductController {
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await Product.find({ inStock: true });
      res.json({ products });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await Product.create(req.body);
      res.status(201).json({ product });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!product) throw new NotFoundError('Product not found');
      res.json({ product });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { inStock: false },
        { new: true }
      );
      if (!product) throw new NotFoundError('Product not found');
      res.json({ message: 'Product deleted', product });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
