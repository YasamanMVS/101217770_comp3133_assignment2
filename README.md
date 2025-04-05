# Employee Management System

A full-stack application for managing employees with authentication, CRUD operations, and profile picture uploads.

## Project Structure

```
101217770_comp3133_assignment2/
├── backend/               # Node.js, Express, GraphQL backend
│   ├── src/              # Source code
│   ├── package.json      # Backend dependencies
│   ├── Dockerfile        # Backend Docker configuration
│   └── README.md         # Backend documentation
│
└── frontend/             # Angular frontend (to be added)
    └── README.md         # Frontend documentation
```

## Repository

GitHub Repository: [https://github.com/YasamanMVS/101217770_comp3133_assignment2.git](https://github.com/YasamanMVS/101217770_comp3133_assignment2.git)

## Features

- Admin authentication with JWT
- Employee CRUD operations
- Search employees by department or position
- Profile picture upload to AWS S3
- GraphQL API
- Dockerized deployment
- MongoDB Atlas Integration

## Database Configuration

The application uses MongoDB Atlas for database management:
- Database Name: `employee_management`
- Collections: 
  - `users` (for admin authentication)
  - `employees` (for employee data)

## Admin Credentials

```
Username: admin
Password: admin123
```

## Getting Started

### Backend

See [backend/README.md](backend/README.md) for backend setup and running instructions.

### Frontend

See [frontend/README.md](frontend/README.md) for frontend setup and running instructions (coming soon).

## Environment Setup

Create a `.env` file in the backend directory with the following variables:

```env
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.b7ccyfh.mongodb.net/employee_management?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
```

Note: Contact the repository owner for the MongoDB credentials.

Author: 
Yasaman Mirvahabi Sabet
Student ID: 101217770