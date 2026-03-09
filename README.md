
# CMS PORTAL - Mini Project

A clean, modular **Company Management System** portal built as a mini project for the purpose of learning and understanding the working of a web application.

📁 Project Structure

CMS PORTAL - Mini Project/
│
├── frontend/                 
│   ├── index.html              
│   ├── employees.html          
│   ├── attendance.html         
│   ├── tasks.html              
│   ├── analytics.html         
│   │
│   ├── css/
│   │   └── styles.css         
│   │
│   └── js/
│       ├── api.js              
│       ├── auth.js            
│       ├── employees.js       
│       ├── attendance.js       
│       ├── tasks.js           
│       └── analytics.js        
│
├── backend/                    
│   ├── server.js               
│   ├── routes/                 
│   │   ├── auth.js
│   │   ├── employees.js
│   │   ├── attendance.js
│   │   ├── tasks.js
│   │   └── analytics.js
│   ├── controllers/            
│   │   ├── authController.js
│   │   ├── employeesController.js
│   │   ├── attendanceController.js
│   │   ├── tasksController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── auth.js             
│   │   └── errorHandler.js   
│   └── db/
│       └── connection.js       
│
├── database/
│   └── schema.sql             
│
├── package.json
└── README.md
```

---

🚀 Quick Start

1. Open the Frontend (No Server Needed)
Simply open `frontend/index.html` in your browser. All 5 pages are fully functional as a static UI.

2. Run the Backend API

**Prerequisites:** Node.js ≥ 18, MySQL 8+

>>bash
Install dependencies
npm install

>>Set up the database
mysql -u root -p < database/schema.sql

>>Configure environment (copy and edit)
cp .env.example .env

>>Start dev server with hot-reload
npm run dev

>>Or production
npm start

The API runs at `http://localhost:3000`.

3. Environment Variables

Create a `.env` file in the project root:

>>env
PORT=3000
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES=8h
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cms_portal
CORS_ORIGIN=http://127.0.0.1:5500


🌐 API Endpoints

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

🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend UI | HTML5, TailwindCSS (CDN), Vanilla JS |
| Icons | Google Material Symbols |
| Font | Inter (Google Fonts) |
| Backend | Node.js, Express.js |
| Auth | JWT + bcryptjs |
| Database | MySQL 8 (mysql2 driver) |
| Dev Server | Nodemon |

📄 License
MIT © CMS PORTAL - Mini Project Project
