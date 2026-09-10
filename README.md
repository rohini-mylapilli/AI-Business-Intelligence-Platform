# AI Business Intelligence Platform with Machine Learning

---

# Project Overview

The **AI Business Intelligence Platform** is a full-stack business management and analytics application developed using **Python, Django, Django REST Framework, React.js, MySQL, and Machine Learning**.

The platform helps businesses manage daily operations and analyze performance through centralized dashboards, reports, role-based access, and predictive insights.

The system enables users to:

* Login securely
* Access role-based dashboards
* Manage products
* Manage sales and billing
* Submit and review daily reports
* Monitor business analytics
* Track revenue and sales performance
* Use machine learning for sales prediction
* Access data through REST APIs

---

# Project Objectives

* Build a centralized business management platform.
* Implement secure role-based authentication.
* Develop REST APIs using Django REST Framework.
* Integrate React frontend with Django backend.
* Manage product and sales operations.
* Provide daily reporting functionality.
* Generate business analytics and dashboards.
* Integrate machine learning for sales prediction.
* Build a scalable foundation for future AI-based business intelligence.

---

# System Architecture

```text
                    User
                      |
                      v
                React Frontend
                      |
                REST API Calls
                      |
                      v
          Django REST Framework
                      |
               JWT Authentication
                      |
              Role Permissions
                      |
              Business Logic
                      |
                 Serializers
                      |
                Django Models
                      |
                    MySQL
                      |
              Analytics Module
                      |
           Machine Learning Model
                      |
              Sales Prediction
```

---

# Project Structure

```text
AI-Business-Intelligence-Platform/
|
|-- backend/
|   |
|   |-- accounts/
|   |-- analytics/
|   |-- config/
|   |-- dashboard/
|   |-- ml/
|   |-- products/
|   |-- reports/
|   |-- sales/
|   |
|   `-- manage.py
|
|-- frontend/
|   |
|   |-- public/
|   |-- src/
|   |   |
|   |   |-- assets/
|   |   |-- pages/
|   |   |
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |
|   |-- package.json
|   `-- vite.config.js
|
|-- .env
|-- .gitignore
|-- README.md
`-- requirements.txt
```

---

# Backend Modules

## Accounts

Responsible for:

* User authentication
* Login
* JWT authentication
* User roles
* Role-based permissions
* Admin access control
* Manager access control
* Employee access control

---

## Products

Responsible for:

* Product creation
* Product listing
* Product editing
* Product categories
* Product management
* Role-based product permissions

---

## Sales

Responsible for:

* Sales creation
* Billing information
* Customer details
* Product-wise sales
* Quantity tracking
* Sales history
* Revenue calculation
* Sales-related business data

---

## Reports

Responsible for:

* Daily report creation
* Employee report submission
* Manager review
* Admin report management
* Report status tracking
* Report history
* Role-based report permissions

---

## Dashboard

Responsible for displaying important business information such as:

* Total Products
* Total Sales
* Total Reports
* Total Revenue
* Sales Summary
* Sales by Category
* Top-Selling Products
* Business Performance Overview

---

## Analytics

Responsible for:

* Total Sales
* Total Products
* Total Products Sold
* Total Revenue
* Today's Sales
* Monthly Sales
* Top-Selling Products
* Sales Trends
* Sales by Category
* Business Performance Analysis

---

## Machine Learning

Responsible for:

* Sales prediction
* Historical sales analysis
* Business forecasting support

Machine learning technologies used:

* Pandas
* NumPy
* Scikit-learn

The trained model is stored in:

```text
backend/ml/sales_model.pkl
```

Prediction logic is available in:

```text
backend/ml/sales_prediction.py
```

---

# User Roles

The system supports three main user roles:

## Admin

Admin has full system access.

Admin can:

* Access Admin Dashboard
* Manage products
* Manage sales
* Manage daily reports
* View analytics
* Review business performance
* Access administrative operations

---

## Manager

Manager has operational and monitoring access.

Manager can:

* Access Manager Dashboard
* View products
* Add and edit permitted product information
* Manage sales operations
* Review daily reports
* View analytics
* Monitor business performance

---

## Employee

Employee has limited operational access.

Employee can:

* Access Employee Dashboard
* View permitted products
* Access permitted sales functionality
* Create daily reports
* Submit reports
* Access employee-related features

Administrative functionality is restricted based on role permissions.

---

# Frontend Pages

The React frontend includes:

```text
Login
Admin Dashboard
Manager Dashboard
Employee Dashboard
Products
Sales
Reports
Analytics
Users
Settings
```

---

# Technology Stack

## Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3

## Backend

* Python
* Django
* Django REST Framework
* JWT Authentication
* Django CORS Headers

## Database

* MySQL

## Machine Learning

* NumPy
* Pandas
* Scikit-learn

## Development Tools

* Git
* GitHub
* VS Code
* Postman

---

# REST API Modules

```text
/api/auth/
/api/products/
/api/sales/
/api/reports/
/api/analytics/
/api/dashboard/
```

The APIs are protected based on authentication and user roles.

---

# API Flow

```text
React Frontend
      |
      v
