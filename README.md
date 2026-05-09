# 🛠 Service Booking Platform - Backend

This is the backend server for the Service Booking Platform, built with Node.js, Express, and MongoDB.

## 🚀 Key Features
- **RESTful API**: Clean and documented API endpoints.
- **JWT Auth**: Secure authentication and authorization.
- **Payment Gateway**: Razorpay integration for processing payments.
- **Email Notifications**: Automated emails via Nodemailer.
- **Validation**: Input validation using Joi schemas.
- **Database**: Mongoose models for structured data storage.

## 📂 Folder Structure
- `config/`: Database and third-party service configurations.
- `controllers/`: Logic for handling API requests.
- `models/`: Mongoose schemas for Users, Services, Bookings, etc.
- `routes/`: Express router definitions.
- `middleware/`: Custom middlewares for authentication and error handling.
- `utils/`: Helper functions (email, payments).
- `validators/`: Joi validation schemas.

## ⚙️ Environment Variables
Create a `.env` file in this directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_smtp_email
EMAIL_PASS=your_smtp_password
```

## 🛠 Setup & Run
1. `npm install`
2. `npm run dev` (for development with nodemon)
3. `npm start` (for production)
