# Employee Management System - Frontend

This is the frontend application for the Employee Management System, built with Angular 17 and Angular Material.

## Features

- User authentication with JWT
- Employee management (CRUD operations)
- File upload for employee photos
- Responsive design
- GraphQL integration
- Material Design components

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Angular CLI (v17 or later)
- Backend server running (see backend README)

## Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

## Frontend Structure
```
src/
├── app/
│   ├── core/                 # Core module (services, guards, interceptors)
│   │   ├── constants/        # Application constants
│   │   ├── guards/          # Route guards
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── models/          # TypeScript interfaces
│   │   └── services/        # Core services
│   ├── features/            # Feature modules
│   │   ├── auth/           # Authentication feature
│   │   └── employee/       # Employee management feature
│   ├── shared/             # Shared module (common components, directives, pipes)
│   └── app.module.ts       # Root module
├── assets/                 # Static assets
└── styles/                # Global styles
```

## Backend Integration

This frontend application connects to the Employee Management System backend, which provides:

- GraphQL API for data operations
- JWT authentication
- File upload capabilities

For detailed information about the backend API, refer to the [Backend README](../backend/README.md).

## Author  
Yasaman Mirvahabi Sabet  
Student ID: 101217770
