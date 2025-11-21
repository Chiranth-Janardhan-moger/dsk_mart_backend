# 📦 Backend Service

This repository houses the backend service for our application, built with Node.js, Express, and TypeScript. It provides a robust and scalable API for managing users (customers, delivery boys, and admins), products, orders, and transactions. The backend supports both RESTful API endpoints and a GraphQL interface.

## 🚀 Features

* **User Management:** Separate models and authentication flows for Customers, Delivery Boys, and Admins.
* **Product Catalog:** CRUD operations for managing products available to customers.
* **Order Management:** Comprehensive order lifecycle, including creation, tracking, status updates, and delivery assignment.
* **Payment & Transactions:** Integration for handling payment transactions.
* **Address Management:** Customer-specific address storage and retrieval.
* **Role-Based Access Control:** Secure endpoints with JWT authentication and role-based authorization.
* **RESTful API:** Clearly defined and organized REST endpoints for various functionalities.
* **GraphQL API:** A powerful and flexible GraphQL interface for efficient data fetching.
* **Error Handling:** Centralized error handling and logging.
* **Input Validation:** Robust validation for all incoming requests.
* **Rate Limiting:** Protects against abuse and ensures service availability.
* **Environment Configuration:** Secure and flexible management of environment variables.
* **Database:** MongoDB integration using Mongoose for data persistence.
* **Testing:** Comprehensive unit and integration test suite.

# Backend Architecture & API Documentation

## 📦 Project Folder Structure

```plaintext
backend/
├── src/
│   ├── config/
│   │   ├── database.ts           # MongoDB connection setup
│   │   ├── env.ts                # Environment variables validation
│   │   └── constants.ts          # App-wide constants
│   │
│   ├── models/
│   │   ├── User.ts               # Customer user model
│   │   ├── DeliveryBoy.ts        # Delivery boy model
│   │   ├── Admin.ts              # Admin user model
│   │   ├── Order.ts              # Order model
│   │   ├── OrderItem.ts          # Order items model
│   │   ├── Product.ts            # Product model
│   │   ├── Transaction.ts        # Payment transaction model
│   │   └── Address.ts            # Customer address model
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.service.ts
│   │   │
│   │   ├── admin/
│   │   │   ├── admin.routes.ts
│   │   │   ├── admin.controller.ts
│   │   │   └── admin.service.ts
│   │   │
│   │   ├── driver/
│   │   │   ├── driver.routes.ts
│   │   │   ├── driver.controller.ts
│   │   │   └── driver.service.ts
│   │   │
│   │   ├── customer/
│   │   │   ├── customer.routes.ts
│   │   │   ├── customer.controller.ts
│   │   │   └── customer.service.ts
│   │   │
│   │   ├── orders/
│   │   │   ├── orders.routes.ts
│   │   │   ├── orders.controller.ts
│   │   │   └── orders.service.ts
│   │   │
│   │   └── products/
│   │       ├── products.routes.ts
│   │       ├── products.controller.ts
│   │       └── products.service.ts
│   │
│   ├── graphql/
│   │   ├── schema/
│   │   │   ├── index.ts
│   │   │   ├── typeDefs.ts
│   │   │   ├── auth.graphql.ts
│   │   │   ├── user.graphql.ts
│   │   │   ├── order.graphql.ts
│   │   │   ├── delivery.graphql.ts
│   │   │   ├── admin.graphql.ts
│   │   │   └── product.graphql.ts
│   │   │
│   │   ├── resolvers/
│   │   │   ├── index.ts
│   │   │   ├── authResolvers.ts
│   │   │   ├── userResolvers.ts
│   │   │   ├── orderResolvers.ts
│   │   │   ├── deliveryResolvers.ts
│   │   │   ├── adminResolvers.ts
│   │   │   └── productResolvers.ts
│   │   │
│   │   └── context.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── roleGuard.ts
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── validator.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── validators.ts
│   │   ├── helpers.ts
│   │   ├── logger.ts
│   │   └── errors.ts
│   │
│   ├── types/
│   │   ├── context.ts
│   │   ├── auth.ts
│   │   ├── express.d.ts
│   │   └── index.ts
│   │
│   ├── routes.ts
│   └── index.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── nodemon.json
└── README.md
```

---

# 📡 API Endpoint Structure

