

# User Authentication API

This project is a robust authentication system built with **Nest.js**, **TypeORM**, and **JWT**, providing the following features:

- **User Signup and Signin**  
- **OAuth Integration** with LinkedIn and Google  
- **Secure JWT-based Authentication**

## Features

1. **User Signup**  
   Users can register with their email and password.

2. **User Signin**  
   Registered users can log in with their credentials.

3. **OAuth Integration**  
   Users can authenticate via LinkedIn or Google using OAuth.

4. **JWT-based Authorization**  
   Secure authentication using JSON Web Tokens (JWT).

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)  
- [Nest.js CLI](https://docs.nestjs.com/cli/overview)  
- [PostgreSQL](https://www.postgresql.org/)  
- [Google API Console](https://console.developers.google.com/) credentials  
- [LinkedIn Developer Console](https://www.linkedin.com/developers/) credentials

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/sahil-gulihar/jwt-assignment.git
cd auth-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following:
```env
# Application
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8080/auth/google/callback

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:8080/auth/linkedin/callback
```

### 4. Start the Server
```bash
npm run start:dev
```
The server will start at `http://localhost:3000`.

---

## API Endpoints

### Authentication Routes

| Method | Endpoint              | Description                 |
|--------|-----------------------|-----------------------------|
| POST   | `/auth/signup`        | Register a new user         |
| POST   | `/auth/signin`        | Authenticate a user         |
| GET    | `/auth/google`        | Redirect to Google OAuth    |
| GET    | `/auth/google/callback` | Google OAuth callback       |
| GET    | `/auth/linkedin`      | Redirect to LinkedIn OAuth  |
| GET    | `/auth/linkedin/callback` | LinkedIn OAuth callback    |

---



---

## Example Payloads

### Signup
```json
POST /auth/signup
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Signin
```json
POST /auth/signin
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

---

## OAuth Configuration

### Google OAuth
1. Go to the [Google API Console](https://console.developers.google.com/).
2. Create a project and enable the **Google+ API**.
3. Configure OAuth consent screen and create credentials for **Web Application**.
4. Copy the `Client ID` and `Client Secret` into the `.env` file.

### LinkedIn OAuth
1. Go to the [LinkedIn Developer Console](https://www.linkedin.com/developers/).
2. Create an application and configure OAuth permissions.
3. Copy the `Client ID` and `Client Secret` into the `.env` file.

---

## Security

- **Password Hashing**: User passwords are hashed using `bcrypt`.
- **JWT Expiry**: Tokens have a configurable expiration time.
- **OAuth Tokens**: Sensitive OAuth tokens are not stored in the database.

---

## Contributions

Contributions are welcome! Please submit a pull request or raise an issue.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Feel free to customize this README according to your project specifics!