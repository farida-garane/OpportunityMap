# 🗺️ OpportuniMap

**Centralizing professional opportunities in Burkina Faso — for equitable access to information.**

Project submitted for the *"Global Challenges, Local Solutions"* hackathon on Devpost.

---

## The Problem

In Burkina Faso, access to professional opportunities (internships, competitions, trainings, events) is unequal:

- Opportunities are concentrated in major cities, especially Ouagadougou.
- Information circulates mostly by word-of-mouth, WhatsApp, or Facebook.
- Students from other regions are disadvantaged, not due to a lack of merit, but a lack of access to information.
- There is no single platform that centralizes these opportunities.

## The Solution

**OpportuniMap** centralizes, organizes, and broadcasts professional and educational opportunities in one place, featuring smart filtering and geolocation for more equitable access to information across the country.

![Home page](screenshots/home.png)

## Features

| Feature | Description |
|---|---|
| Centralization | Internships, competitions, trainings, and events grouped in a single place |
| Smart Filtering | Search by type, field, and city |
| Interactive Map | City-level overview + location per opportunity |
| Personalized Recommendations | Highlighted based on the user profile's field/city |
| Notifications | Alerts for new opportunities |
| Add Opportunities | Community publishing by users |
| Favorites | Save to apply later |
| Dashboard | Personal summary: favorites, publications, notifications |

![Opportunity list with filters](screenshots/opportunities.png)

![Opportunity map by city](screenshots/map.png)

## Tech Stack

**Backend**: Node.js, Express, PostgreSQL, JWT + bcrypt
**Frontend**: HTML / CSS / JavaScript, Leaflet + OpenStreetMap for the map

## Architecture

```
OpportunityMap/
├── backend/
│   ├── config/        # PostgreSQL Connection
│   ├── models/        # Table Declarations
│   ├── controllers/    # HTTP Requests/Responses
│   ├── services/       # Business Logic + SQL Queries
│   ├── routes/         # API Endpoints
│   ├── middleware/     # JWT Verification + Errors
│   ├── seeds/           # Demo Data
│   └── server.js
└── frontend/
    ├── pages/
    ├── css/
    └── js/
```

## Installation

```bash
cd backend
npm install
```

Create a `.env` file:
```env
DB_HOST=localhost
DB_USER=postgres
DB_NAME=opportunimap
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=a_long_secret_string
JWT_EXPIRES_IN=7d
PORT=5000
```

```bash
node seeds/seed-run.js   # populates the database with demo data
npm run dev
```

The frontend can be opened directly in a browser (`frontend/pages/index.html`) and communicates with the API at `http://localhost:5000/api`.

## Main API Endpoints

| Method | Endpoint | Protected? |
|---|---|---|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/opportunities` | No |
| POST | `/api/opportunities` | Yes |
| GET | `/api/favorites` | Yes |
| GET | `/api/notifications` | Yes |
| GET | `/api/dashboard` | Yes |

## Design Choices

- **Mock Data**: The demo uses mock opportunities, due to the lack of real partnerships established at this stage.
- **City-level Map Only**: Since the data is mock, the map displays the city rather than inventing a precise address, to remain honest about what is actually verifiable.
- **UUIDs rather than Sequential IDs**: Prevents guessing the existence of other records in the database.

![Opportunity details with location map](screenshots/details.png)

## Security

- Passwords hashed using `bcrypt`
- Parameterized SQL queries (preventing SQL injections)
- JWT Authentication for any create/update/delete action
- Ownership verification: only the creator can modify/delete their opportunity

## Current Project Status

- **Backend**: Complete and functional (authentication, opportunities, favorites, notifications, dashboard)
- **Frontend**: Home, list/filtering/map of opportunities, and publishing completed — registration, login, favorites, notifications, dashboard, and profile in progress

## AI Usage

This project was developed with the help of Antigravity, a code editor integrating artificial intelligence tools, used to structure the backend architecture, debug errors, clarify security best practices, and assist in frontend development. The design decisions and final implementation were carried out by Farida Garane, author of the project.