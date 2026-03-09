-- CMS PORTAL - Mini Project — MySQL Database Schema

-- Create and configure database
CREATE DATABASE IF NOT EXISTS cms_portal;
USE cms_portal;

-- --------------------------------------------------------
-- Table Structure for `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'hr', 'manager', 'employee') DEFAULT 'employee'
);

-- --------------------------------------------------------
-- Table Structure for `employees`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active'
);

-- --------------------------------------------------------
-- Table Structure for `tasks`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo', 'in_progress', 'review', 'done') DEFAULT 'todo',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  assigned_to INT,
  deadline DATE,
  FOREIGN KEY (assigned_to) REFERENCES employees(employee_id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- Table Structure for `attendance`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('Present', 'Leave', 'Late', 'WFH') DEFAULT 'Present',
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  UNIQUE KEY unique_attendance (employee_id, date)
);

-- --------------------------------------------------------
-- Insert Sample Records
-- --------------------------------------------------------

-- Insert sample employees
INSERT INTO employees (name, department, salary, email, phone, status) VALUES
('Ravi Kumar', 'Engineering', 85000.00, 'ravi.kumar@example.com', '+91 9876543210', 'active'),
('Priya Sharma', 'Human Resources', 60000.00, 'priya.sharma@example.com', '+91 9876543211', 'active'),
('Arun Patel', 'Marketing', 55000.00, 'arun.patel@example.com', '+91 9876543212', 'active'),
('Sneha Desai', 'Engineering', 90000.00, 'sneha.desai@example.com', '+91 9876543213', 'active'),
('Vikram Singh', 'Sales', 65000.00, 'vikram.singh@example.com', '+91 9876543214', 'on_leave');

-- Insert sample users (Passwords would typically be hashed, using plain text representation for demonstration)
-- In a real application, you should use bcrypt to insert hashed passwords
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$wTf7h3FpwZ9VzW0f2rQzUeUXYx9XzXbA8e3rJpYF9lT2Q1e4a1YmG', 'admin'), -- Password: password123
('hr_priya', '$2a$10$wTf7h3FpwZ9VzW0f2rQzUeUXYx9XzXbA8e3rJpYF9lT2Q1e4a1YmG', 'hr'),
('manager_ravi', '$2a$10$wTf7h3FpwZ9VzW0f2rQzUeUXYx9XzXbA8e3rJpYF9lT2Q1e4a1YmG', 'manager'),
('emp_arun', '$2a$10$wTf7h3FpwZ9VzW0f2rQzUeUXYx9XzXbA8e3rJpYF9lT2Q1e4a1YmG', 'employee');

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, assigned_to, deadline) VALUES
('Update API endpoints', 'Migrate all backend endpoints to v2 architecture', 'in_progress', 'high', 1, '2026-03-15'),
('Quarterly HR Report', 'Compile the Q1 hiring and turnover statistics for management review', 'todo', 'medium', 2, '2026-03-20'),
('Launch ad campaign', 'Start the Facebook and Google ads for the summer product lineup', 'review', 'high', 3, '2026-03-10'),
('Fix login bug', 'Resolve issue #442 where users cannot reset passwords', 'done', 'high', 4, '2026-03-05'),
('Client sales pitch', 'Prepare presentation for the upcoming meeting with XYZ Corp', 'todo', 'medium', 5, '2026-03-18');

-- Insert sample attendance
INSERT INTO attendance (employee_id, date, status) VALUES
(1, CURRENT_DATE, 'Present'),
(2, CURRENT_DATE, 'Present'),
(3, CURRENT_DATE, 'WFH'),
(4, CURRENT_DATE, 'Late'),
(5, CURRENT_DATE, 'Leave'),
(1, DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), 'Present'),
(2, DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), 'Present'),
(3, DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), 'Present'),
(4, DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), 'WFH'),
(5, DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), 'Leave');