REST API Request
      |
      v
Django REST Framework
      |
      v
Authentication & Permissions
      |
      v
Views
      |
      v
Serializers
      |
      v
Models
      |
      v
MySQL Database
      |
      v
JSON Response
      |
      v
React User Interface
```

---

# Machine Learning Workflow

```text
Historical Sales Data
        |
        v
Data Processing
        |
        v
Machine Learning Model
        |
        v
Sales Prediction
        |
        v
Business Insights
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd AI-Business-Intelligence-Platform
```

---

## Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate
```

---

## Install Backend Dependencies

```bash
python -m pip install -r requirements.txt
```

---

# Environment Configuration

Create a `.env` file in the project root.

```text
AI-Business-Intelligence-Platform/.env
```

Add:

```env
DJANGO_SECRET_KEY=your_django_secret_key
DB_PASSWORD=your_mysql_password
```

The `.env` file should never be committed to GitHub.

---

# Database Setup

Create the MySQL database:

```text
ai_business_intelligence
```

Then apply migrations:

```bash
python backend/manage.py migrate
```

---

# Run Backend

```bash
python backend/manage.py runserver
```

Default backend URL:

```text
http://127.0.0.1:8000/
```

---

# Run Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL:

```text
http://localhost:5173/
```

---

# Frequently Used Django Commands

## System Check

```bash
python backend/manage.py check
```

## Create Migrations

```bash
python backend/manage.py makemigrations
```

## Apply Migrations

```bash
python backend/manage.py migrate
```

## View Migration Status

```bash
python backend/manage.py showmigrations
```

## Run Server

```bash
python backend/manage.py runserver
```

## Create Admin User

```bash
python backend/manage.py createsuperuser
```

## Run Tests

```bash
python backend/manage.py test
```

---

# Frequently Used Git Commands

```bash
git status

git add .

git commit -m "Update project"

git push origin main
```

---

# Testing

The project has been tested for:

* Authentication
* Role-based access
* Admin Dashboard
* Manager Dashboard
* Employee Dashboard
* Product management
* Sales and billing
* Daily reports
* Analytics
* REST API integration
* Machine learning functionality
* Database migrations
* Frontend and backend integration

Django system verification:

```bash
python backend/manage.py check
```

Expected output:

```text
System check identified no issues (0 silenced).
```

---

# Security

Sensitive information is managed using environment variables.

The following should not be committed to GitHub:

```text
.env
venv/
node_modules/
__pycache__/
*.pyc
db.sqlite3
media/
staticfiles/
```

For production deployment:

* Set `DEBUG=False`
* Configure `ALLOWED_HOSTS`
* Use a strong Django Secret Key
* Use secure database credentials
* Configure HTTPS
* Restrict CORS origins

---

# Current Project Status

```text
Authentication & Roles        Complete
Admin Dashboard               Complete
Manager Dashboard             Complete
Employee Dashboard            Complete
Products                      Complete
Sales & Billing               Complete
Reports                       Complete
Analytics                     Complete
REST API Integration          Complete
Frontend Integration          Complete
Machine Learning Prediction   Implemented
Professional UI               Implemented
```

---

# Future Enhancements

* Inventory Management
* Supplier Management
* Customer Management
* Expense Management
* Employee Attendance
* Payroll Management
* Advanced Sales Forecasting
* AI Business Recommendations
* Automated Alerts
* Exportable Business Reports
* Cloud Deployment
* Advanced Analytics Dashboard
* Mobile Application

---

# Developer

**Rohini Myalpilli**

Python Full Stack Developer

---

# License

This project is developed for **educational, learning, demonstration, and portfolio purposes**.

The source code may be used and modified for personal learning and non-commercial projects with proper attribution to the developer.

Commercial use, redistribution, or claiming the project as original work without permission is not permitted.

© 2026 Rohini Myalpilli. All rights reserved.