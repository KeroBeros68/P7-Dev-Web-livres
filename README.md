# 📚 Mon Vieux Grimoire

This project is part of the **OpenClassrooms Web Developer path**.  
It is based on the **Mon Vieux Grimoire** application, a book rating platform where users can browse books, add new ones, and rate them.

## 🧰 Tech Stack

### Front-end
- **React**
- **React Router**
- **Axios**
- **CSS**

### Back-end
- **Node.js**
- **Express**
- **MongoDB / Mongoose**
- **JWT authentication**
- **Multer**
- **Sharp**

---

## 📁 Project Structure

```bash
OC-Mon_Vieux_Grimoire/
├── Backend/
└── Frontend/
```

- `Frontend/` contains the user interface built with React.
- `Backend/` contains the REST API, authentication, image handling, and database logic.

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/KeroBeros68/OC-Mon_Vieux_Grimoire.git
cd OC-Mon_Vieux_Grimoire
```

---

## 💻 Run the front-end

Go to the `Frontend` folder:

```bash
cd Frontend
npm install
npm start
```

The front-end runs locally with the React development server.

---

## 🔧 Run the back-end

Open a new terminal, then go to the `Backend` folder:

```bash
cd Backend
npm install
node server.js
```

By default, the back-end runs on:

```bash
http://localhost:4000
```

---

## ⚙️ Environment Variables

The back-end uses an `.env` file located in:

```bash
Backend/config/.env
```

You need to define the required environment variables, such as:

- `PORT`
- `DB_URL`
- authentication-related secrets if needed

Example:

```env
PORT=4000
DB_URL=your_mongodb_connection_string
TOKEN_SECRET=your_secret_key
```

> ⚠️ Never expose your real secrets in a public repository.

---

## 🔐 Main Features

- 👤 User signup and login
- 🔑 Authentication with token-based security
- 📚 Book management
- ⭐ Book rating system
- 🖼️ Image upload and optimization
- 🛡️ Request sanitization and rate limiting

---

## 📡 API Overview

Main API routes include:

- `/api/auth` → user authentication
- `/api/books` → books management
- `/images` → static images access

---

## ✅ Prerequisites

Before running this project, make sure you have:

- **Node.js**
- **npm**
- **MongoDB** database access

---

## 📝 Notes

- The front-end was tested on **Node 19**.
- The repository contains both the client and server parts of the project.
- Make sure the back-end is running before using the front-end.

---

## 🎓 OpenClassrooms Project

This repository is a project completed as part of the **OpenClassrooms Web Developer program**.

---

## 👨‍💻 Author

Project by **KeroBeros68**

---

## ⭐ If you like this project

Feel free to star the repository and explore the codebase 🙂
