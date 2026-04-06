
# Health

Health is a Node.js and Express project focused on emergency support features. It includes a simple emergency guidance frontend, a drug lookup API, and an ambulance allocation flow that finds the nearest available ambulance, marks it as booked, and notifies the assigned driver by email.

## Features
-----
- Emergency first-aid page in `frontend/html/emergency.html`
- Ambulance allocation using requester coordinates and stored ambulance locations
- Driver email notification after ambulance assignment
- MongoDB storage for ambulance records

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- Nodemailer
- External routing and medical APIs

## Run Locally

1. Install dependencies with `npm install`
2. Add required values in `.env`
3. Start the server with `node server.js`

## Important Environment Variables

- `PORT`
- `DB_LINK`
- `GMAIL_USER`
- `GMAIL_PASS`
- `OPENROUTESERVICE_API_KEY` or `ORS_API_KEY`
