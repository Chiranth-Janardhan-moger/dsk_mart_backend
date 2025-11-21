# 🌱 Seed Data Credentials

This document contains all the sample credentials created by the seed script.

## 🚀 How to Run Seed

```bash
npm run seed
```

This will:
- Clear all existing data in MongoDB
- Create sample users (admin, delivery boys, customers)
- Create sample products
- Create sample addresses
- Create sample orders

---

## 👨‍💼 Admin Account

**Email:** `admin@dskmart.com`  
**Phone:** `+919876543210`  
**Password:** `admin123`  
**Role:** Admin  
**Permissions:** manage_users, manage_products, manage_orders, view_analytics

---

## 🚚 Delivery Boy Accounts

### Delivery Boy 1 - Rajesh Kumar
**Email:** `rajesh@dskmart.com`  
**Phone:** `+919876543211`  
**Password:** `delivery123`  
**Role:** Delivery Boy  
**Vehicle:** Bike (DL01AB1234)  
**License:** DL1234567890  
**Stats:** 150 deliveries, ₹15,000 earned, 4.8★ rating

### Delivery Boy 2 - Amit Singh
**Email:** `amit@dskmart.com`  
**Phone:** `+919876543212`  
**Password:** `delivery123`  
**Role:** Delivery Boy  
**Vehicle:** Scooter (DL02CD5678)  
**License:** DL9876543210  
**Stats:** 200 deliveries, ₹20,000 earned, 4.9★ rating

---

## 👤 Customer Accounts

### Customer 1 - Priya Sharma
**Email:** `priya@example.com`  
**Phone:** `+919876543213`  
**Password:** `customer123`  
**Role:** Customer  
**Address:** Flat 301, Green Park Apartments, Sector 15, New Delhi - 110001

### Customer 2 - Vikram Patel
**Email:** `vikram@example.com`  
**Phone:** `+919876543214`  
**Password:** `customer123`  
**Role:** Customer  
**Address:** House 45, Sunshine Colony, Main Road, Gurgaon - 122001

---

## 📦 Sample Products (10 items)

1. Fresh Milk (1L) - ₹60
2. Whole Wheat Bread - ₹40
3. Organic Eggs (12 pcs) - ₹120
4. Basmati Rice (5kg) - ₹450
5. Fresh Tomatoes (1kg) - ₹50
6. Bananas (1 dozen) - ₹60
7. Cooking Oil (1L) - ₹150
8. Tea Powder (500g) - ₹200
9. Sugar (1kg) - ₹45
10. Fresh Paneer (200g) - ₹80

---

## 📋 Sample Orders (3 orders)

1. **ORD-2025-001** - Delivered (Priya Sharma, ₹160, Paid via UPI)
2. **ORD-2025-002** - In Transit (Vikram Patel, ₹750, COD)
3. **ORD-2025-003** - Pending (Priya Sharma, ₹160, UPI Pending)

---

## 🔐 Authentication

You can login using either:
- **Email + Password**
- **Phone + Password**

All passwords are hashed using bcrypt before storing in the database.

---

## ⚠️ Important Notes

- This seed data is for **development and testing only**
- Never use these credentials in production
- The seed script will **DELETE ALL EXISTING DATA** before inserting new data
- Make sure MongoDB is running before executing the seed script
