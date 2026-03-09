-- =============================================================================
-- CMS Portal — MySQL Database Schema
-- database/schema.sql
-- Run: mysql -u root -p < database/schema.sql
-- =============================================================================

CREATE DATABASE IF NOT EXISTS cms_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cms_portal;

-- -----------------------------------------------------------------------------
-- Users (admin accounts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    username      VARCHAR(50)   NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    role          ENUM('System Admin','Manager','Viewer') DEFAULT 'Viewer',
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Seed default admin: password = "admin123"
INSERT IGNORE INTO users (name, username, password_hash, role) VALUES
('Bala', 'bala', '$2b$10$exampleHashHereReplaceWithRealBcryptHash', 'System Admin');

-- -----------------------------------------------------------------------------
-- Employees
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id     VARCHAR(20)   NOT NULL UNIQUE,
    name            VARCHAR(100)  NOT NULL,
    department      ENUM('Engineering','Design','Marketing','DevOps','HR','Operations') NOT NULL,
    status          ENUM('Active','On Leave','Inactive') DEFAULT 'Active',
    salary          DECIMAL(10,2) NOT NULL,
    payroll_status  ENUM('Paid','Processing','Pending') DEFAULT 'Pending',
    avatar_url      TEXT,
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed sample employees
INSERT IGNORE INTO employees (employee_id, name, department, status, salary, payroll_status) VALUES
('CMS-1024', 'Prem',      'Engineering', 'Active',   8400.00, 'Paid'),
('CMS-1102', 'Ezhil',     'Design',      'Active',   7200.00, 'Processing'),
('CMS-1056', 'Keerthana', 'Engineering', 'On Leave', 9100.00, 'Pending');

-- -----------------------------------------------------------------------------
-- Attendance
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id INT UNSIGNED NOT NULL,
    date        DATE         NOT NULL,
    status      ENUM('Present','Absent','Late','WFH') DEFAULT 'Present',
    check_in    TIME,
    check_out   TIME,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY uq_emp_date (employee_id, date)
);

-- -----------------------------------------------------------------------------
-- Leave Requests
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leave_requests (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id INT UNSIGNED NOT NULL,
    leave_type  ENUM('Sick Leave','Vacation','Personal','Maternity','Paternity') NOT NULL,
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    duration    INT  NOT NULL COMMENT 'Number of days',
    status      ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- Tasks (Kanban)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    category    VARCHAR(50),
    priority    ENUM('Low','Medium','High','Urgent') DEFAULT 'Medium',
    status      ENUM('todo','in-progress','review','completed') DEFAULT 'todo',
    progress    TINYINT UNSIGNED DEFAULT 0 COMMENT '0-100 percent',
    due_date    DATE,
    assigned_to INT UNSIGNED,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES employees(id) ON DELETE SET NULL
);

-- Seed sample tasks
INSERT IGNORE INTO tasks (id, title, category, priority, status, progress) VALUES
(1, 'Competitor Analysis for Q3 Product Update', 'Research',    'Medium', 'todo',        0),
(2, 'Update Brand Guidelines',                   'Design',      'Low',    'todo',        0),
(3, 'Fix Payload Bottleneck in Operations Module','Development', 'Urgent', 'in-progress', 45),
(4, 'Database Migration (AWS Region Shift)',      'DevOps',      'High',   'review',      90),
(5, 'Finalize Vendor Agreements',                 'Marketing',   'Medium', 'completed',   100);

-- -----------------------------------------------------------------------------
-- Analytics — Financial Overview
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS financial_overview (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    month       VARCHAR(10) NOT NULL,
    month_order TINYINT     NOT NULL,
    revenue     DECIMAL(12,2) NOT NULL,
    costs       DECIMAL(12,2) NOT NULL
);

INSERT IGNORE INTO financial_overview (month, month_order, revenue, costs) VALUES
('Jan', 1, 40000, 20000),
('Feb', 2, 50000, 25000),
('Mar', 3, 60000, 18000),
('Apr', 4, 55000, 30000),
('May', 5, 75000, 20000);

-- -----------------------------------------------------------------------------
-- Analytics — Expenditure Breakdown
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expenditure_breakdown (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    department  VARCHAR(50) NOT NULL,
    percentage  TINYINT     NOT NULL
);

INSERT IGNORE INTO expenditure_breakdown (department, percentage) VALUES
('Engineering', 42), ('Marketing', 28), ('Operations', 18), ('Others', 12);
