# CareConnect Hospital Management

A simple full-stack hospital-management mini project made for academic submission. It offers a polished one-page interface with three main sections (home/services, online appointment booking, and contact) and an appointment API.

## Technology

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose (optional for demo mode)

## Run locally

1. Install Node.js (LTS) and MongoDB, or create a free MongoDB Atlas cluster.
2. Copy `.env.example` to `.env` and add a MongoDB connection string if you have one.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000`.

Without `MONGODB_URI`, it uses temporary in-memory storage. For persistent data, configure MongoDB.

## Deploy

The app is ready to deploy on Render. Create a Web Service from this repository, use `npm install` as the build command and `npm start` as the start command. Add `MONGODB_URI` in Render Environment Variables.
