# CR's Cafe - Full Stack Billing System

A modern, production-ready web application designed to handle point-of-sale operations for cafes. Features a robust Spring Boot backend and responsive React frontend with role-based access control and real-time billing capabilities.

**Live Demo:** [CR's Cafe](https://www.crscafe.com/)

## 🚀 Features

- **Role-Based Access Control**: Differentiates between OWNER and WORKER roles with distinct permissions
- **Secure JWT Authentication**: Modern, token-based security for all API endpoints
- **Menu & Order Management**: Workers can view menu items, create orders, add items to cart, and generate bills
- **Discount Application**: Supports applying dynamic discounts to bills
- **Automated Data Archiving**: Scheduled daily task archives financial data and cleans up old records
- **Production-Ready Backend**: Secure configuration management, custom exception handling, and input validation
- **Professional Frontend UI**: Clean, responsive interface built with React and Tailwind CSS
- **Owner Dashboard**: Comprehensive analytics with revenue tracking and business insights
- **Item Management**: Full CRUD operations for menu items with image upload capabilities
- **Password Management**: Secure password update functionality for users
- **Advanced Search**: Real-time menu search and filtering capabilities

## 🛠 Technology Stack

### Backend
- **Java 21** with **Spring Boot 3.3+**
- **Spring Security** (JWT authentication)
- **Spring Data JPA / Hibernate** (database interaction)
- **Maven** (project management)
- **MySQL** (relational database)

### Frontend
- **React** with Vite for fast development
- **Tailwind CSS** for modern, utility-first styling
- **Axios** for API requests to backend

## 📥 Installation & Setup

### Prerequisites
- Java JDK 21
- Apache Maven
- Node.js (LTS version recommended) & npm
- MySQL Server and client (MySQL Workbench)

### Backend Setup

1. **Clone the Repository**
   
   ```bash
   git clone https://github.com/Sumit-Mundhe/cr-cafe.git
   cd cr-cafe/cr-cafe-billing
3. **Database Setup**
   
   - Open the MySQL Client and Create the Database.
     
     ```bash
     CREATE DATABASE cr_cafe_db;
   - Run the complete schema.sql script provided in the project to create all tables and insert initial data (users, items, etc.).

3. **Configure Applications**
   - Navigate to cr-cafe-billing-app/src/main/resources/ and ensure the application.properties file is configured correctly.
     
   - Set Environment Variable: The application expects the database password to be in an environment variable named DB_PASSWORD.
     
     - In IntelliJ: Run > Edit Configurations > Modify options > Add Environment Variable
    
4. **Build and Run**
   
   ```bash
   mvn clean install
   ```
   - Run CrCafeBillingApplication.java in your IDE.
   - Backend Server will start at http://localhost:8080


### FrontEnd Setup

1. **Navigate to FrontEnd Folder**
   
   ```bash
   cd cr-cafe/cr-cafe-frontend
3. **Install Dependencies**
   
   ```bash
   npm install
5. **Run the Development Server**
   
   ```bash
   npm run dev
   ```
   - The frontend application will be available at http://localhost:5173 (or next available port).


## 🔌 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | Public | User authentication with JWT tokens |
| `POST` | `/api/auth/refresh` | Public | Refresh access token using refresh token |
| `POST` | `/api/auth/logout` | Authenticated | Logout endpoint |

### User Management Endpoints
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/api/users` | OWNER | Create new user account |
| `GET` | `/api/users` | OWNER | Get all users |

### Menu Items Endpoints
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/api/items` | Authenticated | Get all menu items |
| `POST` | `/api/items` | OWNER | Create new menu item |
| `DELETE` | `/api/items/{id}` | OWNER | Delete menu item |
| `PUT` | `/api/items/{id}/availability` | OWNER, MANAGER | Toggle item availability |
| `PATCH` | `/api/items/{id}/price` | OWNER | Update item price |

### Order Management Endpoints
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/api/orders` | OWNER, MANAGER, WORKER | Create new order |
| `POST` | `/api/orders/{orderId}/bill` | Authenticated | Generate bill for order |
| `GET` | `/api/orders/today-count` | OWNER, MANAGER | Get today's order count |
| `GET` | `/api/orders/my-today-count` | OWNER, MANAGER, WORKER | Get user's today's order count |

### Dashboard & Analytics Endpoints
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/api/dashboard/summary` | OWNER, MANAGER | Get business summary |
| `GET` | `/api/dashboard/top-items` | OWNER, MANAGER | Get top selling items |
| `GET` | `/api/dashboard/revenue` | OWNER, MANAGER | Get revenue analytics |
| `GET` | `/api/dashboard/recent-transactions` | OWNER, MANAGER | Get recent transactions |
| `GET` | `/api/dashboard/recent-transactions/paginated` | OWNER, MANAGER | Get paginated transactions |
| `GET` | `/api/dashboard/recent-transactions/filtered` | OWNER, MANAGER | Get filtered transactions |
| `GET` | `/api/dashboard/cashiers` | OWNER, MANAGER | Get all cashiers list |
| `GET` | `/api/dashboard/users-performance` | OWNER, MANAGER | Get user performance metrics |
| `GET` | `/api/dashboard/todays-revenue-by-payment-mode` | OWNER, MANAGER | Get today's revenue by payment method |

- Note: All endpoints (except /api/auth/login and /api/auth/refresh) require a valid JWT Bearer token in the Authorization header.


## 🏗️ Project Structure

  ```bash
 cr-cafe/
├── cr-cafe-billing/          # Spring Boot backend
│   ├── src/main/java/        # Java source code
│   ├── src/main/resources/   # Configuration files
│   └── schema.sql           # Database schema
├── cr-cafe-frontend/         # React frontend
│   ├── src/                 # React components
│   ├── public/              # Static assets
│   └── package.json         # Dependencies
└── README.md               # Project documentation
```

## 📄 License
  - This project is developed for educational and portfolio purposes.


  




