# Employee Management System Backend

The backend server for the Employee Management System, built with Node.js, Express, GraphQL, and MongoDB Atlas.

## Technologies Used

- Node.js
- Express
- GraphQL (Apollo Server)
- MongoDB Atlas
- JWT Authentication
- AWS S3 (for file uploads)

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- AWS account (for S3 bucket)

## Database Configuration

The application uses MongoDB Atlas:
- Database Name: `employee_management`
- Collections: 
  - `users` (for admin authentication)
  - `employees` (for employee data)

## Admin User

Default admin credentials 
```
Username: admin
Password: admin123
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

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

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create admin user:
```bash
node src/scripts/createAdmin.js
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Docker
```bash
docker-compose up --build
```

## API Documentation

The GraphQL API will be available at `http://localhost:4000/graphql`

### Authentication

```graphql
mutation Login {
  login(username: "admin", password: "admin123") {
    token
    user {
      id
      username
      role
    }
  }
}
```

### Employee Operations

```graphql
# Create Employee
mutation CreateEmployee {
  createEmployee(
    firstName: "John"
    lastName: "Doe"
    email: "john@example.com"
    department: "IT"
    position: "Developer"
  ) {
    id
    firstName
    lastName
    email
    department
    position
  }
}

# Get All Employees
query GetEmployees {
  employees {
    id
    firstName
    lastName
    email
    department
    position
    profilePic
  }
}

# Search Employees
query SearchEmployees {
  searchEmployees(department: "IT", position: "Developer") {
    id
    firstName
    lastName
    email
    department
    position
  }
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files (AWS, etc.)
│   ├── graphql/        # GraphQL schema and resolvers
│   ├── middleware/     # Authentication middleware
│   ├── models/         # MongoDB models
│   ├── scripts/        # Utility scripts
│   └── index.js        # Main server file
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
└── Dockerfile         # Docker configuration
```

## Error Handling

The API includes comprehensive error handling for:
- Authentication errors
- Database errors
- Input validation
- File upload errors

## Security Features

- JWT-based authentication
- Password hashing
- Input sanitization
- Secure file uploads
- Environment variable protection


Author: 
Yasaman Mirvahabi Sabet
Student ID: 101217770