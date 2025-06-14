# 🚀 Welcome to CodeNebula

**CodeNebula** is a modern full stack web application designed for real-time head-to-head coding challenges. It enables users to stake ETH via blockchain integration, compete on programming problems, and win rewards — all in a secure, AI-assisted environment.

> _This is not just a game — it's a next-generation coding battleground driven by AI and Web3._


🌐 Website Link: [Click Here!](https://codenebula.onrender.com)  
🐳 Docker Images:  
- `codenebula-client`  
- `codenebula-server`  
- `codenebula-api`

---

## 💡 CodeNebula Empowers Users To:

- 🎯 Solve CP problems to win ETH  
- 🧠 Get intelligent, non-code hints powered by LLM agents  
- 🔐 Connect wallets, stake ETH, and win real rewards  
- 👥 Add friends
- 🏆 Checkout Live Leaderboard

---

## 🌟 Project Overview

| Service | Description | Port |
|---------|-------------|------|
| **Client** | React frontend built with Vite and Tailwind CSS | 5000 |
| **Server** | Node.js backend handling business logic and database interaction | 3000 |
| **API** | Python Flask API providing additional endpoints and services | 8000 |
| **MySQL** | Relational database for persistent storage | 3307 |

The services are containerized using Docker and managed with `docker-compose` for easy setup and development.

---

## 🎨 Fabulous Features

- 💻 **Modern React frontend** using TypeScript, Tailwind CSS, and Vite
- 🔒 **Secure Web3 authentication** and ETH staking
- 🧠 **AI-powered hint system** using LangChain + Groq + Mixtral
- 🛠️ **Robust backend** with Node.js, Express, and REST APIs
- 🧪 **Python Flask API** to generate problem statement and submit the code
- 🗃️ **MySQL database** with clean schema and indexing
- 🐳 **Full Docker support** with hot-reloading and volume mounting
- 📊 **Leaderboard** and user profile stats
- 👥 **Friend's Profile** system with complete stats 

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) (usually comes with Docker Desktop)

### Pull Prebuilt Docker Images

```
git clone https://github.com/snap-iitr/CodeNebula.git
docker pull codenebula-client
docker pull codenebula-server
docker pull codenebula-api
```

### Set Environment Variables

Create `.env` files in the respective folders (`client/`, `server/`, `api/`) with the necessary environment variables. Example variables for MySQL are set in the root `.env` file or your shell environment:

```env
DB_ROOT_PASSWORD=your_root_password
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

### Running the Application

From the root directory, run:

```bash
docker-compose up --build
```

This command will build and start all services. The client will be available at [http://localhost:5000](http://localhost:5000).

### Stopping the Application

To stop all running containers:

```bash
docker-compose down
```

---

## 🗂️ Folder Structure

```
/
├── client/       # React frontend application
├── server/       # Node.js backend server
├── api/          # Python Flask API service
├── docker-compose.yml  # Docker Compose configuration
├── init.sql      # MySQL initialization script
└── README.md     # This file
```

---

## ⚙️ Technologies Used

### 🖥️ Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### 🔧 Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

### 🧠 Python API
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Selenium](https://img.shields.io/badge/Selenium-43B02A?style=for-the-badge&logo=selenium&logoColor=white)

### 🗃️ Database
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

### 🐳 DevOps
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker--Compose-000000?style=for-the-badge&logo=docker&logoColor=white)

---

## 💡 Development Tips

- The client and server folders have volume mounts for live code reloading.
- Use `npm run dev` in the client for local frontend development.
- Use `npm start` in the server for local backend development.
- The API service runs with Flask in development mode.
- MySQL data is persisted in a Docker volume named `mysql_data`.

---

## 📞 Contact

For questions or support, please open an issue or contact at `souravsingla335@gmail.com`

---

<p align="center"><b>Made with ❤️ by Sourav</b></p>
