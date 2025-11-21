import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Admin } from './models/Admin';
import { DeliveryBoy } from './models/DeliveryBoy';
import { Product } from './models/Product';
import { Address } from './models/Address';
import { Order } from './models/Order';
import { logger } from './utils/logger';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meetmart';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Admin.deleteMany({});
    await DeliveryBoy.deleteMany({});
    await Product.deleteMany({});
    await Address.deleteMany({});
    await Order.deleteMany({});
    logger.info('🗑️  Cleared existing data');

    // ==================== USERS ====================
    
    // Admin User
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@dskmart.com',
      phone: '+919876543210',
      password: 'admin123',
      role: 'admin',
      isActive: true,
    });

    // Admin Profile
    await Admin.create({
      userId: adminUser._id,
      permissions: ['manage_users', 'manage_products', 'manage_orders', 'view_analytics'],
    });

    // Delivery Boys
    const deliveryBoy1 = await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh@dskmart.com',
      phone: '+919876543211',
      password: 'delivery123',
      role: 'delivery_boy',
      isActive: true,
    });

    await DeliveryBoy.create({
      userId: deliveryBoy1._id,
      vehicleType: 'Bike',
      vehicleNumber: 'DL01AB1234',
      licenseNumber: 'DL1234567890',
      totalDeliveries: 150,
      totalEarnings: 15000,
      rating: 4.8,
      isAvailable: true,
      currentLocation: {
        latitude: 28.6139,
        longitude: 77.2090,
      },
    });

    const deliveryBoy2 = await User.create({
      name: 'Amit Singh',
      email: 'amit@dskmart.com',
      phone: '+919876543212',
      password: 'delivery123',
      role: 'delivery_boy',
      isActive: true,
    });

    await DeliveryBoy.create({
      userId: deliveryBoy2._id,
      vehicleType: 'Scooter',
      vehicleNumber: 'DL02CD5678',
      licenseNumber: 'DL9876543210',
      totalDeliveries: 200,
      totalEarnings: 20000,
      rating: 4.9,
      isAvailable: true,
      currentLocation: {
        latitude: 28.7041,
        longitude: 77.1025,
      },
    });

    // Customer Users
    const customer1 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+919876543213',
      password: 'customer123',
      role: 'customer',
      isActive: true,
    });

    const customer2 = await User.create({
      name: 'Vikram Patel',
      email: 'vikram@example.com',
      phone: '+919876543214',
      password: 'customer123',
      role: 'customer',
      isActive: true,
    });

    logger.info('✅ Created users (Admin, Delivery Boys, Customers)');

    // ==================== ADDRESSES ====================
    
    const address1 = await Address.create({
      userId: customer1._id,
      apartment: 'Flat 301, Green Park Apartments',
      addressLine: 'Sector 15, Near Metro Station',
      city: 'New Delhi',
      pincode: '110001',
      latitude: 28.6139,
      longitude: 77.2090,
      isDefault: true,
    });

    const address2 = await Address.create({
      userId: customer2._id,
      apartment: 'House 45, Sunshine Colony',
      addressLine: 'Main Road, Opposite City Mall',
      city: 'Gurgaon',
      pincode: '122001',
      latitude: 28.4595,
      longitude: 77.0266,
      isDefault: true,
    });

    logger.info('✅ Created addresses');

    // ==================== PRODUCTS ====================
    
    const products = await Product.insertMany([
      {
        name: 'Fresh Milk (1L)',
        description: 'Farm fresh full cream milk',
        price: 60,
        category: 'Dairy',
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
        inStock: true,
      },
      {
        name: 'Whole Wheat Bread',
        description: 'Freshly baked whole wheat bread',
        price: 40,
        category: 'Bakery',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
        inStock: true,
      },
      {
        name: 'Organic Eggs (12 pcs)',
        description: 'Farm fresh organic eggs',
        price: 120,
        category: 'Dairy',
        imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f',
        inStock: true,
      },
      {
        name: 'Basmati Rice (5kg)',
        description: 'Premium quality basmati rice',
        price: 450,
        category: 'Grains',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
        inStock: true,
      },
      {
        name: 'Fresh Tomatoes (1kg)',
        description: 'Farm fresh red tomatoes',
        price: 50,
        category: 'Vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d',
        inStock: true,
      },
      {
        name: 'Bananas (1 dozen)',
        description: 'Fresh ripe bananas',
        price: 60,
        category: 'Fruits',
        imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
        inStock: true,
      },
      {
        name: 'Cooking Oil (1L)',
        description: 'Refined sunflower oil',
        price: 150,
        category: 'Cooking Essentials',
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5',
        inStock: true,
      },
      {
        name: 'Tea Powder (500g)',
        description: 'Premium Assam tea powder',
        price: 200,
        category: 'Beverages',
        imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9',
        inStock: true,
      },
      {
        name: 'Sugar (1kg)',
        description: 'Pure white sugar',
        price: 45,
        category: 'Cooking Essentials',
        imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15',
        inStock: true,
      },
      {
        name: 'Fresh Paneer (200g)',
        description: 'Homemade fresh paneer',
        price: 80,
        category: 'Dairy',
        imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7',
        inStock: true,
      },
    ]);

    logger.info('✅ Created products');

    // ==================== ORDERS ====================
    
    await Order.create({
      orderNumber: 'ORD-2025-001',
      customerId: customer1._id,
      deliveryBoyId: deliveryBoy1._id,
      items: [
        {
          productId: products[0]._id,
          name: products[0].name,
          quantity: 2,
          price: products[0].price,
        },
        {
          productId: products[1]._id,
          name: products[1].name,
          quantity: 1,
          price: products[1].price,
        },
      ],
      totalAmount: 160,
      status: 'delivered',
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      deliveryAddress: address1._id,
      packageCode: 'PKG001',
      deliveredAt: new Date('2025-11-20T10:30:00'),
    });

    await Order.create({
      orderNumber: 'ORD-2025-002',
      customerId: customer2._id,
      deliveryBoyId: deliveryBoy2._id,
      items: [
        {
          productId: products[3]._id,
          name: products[3].name,
          quantity: 1,
          price: products[3].price,
        },
        {
          productId: products[6]._id,
          name: products[6].name,
          quantity: 2,
          price: products[6].price,
        },
      ],
      totalAmount: 750,
      status: 'in_transit',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      deliveryAddress: address2._id,
      packageCode: 'PKG002',
    });

    await Order.create({
      orderNumber: 'ORD-2025-003',
      customerId: customer1._id,
      items: [
        {
          productId: products[4]._id,
          name: products[4].name,
          quantity: 2,
          price: products[4].price,
        },
        {
          productId: products[5]._id,
          name: products[5].name,
          quantity: 1,
          price: products[5].price,
        },
      ],
      totalAmount: 160,
      status: 'pending',
      paymentMethod: 'upi',
      paymentStatus: 'pending',
      deliveryAddress: address1._id,
    });

    logger.info('✅ Created orders');

    // ==================== SUMMARY ====================
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📋 SAMPLE CREDENTIALS:\n');
    console.log('👨‍💼 ADMIN:');
    console.log('   Email: admin@dskmart.com');
    console.log('   Phone: +919876543210');
    console.log('   Password: admin123');
    console.log('\n🚚 DELIVERY BOY 1:');
    console.log('   Email: rajesh@dskmart.com');
    console.log('   Phone: +919876543211');
    console.log('   Password: delivery123');
    console.log('\n🚚 DELIVERY BOY 2:');
    console.log('   Email: amit@dskmart.com');
    console.log('   Phone: +919876543212');
    console.log('   Password: delivery123');
    console.log('\n👤 CUSTOMER 1:');
    console.log('   Email: priya@example.com');
    console.log('   Phone: +919876543213');
    console.log('   Password: customer123');
    console.log('\n👤 CUSTOMER 2:');
    console.log('   Email: vikram@example.com');
    console.log('   Phone: +919876543214');
    console.log('   Password: customer123');
    console.log('\n' + '='.repeat(60));
    console.log(`📦 Products: ${products.length}`);
    console.log(`📍 Addresses: 2`);
    console.log(`📋 Orders: 3`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedDatabase();
