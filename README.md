# AI Business Intelligence Platform

##  Project Overview

AI Business Intelligence Platform is a full-stack business management and analytics application designed to help businesses manage products, sales, employees, daily reports, and overall business performance from a centralized platform.

The platform provides role-based access, business analytics, interactive dashboards, machine learning predictions, and AI-powered business recommendations.

##  Project Objectives
- Manage business products and sales
- Manage employees and their activities
- Submit and review daily reports
- Monitor business performance
- Provide role-based access control
- Analyze sales and revenue data
- Provide machine learning-based predictions
- Generate AI-powered business recommendations

##  User Roles
The application supports three main roles:

### Admin
- Full access to the application
- Manage products
- Manage sales
- Manage daily reports
- View analytics
- View dashboard

### Manager
- View, add and edit products
- Manage sales
- Review daily reports
- View analytics
- View dashboard

### Employee
- View products
- Create and submit daily reports
- Access only employee-related features

## System Architecture
```text
                    USER
                     │
                     ▼
              ┌─────────────┐
              │   FRONTEND  │
              │   React.js  │
              └──────┬──────┘
                     │
                  REST API
                     │
                     ▼
        ┌─────────────────────────┐
        │        BACKEND          │
        │ Django + DRF            │
        ├─────────────────────────┤
        │ Authentication & Roles  │
        │ Products                │
        │ Sales                   │
        │ Daily Reports           │
        │ Dashboard               │
        │ Analytics               │
        └────────────┬────────────┘
                     │
                     ▼
              ┌─────────────┐
              │    MySQL    │
              │   Database  │
              └─────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ Analytics / ML / AI  │
          │ Pandas / NumPy       │
          │ Scikit-learn         │
          └──────────────────────┘


## Role-Based Access Architecture

                    LOGIN
                      │
                      ▼
              Authentication
                      │
                      ▼
                Identify Role
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
     ADMIN          MANAGER        EMPLOYEE
       │              │              │
       ▼              ▼              ▼
Admin Dashboard  Manager        Employee
                 Dashboard      Features
       │              │              │
       └──────────────┼──────────────┘
                      ▼
                Django REST API
                      │
                      ▼
                 MySQL Database


### Technology Stack

## Frontend
- React.js
- HTML5
- CSS3
- JavaScript
- Bootstrap

## Backend
- Python
- Django
- Django REST Framework

## Database
- MySQL

## Data Analytics & Machine Learning
- Pandas
- NumPy
- Scikit-learn

## Tools
- Git
- GitHub
- VS Code
- Postman

### Backend Modules

## Accounts
-User authentication
- Login
- Role management
- Role-based permissions

## Products
- View products
- Add products
- Edit products
- Delete products based on role

## Sales
- Sales management
- Sales records
- Product-wise sales information

## Daily Reports
- Employee report submission
- Manager review
- Admin management
- Report status tracking

## Analytics
- Total sales
- Total products
- Total products sold
- Total revenue
- Today's sales
- Monthly sales
- Top-selling products

## Dashboard
- Dashboard summary
- Sales by category
- Top-selling products
- Sales trend

##  Role-Based Access Control
The platform implements role-based access control to ensure that each user can access only the features and operations permitted for their role.

### Admin
Admin has full access to the system, including:
- Manage products, sales, and daily reports
- Add, view, edit, and delete records
- Review and manage employee reports
- Access business analytics and dashboards
- Manage overall system operations

### Manager
Manager has operational and monitoring access, including:
- View, add, and edit products and sales
- View and review daily reports
- Edit reports when required
- Access business analytics and dashboards
- Cannot delete products or reports

### Employee
Employee has limited access focused on daily operational activities, including:
- View available products and sales information
- Create and submit daily reports
- Access only employee-related features
- Cannot access analytics or dashboards
- Cannot delete or modify other users' records

## Backend API Modules
/api/auth/
/api/products/
/api/sales/
/api/reports/
/api/analytics/
/api/dashboard/

## Dashboard Features
The dashboard provides:
- Total Products
- Total Sales
- Total Reports
- Total Revenue
- Sales by Category
- Top Selling Products
- Sales Trend

## Analytics Features
The analytics module provides:
- Total Sales
- Total Products
- Total Products Sold
- Total Revenue
- Today's Sales
- Monthly Sales
- Top Selling Products

## Project Status
Backend

✅ Authentication & Role Management
✅ Product Management
✅ Sales Management
✅ Daily Reports
✅ Analytics
✅ Dashboard
✅ Role-Based Permissions

Frontend
🚧 In Progress

Machine Learning
⏳ Planned

AI Business Recommendations
⏳ Planned

## Future Enhancements
- Inventory Management
- Category Management
- Supplier Management
- Customer Management
- Employee Management
- Attendance & Salary Management
- Expense Management
- Machine Learning Predictions
- AI Business Recommendations

## Testing
Backend APIs are tested using:
- Postman
- Django manage.py check
- Role-based API testing

## Development Workflow
Development
     ↓
Git
     ↓
GitHub
     ↓
Backend APIs
     ↓
Frontend Integration
     ↓
Testing
     ↓
Final Deployment

## Project Status

- The project is currently under active development.