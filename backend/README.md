# Employee Management System

A full-stack application for managing employees with authentication, CRUD operations, and profile picture uploads.

## Features

- Admin authentication with JWT
- Employee CRUD operations
- Search employees by department or position
- Profile picture upload to AWS S3
- GraphQL API
- Dockerized deployment

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- AWS S3 bucket for profile pictures
- Docker and Docker Compose

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your_jwt_secret_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 101217770_comp3133_assignment2
```

2. Install dependencies:
```bash
npm install
```

3. Create admin user:
```bash
node src/scripts/createAdmin.js
```

## Running the Application

### Development Mode

1. Start MongoDB:
```bash
docker-compose up mongodb
```

2. Start the backend server:
```bash
npm run dev
```

### Production Mode with Docker

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

## Frontend

The frontend application will be developed using Angular and will be available at `http://localhost:4200`.

## Deployment

The application can be deployed to Vercel using the following steps:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy

## License

This project is licensed under the MIT License. 