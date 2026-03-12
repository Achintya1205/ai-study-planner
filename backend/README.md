# AI Study Planner - Backend

Backend API for the AI Study Planner application built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the root directory (already created) and update the values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/study-planner
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## Testing

Test if the server is running:
```bash
# Open browser or use curl
curl http://localhost:5000

# Health check
curl http://localhost:5000/api/health
```

## API Endpoints

### Base URL
```
http://localhost:5000
```

### Health Check
- `GET /api/health` - Check server status

### Authentication (Coming in next commit)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Subjects (Coming soon)
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create new subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Topics (Coming soon)
- Similar CRUD operations

### Tests (Coming soon)
- Similar CRUD operations

### Study Sessions (Coming soon)
- Similar CRUD operations

## Project Structure
```
backend/
├── server.js           # Main server file
├── .env               # Environment variables
├── .gitignore         # Git ignore file
├── package.json       # Dependencies
├── config/            # Configuration files (coming soon)
├── models/            # MongoDB models (coming soon)
├── routes/            # API routes (coming soon)
└── middleware/        # Custom middleware (coming soon)
```

## Next Steps

1. Install MongoDB locally or create MongoDB Atlas account
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the server
4. Test the API endpoints using Postman or curl