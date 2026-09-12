# 🎵 GROOVBIT

> **Analog Soul. Digital Precision.**  
> A full-stack retro-minimalist music streaming platform combining 8-bit pixel aesthetics, interactive vinyl playback, and modern cloud media architecture.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongoosejs.com/)

---

## ✨ Features

- **🎛️ Interactive Vinyl Player**: Spinning turntable with animated tonearm and 40-bar dynamic sound waveform visualizer.
- **🎨 Pixel-Minimalist UI**: Dark charcoal aesthetic (`#1C1C1E`) featuring Google Pixelify & Silkscreen typography.
- **🎧 Global Audio Engine**: Seamless playback queue, drag-to-seek progress bar, and volume controls.
- **🎙️ Artist Studio**: Multipart file uploader for artists to publish audio tracks directly to CDN storage.
- **🔒 Secure Authentication**: Role-based access control (`listener` vs `artist`) via HTTP-only JWT cookies and password hashing.
- **📱 Responsive Full-Window Grid**: Integrated sidebar navigation, category pill filtering, and expanded "View All" track views.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Lucide Icons, HTML5 Web Audio API |
| **Backend** | Node.js, Express.js 5, MongoDB, Mongoose 9 |
| **Auth & Security** | JWT (`jsonwebtoken`), Cookie-Parser, BcryptJS |
| **Media Storage** | ImageKit SDK (Node.js), Multer (Memory Storage) |

---

## 📂 Repository Structure

```plaintext
groovbit/
├── backend/                  # RESTful API Server
│   ├── src/
│   │   ├── controllers/      # Auth & Music business logic
│   │   ├── midllewares/      # JWT & RBAC guards
│   │   ├── models/           # User, Music & Album schemas
│   │   ├── routes/           # Express endpoints
│   │   └── services/         # ImageKit storage service
│   ├── server.js             # Entry point (Port 3000)
│   └── package.json
│
└── frontend/                 # React Single Page Application
    ├── src/
    │   ├── components/       # Player, Vinyl, Studio & Nav UI
    │   ├── context/          # AudioContext & AuthContext
    │   ├── services/         # Axios API client
    │   └── App.jsx           # Main Dashboard
    ├── index.html
    └── package.json
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/groovbit
JWT_SECRET=your_jwt_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

Start the API server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📡 Core API Endpoints

| Method | Route | Access | Function |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new listener/artist account |
| `POST` | `/api/auth/login` | Public | Authenticate user & set JWT cookie |
| `POST` | `/api/auth/logout` | Auth | Clear active session |
| `GET` | `/api/music/` | Public | Fetch latest music tracks |
| `POST` | `/api/music/upload` | Artist | Upload audio track to ImageKit CDN |
| `POST` | `/api/music/album` | Artist | Create multi-track album |

---

## 📄 License

Distributed under the [ISC License](LICENSE).