## 🔐 /api/auth - Authentication Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
```

## 👑 /api/admin - Admin Endpoints
```
GET    /api/admin/dashboard
GET    /api/admin/orders
GET    /api/admin/orders/:id
PUT    /api/admin/orders/:id/assign
GET    /api/admin/delivery-boys
GET    /api/admin/leaderboard
GET    /api/admin/revenue
GET    /api/admin/transactions
POST   /api/admin/delivery-boys
PUT    /api/admin/delivery-boys/:id
DELETE /api/admin/delivery-boys/:id
```

## 🚚 /api/driver - Delivery Boy Endpoints
```
GET    /api/driver/orders
GET    /api/driver/orders/:id
POST   /api/driver/orders/:id/confirm
POST   /api/driver/orders/:id/validate-scan
GET    /api/driver/history
GET    /api/driver/profile
PUT    /api/driver/profile
GET    /api/driver/earnings
```

## 🛒 /api/customer - Customer Endpoints
```
GET    /api/customer/products
GET    /api/customer/products/:id
POST   /api/customer/orders
GET    /api/customer/orders
GET    /api/customer/orders/:id
GET    /api/customer/orders/:id/track
POST   /api/customer/addresses
GET    /api/customer/addresses
PUT    /api/customer/addresses/:id
DELETE /api/customer/addresses/:id
```

## 📦 /api/orders - Shared Order Endpoints
```
GET    /api/orders/:id
PUT    /api/orders/:id/status
```

## 🏷️ /api/products - Product Management
```
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```


## 🔌 API Endpoints

The backend exposes a comprehensive set of RESTful API endpoints, categorized by user roles and functionalities:

### 🔐 `/api/auth` - Authentication Endpoints

* **`POST /api/auth/register`**: Register a new user account.
* **`POST /api/auth/login`**: Authenticate user and receive a JWT.
* **`POST /api/auth/refresh-token`**: Obtain a new JWT using a refresh token.
* **`POST /api/auth/forgot-password`**: Initiate password reset process.
* **`POST /api/auth/reset-password`**: Reset password using a valid token.
* **`GET /api/auth/me`**: Retrieve the profile of the currently authenticated user.

### 👑 `/api/admin` - Admin Endpoints (Requires Admin Role)

* **`GET /api/admin/dashboard`**: Get overall dashboard metrics (revenue, orders, etc.).
* **`GET /api/admin/orders`**: Fetch all orders with filtering and pagination options.
* **`GET /api/admin/orders/:id`**: Get detailed information for a specific order.
* **`PUT /api/admin/orders/:id/assign`**: Assign an order to a delivery boy.
* **`GET /api/admin/delivery-boys`**: List all delivery boys.
* **`GET /api/admin/leaderboard`**: View delivery staff performance leaderboard.
* **`GET /api/admin/revenue`**: Get revenue breakdown by various payment methods.
* **`GET /api/admin/transactions`**: Retrieve all payment transactions with pagination.
* **`POST /api/admin/delivery-boys`**: Add a new delivery boy.
* **`PUT /api/admin/delivery-boys/:id`**: Update details of an existing delivery boy.
* **`DELETE /api/admin/delivery-boys/:id`**: Deactivate or delete a delivery boy account.

### 🏍️ `/api/driver` - Delivery Boy Endpoints (Requires Driver Role)

* **`GET /api/driver/orders`**: Get a list of orders assigned to the delivery boy.
* **`GET /api/driver/orders/:id`**: View details of a specific assigned order.
* **`POST /api/driver/orders/:id/confirm`**: Mark an order as delivered.
* **`POST /api/driver/orders/:id/validate-scan`**: Validate package scan during pickup/delivery.
* **`GET /api/driver/history`**: Get delivery history with pagination.
* **`GET /api/driver/profile`**: Retrieve the delivery boy's profile information.
* **`PUT /api/driver/profile`**: Update the delivery boy's profile.
* **`GET /api/driver/earnings`**: Get earnings summary for the delivery boy.

### 🛒 `/api/customer` - Customer Endpoints (Requires Customer Role)

* **`GET /api/customer/products`**: Get a list of all available products.
* **`GET /api/customer/products/:id`**: Get details of a single product.
* **`POST /api/customer/orders`**: Create a new order.
* **`GET /api/customer/orders`**: Get a list of all orders placed by the customer.
* **`GET /api/customer/orders/:id`**: Get detailed information for a specific customer order.
* **`GET /api/customer/orders/:id/track`**: Track the real-time status of an order.
* **`POST /api/customer/addresses`**: Add a new delivery address for the customer.
* **`GET /api/customer/addresses`**: Retrieve all saved addresses for the customer.
* **`PUT /api/customer/addresses/:id`**: Update an existing customer address.
* **`DELETE /api/customer/addresses/:id`**: Delete a customer address.

### 📦 `/api/orders` - Shared Order Endpoints

* **`GET /api/orders/:id`**: Get order by ID (access controlled by user role).
* **`PUT /api/orders/:id/status`**: Update the status of an order (access controlled by user role).

### 🛍️ `/api/products` - Product Management Endpoints

* **`GET /api/products`**: Get all products (publicly accessible).
* `POST /api/products`: Create a new product (Admin only).
* `PUT /api/products/:id`: Update an existing product (Admin only).
* `DELETE /api/products/:id`: Delete a product (Admin only).

## 📊 GraphQL Endpoints

* **`/graphql`**: The primary endpoint for all GraphQL queries and mutations.

    The GraphQL API provides a unified interface to fetch and manipulate data, offering greater flexibility and efficiency compared to REST for complex data requirements. The schema defines various types and operations for `Auth`, `User`, `Order`, `Delivery`, `Admin`, and `Product` entities.

## 🛠️ Technologies Used

* **Node.js**
* **TypeScript**
* **Express.js**
* **Apollo Server** (for GraphQL)
* **MongoDB** (via Mongoose)
* **JWT** (for authentication)
* **Bcrypt** (for password hashing)
* **Winston/Pino** (for logging)
* **Joi/Yup** (for validation - specify which one you prefer)
* **Nodemon** (for development)
* **Jest/Mocha** (for testing - specify which one you prefer)
* **Supertest** (for API integration testing)

## ⚙️ Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory of the `backend` folder based on `.env.example`.

    ```ini
    # .env.example
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/your_database_name
    JWT_SECRET=supersecretjwtkey
    JWT_ACCESS_TOKEN_EXPIRATION=1h
    JWT_REFRESH_TOKEN_EXPIRATION=7d
    # Add other environment variables as needed (e.g., email service credentials)
    ```

    **Important:** Never commit your `.env` file to version control.

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The server will typically run on `http://localhost:5000`. The GraphQL playground will be accessible at `http://localhost:5000/graphql`.

5.  **Build for production:**

    ```bash
    npm run build
    # or
    yarn build
    ```

6.  **Start the production server:**

    ```bash
    npm start
    # or
    yarn start
    ```

## 🧪 Testing

To run the test suite:

```bash
npm test
# or
yarn test