# GigFlow – Smart Leads Dashboard

🔗 **Live Demo:** https://gigflow-leads-dashboard.vercel.app/

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

```bash
├── client/          # Frontend React Application
├── server/          # Backend Express API
├── docker-compose.yml
├── API_DOCS.md      # Detailed API endpoints documentation
└── README.md
