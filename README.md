# Laravel React Firebase 2FA Web Application

## Introduction

This project is a web application that incorporates user authentication with Firebase 2-Factor Authentication (2FA), a Laravel backend for handling API requests, and a React frontend for the user interface. The application features user registration, login, and a dashboard displaying the user's name and a list of products with CRUD functionalities.

## Features

- User registration with email, password, and phone number for 2FA.
- User login with email, password, and 2FA.
- Secure authentication using Laravel Passport.
- Dashboard displaying logged-in user's name and a list of products.
- CRUD operations for products.
- Responsive design.
- Clean and consistent UI/UX.

## Technologies Used

- Laravel 11
- React
- Firebase
- Laravel Passport

## Prerequisites

- PHP >= 8.3
- Composer
- Node.js
- NPM/Yarn
- Firebase account

## Installation

### Backend (Laravel)

1. **Clone the repository**
    ```bash
    git clone https://github.com/reshanmadushanka/react-product-app
    cd react-product-app
    ```

2. **Install dependencies**
    ```bash
    composer install
    ```

3. **Set up environment variables**
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

    Configure your `.env` file with your database and Firebase credentials.

4. **Run migrations**
    ```bash
    php artisan migrate
    ```

5. **Install Passport**
    ```bash
    php artisan passport:install
    ```

6. **Run the development server**
    ```bash
    php artisan serve
    ```

### Frontend (React)

1. **Navigate to the React directory**
    ```bash
    cd resources/js
    ```

2. **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Run the React development server**
    ```bash
    npm run dev
    # or
    yarn run dev
    ```

## Firebase Configuration

1. **Go to the Firebase Console**
    - Create a new project.
    - Enable Authentication and set up sign-in methods for Email/Password and Phone.

2. **Get Firebase Configuration**
    - Go to Project Settings.
    - Copy the Firebase SDK snippet (config object).
    - Set path FIREBASE_CREDENTIALS in env 

3. **Add Firebase Config to your project**
    - Create a file `firebase.js` in the `resources/js` directory and add the Firebase configuration.

    ```javascript
    // firebaseConfig.js
    import firebase from 'firebase/app';
    import 'firebase/auth';

    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
      measurementId: "YOUR_MEASUREMENT_ID"
    };

    firebase.initializeApp(firebaseConfig);

    export const auth = firebase.auth();
    ```

## API Endpoints

### User Registration

- **Endpoint:** `/api/register`
- **Method:** POST
- **Body Parameters:**
  - `name`: string
  - `email`: string
  - `password`: string
  - `phone`: string

### User Login

- **Endpoint:** `/api/login`
- **Method:** POST
- **Body Parameters:**
  - `email`: string
  - `password`: string

### 2FA Validation

- **Endpoint:** `/api/2fa-validate`
- **Method:** POST
- **Body Parameters:**
  - `token`: string

### Product CRUD

- **Endpoint:** `/api/products`
- **Method:** GET, POST, PUT, DELETE
- **Body Parameters:**
  - `name`: string (for POST and PUT)
  - `description`: string (for POST and PUT)
  - `price`: float (for POST and PUT)

## Usage

1. **Register a new user** through the registration page.
2. **Login** with the registered credentials and complete 2FA.
3. **Access the dashboard** to view, add, edit, and delete products.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
