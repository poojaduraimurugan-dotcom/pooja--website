const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tcf_institute'
});

db.connect(err => {
    if (err) { console.error('Connection failed:', err.message); return; }
    console.log('MySQL Connected!');

    db.query(`CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, err => { if(err) console.error(err.message); else console.log('users table ready'); });

    db.query(`CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2),
        description TEXT
    )`, err => { if(err) console.error(err.message); else console.log('courses table ready'); });

    db.query(`CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        course_id INT,
        full_name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(15),
        qualification VARCHAR(100),
        status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, err => { if(err) console.error(err.message); else console.log('applications table ready'); });

    db.query(`CREATE TABLE IF NOT EXISTS student_dashboard (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        course_name VARCHAR(100),
        attendance INT DEFAULT 0,
        status ENUM('Active','Inactive','Completed') DEFAULT 'Active'
    )`, err => { if(err) console.error(err.message); else console.log('student_dashboard table ready'); });

    db.query(`CREATE TABLE IF NOT EXISTS placements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_name VARCHAR(100),
        company_name VARCHAR(100),
        role VARCHAR(100),
        placed_at DATE
    )`, err => { if(err) console.error(err.message); else console.log('placements table ready'); });

    db.query(`INSERT IGNORE INTO courses (id, course_name, price, description) VALUES
        (1, 'Web Development', 5000, 'HTML, CSS, JS, React, Node.js'),
        (2, 'Software Testing', 4500, 'Manual, Automation, Selenium'),
        (3, 'Data Analytics', 3000, 'Python, SQL, Power BI, Excel'),
        (4, 'Python Programming', 4000, 'Python, OOP, Django, Flask'),
        (5, 'Java Full Stack', 6000, 'Java, Spring Boot, Angular'),
        (6, 'AWS Cloud', 5500, 'EC2, S3, IAM, DevOps')
    `, err => { if(err) console.error(err.message); else console.log('Sample courses inserted!'); });

    db.query(`CREATE TABLE IF NOT EXISTS syllabus (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT,
        week INT,
        topic VARCHAR(200),
        description TEXT
    )`, err => {
        if(err) { console.error(err.message); return; }
        console.log('syllabus table ready');
        // Check if description column exists, if not add it
        db.query(`SHOW COLUMNS FROM syllabus LIKE 'description'`, (err, result) => {
            if(!err && result.length === 0){
                db.query(`ALTER TABLE syllabus ADD COLUMN description TEXT`, err => {
                    if(err) console.error('alter syllabus:', err.message);
                    else console.log('description column added');
                });
            }
        });
    });

    db.query(`CREATE TABLE IF NOT EXISTS quizzes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT,
        question TEXT,
        option_a VARCHAR(200),
        option_b VARCHAR(200),
        option_c VARCHAR(200),
        option_d VARCHAR(200),
        correct_answer CHAR(1)
    )`, err => { if(err) console.error(err.message); else console.log('quizzes table ready'); });

    db.query(`CREATE TABLE IF NOT EXISTS quiz_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        course_id INT,
        score INT,
        total INT,
        passed TINYINT(1) DEFAULT 0,
        taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, err => { if(err) console.error(err.message); else console.log('quiz_results table ready'); });

    db.query(`CREATE TABLE IF NOT EXISTS course_progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        course_id INT,
        progress INT DEFAULT 0,
        completed TINYINT(1) DEFAULT 0,
        UNIQUE KEY uq_user_course (user_id, course_id)
    )`, err => { if(err) console.error(err.message); else console.log('course_progress table ready'); });

    db.query(`CREATE TABLE IF NOT EXISTS topic_progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        course_id INT,
        topic_id INT,
        completed TINYINT(1) DEFAULT 0,
        completed_at TIMESTAMP NULL,
        UNIQUE KEY uq_user_topic (user_id, topic_id)
    )`, err => { if(err) console.error(err.message); else console.log('topic_progress table ready'); });

    setTimeout(() => {
        // Syllabus for Web Development (course_id=1)
        db.query('TRUNCATE TABLE syllabus', () => {
        db.query(`INSERT INTO syllabus (id,course_id,week,topic,description) VALUES
            (1,1,1,'HTML Basics','Tags, structure, forms, tables'),
            (2,1,2,'CSS Styling','Flexbox, Grid, animations'),
            (3,1,3,'JavaScript','DOM, events, ES6 features'),
            (4,1,4,'React JS','Components, hooks, state management'),
            (5,1,5,'Node.js & Express','REST APIs, middleware'),
            (6,1,6,'Database & Deployment','MySQL, MongoDB, hosting'),
            (7,2,1,'Testing Fundamentals','SDLC, STLC, test cases'),
            (8,2,2,'Manual Testing','Black box, white box, regression'),
            (9,2,3,'Selenium Basics','WebDriver, locators, XPath'),
            (10,2,4,'Automation Frameworks','TestNG, Maven, POM'),
            (11,2,5,'API Testing','Postman, REST API testing'),
            (12,2,6,'Performance Testing','JMeter, load testing'),
            (13,3,1,'Python for Data','NumPy, Pandas, Matplotlib'),
            (14,3,2,'SQL Queries','Joins, subqueries, aggregations'),
            (15,3,3,'Power BI','Dashboards, DAX, reports'),
            (16,3,4,'Excel Analytics','Pivot tables, VLOOKUP, charts'),
            (17,3,5,'Pandas & NumPy','Data manipulation, arrays'),
            (18,3,6,'Data Visualization','Matplotlib, Seaborn charts'),
            (19,4,1,'Python Basics','Variables, loops, functions'),
            (20,4,2,'OOP in Python','Classes, inheritance, polymorphism'),
            (21,4,3,'File Handling','Read, write, CSV, JSON, exceptions'),
            (22,4,4,'Python Projects','Games, scraper, REST API'),
            (23,4,5,'Django Basics','MVT, ORM, routing, forms'),
            (24,4,6,'Flask Basics','Routing, templates, SQLite'),
            (25,5,1,'Java Basics','Variables, loops, arrays, methods'),
            (26,5,2,'OOP in Java','Classes, inheritance, interfaces'),
            (27,5,3,'Spring Boot','REST API, JPA, controllers'),
            (28,5,4,'Hibernate & JPA','ORM, entity mapping, CRUD'),
            (29,5,5,'Angular Basics','Components, binding, services'),
            (30,5,6,'Java Projects','Full stack Spring Boot + Angular'),
            (31,6,1,'Cloud Fundamentals','AWS intro, regions, core services'),
            (32,6,2,'AWS Core Services','EC2, S3, RDS, VPC'),
            (33,6,3,'IAM & Security','Users, roles, policies, MFA'),
            (34,6,4,'S3 & Storage','Buckets, policies, static hosting'),
            (35,6,5,'EC2 & Networking','Instances, security groups, ELB'),
            (36,6,6,'DevOps on AWS','CI/CD, CodePipeline, Docker, ECS')
        `, err => { if(err) console.error(err.message); else console.log('Syllabus inserted!'); });
        });

        db.query('TRUNCATE TABLE quizzes', () => {
        db.query(`INSERT INTO quizzes (id,course_id,question,option_a,option_b,option_c,option_d,correct_answer) VALUES
            (1,1,'What does HTML stand for?','Hyper Text Markup Language','High Tech Modern Language','Hyper Transfer Markup Language','None','A'),
            (2,1,'Which CSS property controls text size?','font-weight','font-size','text-size','font-style','B'),
            (3,1,'Which keyword declares a variable in ES6?','var','int','let','define','C'),
            (4,1,'What is JSX in React?','A database','JavaScript XML syntax','A CSS framework','A server language','B'),
            (5,1,'Node.js runs on which engine?','SpiderMonkey','Chakra','V8','Nitro','C'),
            (6,1,'What is the purpose of CSS Flexbox?','Database management','Layout alignment','Server routing','File handling','B'),
            (7,2,'What is a test case?','A bug report','A set of conditions to verify software','A deployment script','A database query','B'),
            (8,2,'Selenium is used for?','Database testing','Manual testing','Automated browser testing','Load testing','C'),
            (9,2,'What is regression testing?','Testing new features','Re-testing after bug fixes','Performance testing','Security testing','B'),
            (10,2,'What tool is used for API testing?','Selenium','JMeter','Postman','TestNG','C'),
            (11,2,'What does STLC stand for?','Software Test Life Cycle','System Test Launch Cycle','Software Task List Check','None','A'),
            (12,2,'JMeter is used for?','Unit testing','Performance testing','UI testing','Code review','B'),
            (13,3,'Which library is used for data manipulation in Python?','NumPy','Pandas','Matplotlib','Seaborn','B'),
            (14,3,'SQL JOIN combines data from?','One table','Two or more tables','Only views','Only stored procedures','B'),
            (15,3,'What does DAX stand for in Power BI?','Data Analysis Expressions','Data Access Extension','Dynamic Array Excel','None','A'),
            (16,3,'Which function looks up values in Excel?','SUMIF','COUNTIF','VLOOKUP','INDEX','C'),
            (17,3,'Seaborn is built on top of?','Pandas','NumPy','Matplotlib','Scipy','C'),
            (18,3,'Which Pandas method reads a CSV file?','read_excel','read_csv','load_csv','import_csv','B'),
            (19,4,'Which keyword defines a function in Python?','func','define','def','function','C'),
            (20,4,'What is __init__ in Python?','A loop','A constructor method','A file reader','A module','B'),
            (21,4,'Which module handles file paths in Python?','os','sys','pathlib','Both A and C','D'),
            (22,4,'Django follows which pattern?','MVC','MVP','MVT','MVVM','C'),
            (23,4,'Flask is a?','Full framework','Micro framework','Database ORM','Testing tool','B'),
            (24,4,'Which method handles POST in Flask?','get','post','request.method','All','C'),
            (25,5,'Which is not a Java data type?','int','float','real','char','C'),
            (26,5,'What does OOP stand for?','Object Oriented Programming','Open Object Protocol','Ordered Output Process','None','A'),
            (27,5,'Spring Boot is used for?','Frontend development','Building REST APIs','Database design','Testing','B'),
            (28,5,'JPA stands for?','Java Persistence API','Java Process Application','Java Public Access','None','A'),
            (29,5,'Angular is a?','Backend framework','Database tool','Frontend framework','Testing tool','C'),
            (30,5,'JWT is used for?','Database queries','Authentication tokens','File uploads','Styling','B'),
            (31,6,'What does AWS stand for?','Amazon Web Services','Advanced Web System','Automated Web Server','None','A'),
            (32,6,'EC2 provides?','Object storage','Virtual machines','DNS service','Email service','B'),
            (33,6,'IAM stands for?','Identity and Access Management','Internet Access Module','Internal App Manager','None','A'),
            (34,6,'S3 is used for?','Running servers','Object storage','Database hosting','Networking','B'),
            (35,6,'Which AWS service is serverless compute?','EC2','RDS','Lambda','S3','C'),
            (36,6,'CodePipeline is used for?','Storage','CI/CD automation','Networking','Monitoring','B')
        `, err => { if(err) console.error(err.message); else console.log('Quizzes inserted!'); });
        });

        setTimeout(() => { db.end(); console.log('\nAll tables created! Now run: node server.js'); }, 1000);
    }, 2000);
});
