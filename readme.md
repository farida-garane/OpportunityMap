# OpportuniMap — Backend

OpportuniMap is a web platform that centralizes professional opportunities (internships, competitions, trainings, and events) for students in Burkina Faso, addressing unequal access to information between major cities and other regions.

Built for the "Global Challenges, Local Solutions" hackathon.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **Dev tool**: nodemon

## Project Structure

```
backend/
├── config/
│   └── db.js                  # PostgreSQL connection (pool)
├── models/                    # Table declarations (name + columns)
│   ├── User.js
│   ├── Opportunity.js
│   ├── Favorite.js
│   └── Notification.js
├── controllers/                # Handle HTTP requests/responses
│   ├── auth.controller.js
│   ├── opportunity.controller.js
│   ├── favorite.controller.js
│   ├── notification.controller.js
│   └── dashboard.controller.js
├── services/                  # Business logic + SQL queries
│   ├── auth.service.js
│   ├── opportunity.service.js
│   ├── favorite.service.js
│   ├── notification.service.js
│   └── dashboard.service.js
├── routes/                     # API endpoints
│   ├── auth.routes.js
│   ├── opportunity.routes.js
│   ├── favorite.routes.js
│   ├── notification.routes.js
│   └── dashboard.routes.js
├── middleware/
│   ├── auth.middleware.js      # Verifies JWT tokens on protected routes
│   └── error.middleware.js     # Global error handler
├── seeds/
│   ├── seed-data.js            # Fictional sample opportunities
│   └── seed-run.js             # Inserts sample data into the database
├── database/
│   └── create_database.sql     # Table creation script (run manually in PostgreSQL)
├── .env                        # Environment variables (not committed)
├── .gitignore
├── package.json
└── server.js                   # Entry point
```

## Features

1. Centralized opportunities (internships, competitions, trainings, events)
2. Smart filtering (type, field, city)
3. Map / geolocation
4. Personalized recommendations (based on user's field/city)
5. Notifications
6. Add opportunities (community-submitted)
7. Favorites
8. User dashboard (saved opportunities, published opportunities, notifications summary)

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in `backend/` with the following:

```env
DB_HOST=localhost
DB_USER=postgres
DB_NAME=opportunimap
DB_PASSWORD=your_postgresql_password
DB_PORT=5432

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d

PORT=5000
```

### 3. Create the database and tables

Open PostgreSQL (pgAdmin or terminal) and run the script in `database/create_database.sql`. This creates the `opportunimap` database, enables the `pgcrypto` extension (needed for UUID generation), and creates the 4 tables: `users`, `opportunities`, `favorites`, `notifications`.

### 4. Seed the database with sample data

```bash
node seeds/seed-run.js
```

This inserts 20 fictional opportunities so the app has data to display during testing/demo.

### 5. Start the server

```bash
npm run dev
```

The server starts on `http://localhost:5000` (or the port set in `.env`).

## API Endpoints Overview

| Method | Endpoint | Protected? | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create a new account |
| POST | `/api/auth/login` | No | Log in, returns a JWT token |
| GET | `/api/auth/profile` | Yes | Get logged-in user's profile |
| GET | `/api/opportunities` | No | List opportunities (supports `?type=&field=&city=` filters) |
| GET | `/api/opportunities/:id` | No | Get a single opportunity |
| POST | `/api/opportunities` | Yes | Create a new opportunity |
| PUT | `/api/opportunities/:id` | Yes | Update an opportunity (owner only) |
| DELETE | `/api/opportunities/:id` | Yes | Delete an opportunity (owner only) |
| GET | `/api/favorites` | Yes | List the logged-in user's favorites |
| POST | `/api/favorites/:opportunityId` | Yes | Add an opportunity to favorites |
| DELETE | `/api/favorites/:opportunityId` | Yes | Remove an opportunity from favorites |
| GET | `/api/notifications` | Yes | List the logged-in user's notifications |
| PUT | `/api/notifications/:id/read` | Yes | Mark a notification as read |
| GET | `/api/dashboard` | Yes | Get user summary (favorites count, published opportunities, unread notifications) |

Protected routes require an `Authorization: Bearer <token>` header, using the token returned by `/api/auth/login`.

## Security Notes

- Passwords are hashed with `bcrypt` before being stored — never stored in plain text.
- Primary keys use `UUID` (instead of sequential IDs) to prevent guessing/enumeration of records.
- All SQL queries use parameterized statements (`$1`, `$2`...) to prevent SQL injection.
- JWT tokens are required for any action that creates, modifies, or deletes data.

## Status

Backend: functional (routes, controllers, services, models, middleware, database, seed data).
Frontend: not yet started.

## AI Usage Disclosure

This project was developed with the assistance of Claude (Anthropic) for: structuring the backend architecture (routes/controllers/services/models), debugging PostgreSQL and Node.js errors, and clarifying security best practices (JWT, bcrypt, UUIDs, parameterized queries). All final code, architectural decisions, and implementation choices were made by the project author.