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

## Features

- Admin authentication with JWT
- Employee CRUD operations
- Search employees by department or position
- Profile picture upload to AWS S3
- GraphQL API
- Dockerized deployment

## Getting Started

### Backend

See [backend/README.md](backend/README.md) for backend setup and running instructions.

### Frontend

See [frontend/README.md](frontend/README.md) for frontend setup and running instructions.

## Deployment

The application can be deployed to Vercel using the following steps:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy

## License

This project is licensed under the MIT License. 