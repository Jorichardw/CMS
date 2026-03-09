# CMS PORTAL — Mini Project

A clean, modular **Company Management System** portal built as a GitHub-ready mini project.

## 📁 Project Structure

```
cms-portal-mini-project/
│
├── frontend/                   # Static HTML/CSS/JS front-end
│   ├── index.html              # Dashboard
│   ├── employees.html          # Employee & Payroll
│   ├── attendance.html         # Attendance & Leave
│   ├── tasks.html              # Kanban Task Board
│   ├── analytics.html          # Analytics & Reports
│   │
│   ├── css/
│   │   └── styles.css          # Global extracted styles
│   │
│   └── js/
│       ├── api.js              # Centralised fetch API client
│       ├── auth.js             # Sidebar toggle + session utils
│       ├── employees.js        # Employee table, filter, pagination
│       ├── attendance.js       # Leave requests, approve/reject
│       ├── tasks.js            # Kanban board + drag-and-drop
│       └── analytics.js        # Report generator, chart stubs
│
├── backend/                    # Node.js + Express REST API
│   ├── server.js               # Entry point
│   ├── routes/                 # Route definitions
│   │   ├── auth.js
│   │   ├── employees.js
│   │   ├── attendance.js
│   │   ├── tasks.js
│   │   └── analytics.js
│   ├── controllers/            # Business logic
│   │   ├── authController.js
│   │   ├── employeesController.js
│   │   ├── attendanceController.js
│   │   ├── tasksController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   └── errorHandler.js     # 404 + global error handler
│   └── db/
│       └── connection.js       # MySQL2 connection pool
│
├── database/
│   └── schema.sql              # Full MySQL schema + seed data
│
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Open the Frontend (No Server Needed)
Simply open `frontend/index.html` in your browser. All 5 pages are fully functional as a static UI.

### 2. Run the Backend API

**Prerequisites:** Node.js ≥ 18, MySQL 8+

```bash
# Install dependencies
npm install

# Set up the database
mysql -u root -p < database/schema.sql

# Configure environment (copy and edit)
cp .env.example .env

# Start dev server with hot-reload
npm run dev

# Or production
npm start
```

The API runs at `http://localhost:3000`.

### 3. Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES=8h
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cms_portal
CORS_ORIGIN=http://127.0.0.1:5500
```

---

## 🌐 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Login → returns JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/employees` | List employees (paginated, filterable) |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| POST | `/api/employees/payroll/run` | Run payroll |
| GET | `/api/employees/export/csv` | Export CSV |
| GET | `/api/attendance` | Attendance records |
| GET | `/api/attendance/leave-requests` | Pending leave requests |
| PUT | `/api/attendance/leave-requests/:id/approve` | Approve leave |
| PUT | `/api/attendance/leave-requests/:id/reject` | Reject leave |
| GET | `/api/tasks` | All tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id/status` | Move Kanban card |
| GET | `/api/analytics/financial` | Revenue vs Costs data |
| POST | `/api/analytics/report` | Generate report |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend UI | HTML5, TailwindCSS (CDN), Vanilla JS |
| Icons | Google Material Symbols |
| Font | Inter (Google Fonts) |
| Backend | Node.js, Express.js |
| Auth | JWT + bcryptjs |
| Database | MySQL 8 (mysql2 driver) |
| Dev Server | Nodemon |

---

## 📄 License

MIT © CMS Portal Project
