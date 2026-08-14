# 🎵 Spotify Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![ImageKit](https://img.shields.io/badge/Storage-ImageKit-0055FF?style=flat-square)](https://imagekit.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)

A lightweight, scalable RESTful API powering a music streaming platform. Built with **Node.js**, **Express 5**, **MongoDB**, and **ImageKit**, featuring role-based access control (RBAC), secure cookie-based JWT authentication, and media storage integration.

---

## 🌟 Key Features

- **Role-Based Access Control (RBAC)**: Distinct permissions for `user` (listeners) and `artist` (creators).
- **Authentication & Security**:
  - Secure password hashing using `bcryptjs` (salt rounds: 10).
  - Stateless JWT-based session handling transmitted via HTTP cookies.
- **Cloud Media Pipeline**:
  - In-memory audio file handling via `multer` to eliminate ephemeral disk overhead.
  - Direct audio asset upload and CDN delivery via **ImageKit**.
- **Catalog Management**:
  - Artists can upload music tracks and curate multi-track albums.
  - Relational schema modeling with Mongoose `populate` for high-performance querying.
  - Paginated music stream responses to optimize payload sizes.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime & Framework** | Node.js, Express.js (v5) |
| **Database & ODM** | MongoDB, Mongoose |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser` |
| **File Storage & CDN** | Multer (Memory Storage), ImageKit Node.js SDK |
| **Configuration** | Dotenv |

---

## 📂 Project Architecture

```plaintext
backend/
├── src/
│   ├── controllers/         # Request handlers & business logic
│   │   ├── auth.controllers.js
│   │   └── music.controllers.js
│   ├── db/                  # Database connection setup
│   │   └── db.js
│   ├── midllewares/         # Route protection & role verification
│   │   └── auth.middleware.js
│   ├── models/              # Mongoose schemas & data models
│   │   ├── album.model.js
│   │   ├── music.model.js
│   │   └── user.model.js
│   ├── routes/              # Express route declarations
│   │   ├── auth.routes.js
│   │   └── music.routes.js
│   ├── services/            # Third-party integrations (ImageKit)
│   │   └── storage.services.js
│   └── app.js               # Express application configuration
├── server.js                # Application entry point
├── package.json
└── .env.example             # Environment variable template
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)
- [ImageKit Account](https://imagekit.io/) (API credentials for media upload)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/spotify-backend.git
   cd spotify-backend/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file inside the `backend` directory based on `.env.example`:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/spotify
   JWT_SECRET=your_jwt_secret_key_here
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key_here
   ```

4. **Run the server**
   ```bash
   # Development mode (auto-reload via nodemon)
   npm run dev

   # Production mode
   npm start
   ```
   The API will be available at `http://localhost:3000`.

---

## 📡 API Reference

### 🔐 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user (`user` or `artist`). Sets auth cookie. |
| `POST` | `/api/auth/login` | Public | Authenticate user via username/email & password. Sets auth cookie. |
| `POST` | `/api/auth/logout` | Authenticated | Clears authentication cookie. |

#### Register Request Body:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "artist"
}
```

---

### 🎵 Music & Album Endpoints (`/api/music`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/music/upload` | `artist` only | Upload an audio file to ImageKit and save track metadata. |
| `POST` | `/api/music/album` | `artist` only | Create a new album with associated music IDs. |
| `GET` | `/api/music/` | `user` / `artist` | Fetch list of latest music tracks (with populated artist details). |
| `GET` | `/api/music/albums` | `user` / `artist` | Fetch all albums (summary view). |
| `GET` | `/api/music/albums/:albumId` | `user` / `artist` | Fetch complete album details with all nested tracks populated. |

#### Upload Music (`multipart/form-data`):
- `title`: Track Title (string)
- `music`: Audio File (binary)

---

## 🛡️ Security & Design Decisions

- **Cookie-Based Authentication**: Tokens are managed via HTTP cookies to streamline authenticated browser/client interactions.
- **In-Memory Buffering**: Audio streams are processed in memory using Multer before being forwarded directly to ImageKit, eliminating server disk exhaustion and cleanup overhead.
- **Strict Role Boundaries**: Explicit middleware guards (`authArtists`, `authUser`) ensure listener accounts cannot access creator endpoints.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
