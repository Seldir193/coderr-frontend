# Coderr Project

The Coderr Project is a web application that allows users to manage various offers, place orders, and write reviews. It consists of a **frontend** developed with JavaScript and CSS and a **backend** powered by Django.

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Technologies](#technologies)
4. [Installation](#installation)
    - [Frontend](#frontend)
    - [Backend](#backend)
5. [Usage](#usage)
6. [API Endpoints](#api-endpoints)
7. [Helper Functions in the Backend](#helper-functions-in-the-backend)
8. [Contributing](#contributing)
9. [License](#license)

## Overview
The Coderr Project combines **frontend** and **backend** to provide a user-friendly platform for managing offers and orders. Customers can register, browse offers, and leave reviews. Providers can create, manage offers, and view statistics.

## Features

- User registration and login
- Role-based access control (Customer/Provider)
- Create, update, and delete offers
- Place orders
- Create, edit, and delete reviews
- Create and update profiles
- Filter and search functionality for offers
- Pagination for offers and orders
- API-driven data management
- Responsive design for mobile and desktop devices

## Technologies

### Frontend:
- Vanilla JavaScript
- HTML5, CSS3

### Backend:
- [Django](https://www.djangoproject.com/)
- Django REST Framework for API
- SQLite for local database

## Installation

### Frontend

1. Clone the repository:
   ```bash
   git clone https://github.com/Seldir193/coderr-frontend.git
   cd coderr-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/Seldir193/coderr-backend.git
   cd coderr-backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # Linux/macOS
   env\Scripts\activate     # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Migrate the database:
   ```bash
   python manage.py migrate
   ```
5. Start the development server:
   ```bash
   python manage.py runserver
   ```

## Usage

- **Customer**: 
  - Can register, log in, and place orders.
  - Add, edit, and delete reviews.
- **Provider**: 
  - Can create, edit, and delete offers.
  - Access business profiles and statistics.

## API Endpoints

The frontend communicates with the following backend API endpoints to provide core functionality.

### Authentication
- **POST** `/registration/`  
  Register a new user.

- **POST** `/login/`  
  Log in a user.

---

### Profiles
- **GET** `/profile/<int:user_id>/`  
  Retrieve a user profile.

- **GET** `/profiles/business/`  
  Retrieve all business profiles.

- **GET** `/profiles/business/<int:user_id>/`  
  Retrieve a specific business profile.

- **GET** `/profiles/customer/`  
  Retrieve all customer profiles.

- **GET** `/profiles/customer/<int:user_id>/`  
  Retrieve a specific customer profile.

---

### Offers
- **GET** `/offers/`  
  Retrieve all offers.

- **POST** `/offers/`  
  Create a new offer.

- **GET** `/offers/<int:id>/`  
  Retrieve details of an offer.

---

### Orders
- **GET** `/orders/`  
  Retrieve all orders.

- **POST** `/orders/`  
  Create a new order.

- **GET** `/orders/<int:order_id>/`  
  Retrieve details of an order.

- **GET** `/order-count/<int:offer_id>/`  
  Count of orders in progress for an offer.

- **GET** `/completed-order-count/<int:user_id>/`  
  Retrieve completed orders of a user.

---

### Reviews
- **GET** `/reviews/`  
  Retrieve all reviews.

- **POST** `/reviews/`  
  Create a new review.

- **GET** `/reviews/<int:pk>/`  
  Retrieve details of a review.

- **PUT** `/reviews/<int:pk>/`  
  Edit a review.

- **DELETE** `/reviews/<int:pk>/`  
  Delete a review.

---

### Base Information
- **GET** `/base-info/`  
  Retrieve base information of the application.

---

### User Orders
- **GET** `/user/orders/`  
  Retrieve orders of a user.

## Helper Functions in the Backend

- **profile_helpers.py**: Helper functions for user profiles (e.g., data validation).
- **utils.py**: General helper functions such as string or date formatting.
- **functions.py**: Business-specific logic used in various views.

## Contributing

Contributions are welcome! Fork the project, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
