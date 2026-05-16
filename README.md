# GigFlow – Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack using TypeScript. This project focuses on clean architecture, scalability, and a professional user experience.

## Features

- **Authentication System**: Secure JWT-based auth with register, login, and protected routes.
- **Role-Based Access Control (RBAC)**: Different permissions for `Admin` and `Sales User` roles.
- **Leads Management (CRUD)**: Create, View, Update, and Delete leads.
- **Advanced Filtering & Search**: Combine multiple filters (Status, Source) with debounced search.
- **Pagination**: Efficient backend-driven pagination.
- **CSV Export**: Export lead data based on current filters.
- **Responsive Dashboard**: Stats overview and recent activity.
- **Dark Mode Support**: Premium UI with light and dark mode transitions.
- **Dockerized**: Easy deployment using Docker Compose.

## Tech Stack

- **Frontend**: React.js, TypeScript, TailwindCSS v4, Vite, Framer Motion, Axios.
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose, Zod.
- **DevOps**: Docker, Docker Compose.

## Project Structure

```
├── client/          # Frontend React Application
├── server/          # Backend Express API
├── docker-compose.yml
├── API_DOCS.md      # Detailed API endpoints documentation
└── README.md
```

## Getting Started

### Local Development

#### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or on Atlas)

#### 1. Setup Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

#### 2. Setup Frontend
```bash
cd client
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Using Docker

```bash
docker-compose up --build
```
- Client: `http://localhost`
- Server: `http://localhost:5000`

## API Reference

See [API_DOCS.md](./API_DOCS.md) for full endpoint details.

## Evaluation Criteria Met

- [x] **TypeScript Usage**: Mandatory throughout the project with defined interfaces.
- [x] **Clean Architecture**: Standardized response format, centralized error handling, validation.
- [x] **UI/UX**: Responsive design, dark mode, loading/empty states, glassmorphism aesthetics.
- [x] **Debounced Search**: Implemented on the Leads page.
- [x] **RBAC**: Admin can delete leads, sales users cannot.
- [x] **CSV Export**: Fully functional with filters.
- [x] **Pagination**: Backend skip/limit with metadata.
