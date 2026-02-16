# Backend API Documentation

Node.js + Express + MySQL backend for Skin Health Center.

## Setup

```bash
cd backend
npm install
npm run dev
```

Server starts on http://localhost:5000

## Database

MySQL credentials in `.env`:
- Host: localhost
- User: root
- Password: Adnan@123
- Database: skin_cancer_detection

Tables are auto-created on startup.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile

### Scans
- `GET /api/scans` - Get all scans (protected)
- `POST /api/scans` - Save scan (protected)
- `DELETE /api/scans/:id` - Delete scan (protected)
- `DELETE /api/scans` - Clear all scans (protected)

### Health
- `GET /api/health` - Server status

## Environment Variables

`.env` file:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Adnan@123
DB_NAME=skin_cancer_detection
DB_PORT=3306
PORT=5000
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

## Security

- Passwords hashed with bcrypt
- JWT tokens (7-day expiry)
- Protected routes with middleware
- CORS enabled for frontend only
- Input validation
- Parameterized SQL queries
