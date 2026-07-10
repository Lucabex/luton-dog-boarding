# Luton Dog Boarding

A full-stack web application for a real dog boarding and daycare business based in Luton, UK. Customers can register their dogs, request walks, daycare and overnight boarding, view a photo gallery of their pet's stay, and leave reviews. An admin side lets the business approve new clients, manage bookings, log daily activities and upload photos.

**Live site:** [lutondogboarding.co.uk](https://lutondogboarding.co.uk)

This is not a tutorial project. It runs an actual business end to end, so most of the design decisions came from a real operational need rather than a brief.

---

## Screenshots

> _Screenshots to be added._

| Home / booking | Admin dashboard |
| --- | --- |
| _(screenshot here)_ | _(screenshot here)_ |

---

## Tech stack

**Frontend**
- React 19 with Vite
- Component-based views with a shared React Context for cross-component state and refresh
- Plain CSS, organised per view

**Backend**
- ASP.NET Core 9 Web API
- Entity Framework Core with Npgsql (PostgreSQL)
- JWT bearer authentication
- BCrypt password hashing (BCrypt.Net-Next)
- Transactional email via Resend
- API documentation through Swagger and Scalar

**Database**
- PostgreSQL, with the schema managed through EF Core migrations

---

## Features

**Accounts and authentication.** Users register with their details and at least one dog, log in against a JWT-secured API, and can reset a forgotten password through an emailed reset code (the code is stored hashed, with an expiry). New customers start unapproved; the business has to approve them and mark an introductory meeting as done before full booking access opens up.

**Bookings.** The app supports three service types, each with its own rules. Walks are booked against a date and a time slot (morning, afternoon or evening). Boarding runs across a date range with a calculated number of nights. Daycare is booked for a single day. Availability is checked on the server so double-bookings are caught before they happen.

**Dogs.** Each dog carries the details that actually matter for care: breed, age, size, whether they are neutered and vaccinated, allergies, behaviour notes, an emergency contact and a photo.

**Photo gallery and activity logs.** Every booking can hold a set of photos uploaded by the business, so owners can see how their dog's stay is going. Daily activity logs record what happened and when.

**Reviews.** Customers can leave a rating and comment tied to a completed booking, which feeds the review display on the public site.

**Admin side.** Approving clients, viewing all bookings, adding activity logs, uploading gallery photos and managing the day-to-day all sit behind an admin flag on the user account.

---

## Project structure

```
luton-dog-boarding/
├── dogApi/DogWalkerApi/      ASP.NET Core API
│   ├── Controllers/          Auth, Booking, Dog, Gallery, Review, Availability
│   ├── Models/               User, Dog, Booking, Review, Gallery, Logs
│   ├── DTOs/                 Request/response shapes
│   ├── Data/                 EF Core DbContext
│   └── Migrations/           EF Core migrations
└── dogWalker/                React + Vite frontend
    └── src/
        ├── Views/            Page-level components
        ├── Css/              Per-view styles
        └── context.jsx       Shared state provider
```

---

## Running it locally

You will need the [.NET 9 SDK](https://dotnet.microsoft.com/download), [Node.js](https://nodejs.org/) and a running PostgreSQL instance.

### Backend

```bash
cd dogApi/DogWalkerApi
```

Create an `appsettings.json` next to `appsettings.example.json` and fill in your own values (this file is gitignored and never committed):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=dogboarding;Username=postgres;Password=YOUR_PASSWORD"
  },
  "Jwt": {
    "Key": "YOUR_JWT_SIGNING_KEY_AT_LEAST_32_CHARACTERS"
  },
  "Resend": {
    "ApiKey": "YOUR_RESEND_API_KEY"
  }
}
```

Then apply the migrations and run:

```bash
dotnet ef database update
dotnet run
```

The API starts on `http://localhost:5208`. In development, Swagger and Scalar API docs are available once it is running.

### Frontend

```bash
cd dogWalker
npm install
npm run dev
```

Vite serves the frontend on `http://localhost:5173`, which is already allowed by the API's CORS policy.

---

## Notes

This started as a way to run my own boarding business and grew into a full portfolio project. A few things are deliberately kept simple for local development — CORS origins and HTTPS redirection are configured for a dev setup rather than production — and tightening those is part of the ongoing work as the live deployment matures.

Built by [Luca](https://github.com/Lucabex) — final-year Software Engineering student and career changer, applying a background of high-standard, high-pressure professional kitchens to writing clean, maintainable software.
