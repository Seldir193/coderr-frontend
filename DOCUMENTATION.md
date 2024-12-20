# Frontend Documentation for the Coderr Project

## Table of Contents
1. [Introduction](#introduction)
2. [Technologies Used](#technologies-used)
3. [Setup and Installation](#setup-and-installation)
4. [Project Structure](#project-structure)
5. [Features](#features)
6. [API Integration](#api-integration)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Contributing](#contributing)
10. [License](#license)

---

## Introduction

The frontend of the Coderr project is a client-side web application developed using **HTML**, **CSS**, and **Vanilla JavaScript**. It provides a user-friendly interface for customers and providers to manage offers, orders, and reviews. The frontend communicates with the backend via RESTful APIs.

---

## Technologies Used

- **HTML5**: Structuring web pages.
- **CSS3**: Styling and responsiveness.
- **Vanilla JavaScript**: Dynamic functionalities and API integration.

---

## Setup and Installation

### Prerequisites
- A web browser (e.g., Chrome, Firefox)
- A code editor (e.g., Visual Studio Code)
- Node.js and npm installed

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Seldir193/coderr-frontend.git
   cd coderr-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the project**:
   ```bash
   npm start
   ```

The application will run on a local server (e.g., `http://localhost:3000`).

---

## Project Structure

### HTML Files
- **index.html**: Main landing page.
- **login.html**: User login functionality.
- **registration.html**: User registration.
- **offer_list.html**: Displays available offers.
- **offer.html**: Detailed view of a specific offer.
- **business_profile.html**: Profile management for providers.
- **customer_profile.html**: Profile management for customers.
- **own_profile.html**: User-specific profile page.
- **imprint.html**: Website's imprint page.
- **privacy_policy.html**: Privacy policy page.

### JavaScript Files

#### Core Logic
- **index.js**: Logic for the landing page.
- **login.js**: Implements login functionality.
- **registration.js**: Manages user registration.
- **profile.js**: Contains profile management logic.
- **offer_list.js**: Logic for displaying and filtering offers.
- **single_offer.js**: Controls the detailed view of individual offers.

#### CRUD Operations
- **offer_crud.js**: Create, update, and delete offers.
- **review_crud.js**: Manage reviews.
- **order_crud.js**: Create and update the status of orders.

#### Helper Functions
- **ui_helpers.js**: General UI functions (e.g., show/hide elements).
- **form_helper.js**: Form validation and data extraction.
- **redirect.js**: Handles page redirection.

#### API Integration
- **api.js**: Interface for API calls.
- **auth.js**: Authentication and token management.

#### Templates
- **header_templates.js**: Templates for headers.
- **offer_templates.js**: Templates for offer pages.
- **review_templates.js**: Templates for reviews.

---

## Features

- **User Management**:
  - Registration, login, and logout.
  - Role-based access for customers and providers.

- **Offers**:
  - Create, update, and delete offers.
  - Dynamic search and filtering of offers.

- **Orders**:
  - View and manage orders.
  - Pagination for large datasets.

- **Reviews**:
  - Add, edit, and delete reviews.

- **Responsive Design**:
  - Optimized for both mobile and desktop devices.

---

## API Integration

### Authentication
- **POST** `/registration/`: Register a new user.
- **POST** `/login/`: Log in a user.

### Offers
- **GET** `/offers/`: Retrieve a list of all offers.
- **POST** `/offers/`: Create a new offer.
- **GET** `/offers/<id>/`: Retrieve details of an offer.

### Reviews
- **GET** `/reviews/`: Retrieve a list of all reviews.
- **POST** `/reviews/`: Create a new review.

Other API endpoints are described in the backend documentation.

---

## Error Handling

### Common Issues

1. **API Errors**:
   - Cause: Invalid endpoints or missing authentication tokens.
   - Solution: Ensure the correct API URLs are used and valid tokens are included.

2. **UI Loading Errors**:
   - Cause: Missing elements in the DOM.
   - Solution: Check the HTML structure and ensure all required elements are loaded.

3. **Form Validation Errors**:
   - Cause: Missing or invalid data in forms.
   - Solution: Implement validation before submission.

---

## Testing

### Manual Tests
1. Open the project in the browser with `npm start`.
2. Test each page for responsiveness, functionality, and API integration.

---

## License

This project is licensed under the MIT License. For more details, see the [LICENSE](LICENSE) file.
