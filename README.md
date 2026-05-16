# WasteZero 🌍

WasteZero is a professional full-stack platform designed to revolutionize waste management and recycling. Built with the MERN stack (Node.js, Express, MongoDB) and Angular, it empowers citizens to schedule pickups, enables volunteers to manage recycling efforts, and provides admins with comprehensive oversight.

## 🚀 Features

### For Citizens
- **Pickup Scheduling**: Easily request waste pickups for various categories (Plastic, Organic, E-Waste, etc.).
- **Track Status**: Monitor your pickup requests from "Open" to "Completed".
- **Personal Profile**: Manage your location and contact details.

### For Volunteers (Pickup Agents)
- **Claim Pickups**: View and accept open pickup requests in your area.
- **Real-time Updates**: Status updates are synced instantly using Socket.io.
- **Performance Tracking**: View your completed pickups and contributions.

### For Administrators
- **Dashboard Analytics**: High-level overview of total pickups, volunteers, and applications.
- **User Management**: Activate or suspend user accounts.
- **Comprehensive Reports**: Generate and export CSV reports on platform activity.
- **Opportunity Management**: Create and manage volunteering opportunities.

## 🛠️ Tech Stack

- **Frontend**: Angular 18+, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (Atlas)
- **Real-time**: Socket.io
- **Hosting**: Render (Backend), Vercel (Frontend)

## 📦 Project Structure

- `wastezero-backend/`: Express server, API routes, and Socket.io logic.
- `wastezero-frontend/`: Angular SPA with a modern, responsive UI.

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account

### Backend Setup
1. Navigate to `wastezero-backend/`
2. Install dependencies: `npm install`
3. Create a `.env` file with:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   FRONTEND_URL=http://localhost:4200
   ```
4. Start the server: `npm start`

### Frontend Setup
1. Navigate to `wastezero-frontend/`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Access at `http://localhost:4200`

## 📄 License

This project is part of a Milestone submission. All rights reserved.