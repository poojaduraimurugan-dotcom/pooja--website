use tcf;
-- 1. Users table (login/signup)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Courses table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2),
    description TEXT
);

-- 3. Applications table (Apply Now form)
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    course_id INT,
    full_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(15),
    qualification VARCHAR(100),
    status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 4. Student dashboard table
CREATE TABLE student_dashboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    course_name VARCHAR(100),
    attendance INT DEFAULT 0,
    status ENUM('Active','Inactive','Completed') DEFAULT 'Active',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 5. Placements table
CREATE TABLE placements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100),
    company_name VARCHAR(100),
    role VARCHAR(100),
    placed_at DATE
);
