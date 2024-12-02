# RBAC (Role-Based Access Control) Project

A full-stack Role-Based Access Control system with React frontend and Node.js backend.

## Features

### Backend
- User Authentication (Register/Login)
- Role-Based Access Control (Admin/User roles)
- JWT-based Authentication
- File Upload Support
- Error Handling
- API Response Formatting
- Secure Logout
- Role-specific Data Access

### Frontend
- Clean User Interface
- Role-based Dashboard
- Authentication Flows
  - Login
  - Register
  - Logout
- Permission-based Content Display
- Toast Notifications
- Responsive Design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for Authentication
- Multer for File Upload
- CORS Support

### Frontend
- React
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast
- React Hooks


## Getting Started

1. Clone the repository
2. Install dependencies for both frontend and backend:

# Backend
cd backend
npm install

# Frontend
cd frontend
npm install


## Features by Role

### Admin
- Full access to all features
- User management
- Content approval
- Analytics view
- Post management (create, edit, delete)

### User
- Basic feature access
- Create posts
- View own content
- Limited dashboard access

## API Endpoints

- POST `/api/v1/users/register` - User registration
- POST `/api/v1/users/login` - User login
- POST `/api/v1/users/logout` - User logout
- GET `/api/v1/users/current-user` - Get current user
- GET `/api/v1/users/role-data` - Get role-specific data

## Environment Variables


## Contributing

Feel free to submit issues and enhancement requests.

## License

MIT License