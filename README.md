# 🌐 URL Crawler App

A full-stack web application to crawl and analyze URLs, built with:

- ⚛️ **Frontend**: React + Vite + Tailwind CSS
- 🔙 **Backend**: Go (Golang), GORM (MySQL ORM), JWT Auth
- 📊 **Dashboard**: Interactive UI for viewing and analyzing website data

---

## 🚀 Features

### 🧑‍💼 Authentication

- Login / Register pages
- Protected routes (JWT-based)

### 🔍 URL Management

- Add, update, delete, or re-analyze URLs
- View URL details (HTML version, links, headers, etc.)

### 📊 Dashboard

- Real-time crawling status
- Filterable + paginated table
- Link charts (internal/external/broken)
- Search + View-by-ID

---

## 🛠 Tech Stack

| Layer    | Tech                         |
| -------- | ---------------------------- |
| Frontend | React, Vite, Tailwind CSS    |
| Backend  | Go, GORM, MySQL, JWT         |
| Auth     | JWT (stored in localStorage) |
| Charts   | Recharts                     |
| Testing  | Vitest + Testing Library     |

---

## 📁 Folder Structure

```
url-crawler-app/
├── frontend/             # React app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── UrlManager.tsx
│   │   ├── components/
│   │   ├── api/axios.ts
│   │   └── App.tsx
│   └── ...
├── backend/              # Go server
│   ├── main.go
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── config/
├── README.md
```

---

## 📦 Installation & Setup

### Clone the Repository

git clone https://github.com/engislam95/url-crawler-app.git
cd url-crawler-app

### 🔧 Backend (Go + MySQL)

```bash
cd backend
go mod tidy

# Make sure MySQL is running with the following credentials (used in config.go):
# Host:     127.0.0.1
# Port:     3306
# Username: root
# Password: 123456
# Database: webcrawler

# If the database doesn't exist yet, create it manually:
# CREATE DATABASE webcrawler;


go run main.go
```

- Server: `http://localhost:8080`
- Endpoints:
  - `POST /login`
  - `POST /register`
  - `GET /urls`
  - `GET /urls/:id`
  - `POST /urls`
  - `DELETE /urls/:id`

---

### 🧑‍💻 Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

- App: `http://localhost:3000`
- Routes:
  - `/` – Login
  - `/register` – Register
  - `/dashboard` – Overview + charts
  - `/url-manager` – List of URLs

---

## 🔐 Auth Flow

- JWT is returned from backend upon login
- Token is stored in localStorage
- Protected routes check token existence
- Token is sent via `Authorization: Bearer <token>` in requests

---

## 🧪 Testing

```bash
cd frontend
npm run test
```

Simple unit tests cover:

- Form rendering
- Login form submission
- Auth redirects
- Table data rendering

---

## 🧔 Author

**Islam Baidaq**  
Senior Software Engineer / FrontEnd Engineer
🇩🇪 Based in Munich – [GitHub](https://github.com/engislam95)

---

## 📄 License

MIT
