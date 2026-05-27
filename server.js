const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const botBrain = require('./botBrain');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const applicationRoutes = require('./routes/applications');
const dashboardRoutes = require('./routes/dashboard');
const placementRoutes = require('./routes/placements');
const learningRoutes = require('./routes/learning');
const chatNotifyRoutes = require('./routes/chatNotify');
const mockTestRoutes = require('./routes/mocktests');
const interviewRoutes = require('./routes/interview');
const assessmentRoutes = require('./routes/assessment');

const app = express();

// FRONTEND CONNECT
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const db = require('../database/db');

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
    console.log('MySQL Connected! 🎓');

    // Auto-create tables on startup
    const tableQueries = [
        `CREATE TABLE IF NOT EXISTS chat_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(50) NOT NULL,
            user_name VARCHAR(100) DEFAULT '',
            sender_from VARCHAR(10) DEFAULT 'student',
            sender_name VARCHAR(100) DEFAULT '',
            msg TEXT NOT NULL,
            msg_time VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS mock_test_results (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(50) NOT NULL,
            test_name VARCHAR(150) NOT NULL,
            score VARCHAR(50) NOT NULL,
            status VARCHAR(30) NOT NULL,
            test_date VARCHAR(50) NOT NULL,
            duration VARCHAR(50) DEFAULT '',
            marks VARCHAR(50) DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS interview_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(50) NOT NULL,
            user_name VARCHAR(100) DEFAULT '',
            role VARCHAR(50) NOT NULL,
            difficulty VARCHAR(50) NOT NULL,
            question_set TEXT,
            responses TEXT,
            score DECIMAL(5,2) DEFAULT 0,
            status VARCHAR(30) DEFAULT 'in_progress',
            started_at VARCHAR(50),
            completed_at VARCHAR(50),
            report_summary TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS interview_answers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            session_id INT NOT NULL,
            question_index INT NOT NULL,
            question TEXT,
            answer TEXT,
            evaluation_score INT,
            evaluation_confidence INT,
            evaluation_communication INT,
            evaluation_feedback TEXT,
            answered_at VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
        )`
    ];

    tableQueries.forEach((query, index) => {
        db.query(query, (err) => {
            if (err) {
                console.error(`Table ${index} creation error:`, err.message);
            } else {
                console.log(`Table ${index} ready`);
            }
        });
    });

    server.listen(8000, () => {
        console.log('TCF Institute');
        console.log('Server running on http://localhost:8000');
    });
});

function dbSaveMsg(userId, userName, from, name, msg, time) {
    db.query(
        'INSERT INTO chat_messages (user_id, user_name, sender_from, sender_name, msg, msg_time) VALUES (?,?,?,?,?,?)',
        [userId, userName || '', from, name || '', msg, time],
        err => { if (err) console.error('Chat save error:', err.message); }
    );
}

app.get('/api/users', (req, res) => {
    db.query('SELECT id, full_name, email, phone, created_at FROM users', (err, results) => {
        if (err) return res.json({ success: false, message: err.message });
        res.json({ success: true, data: results });
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/chat', chatNotifyRoutes);
app.use('/api/mocktests', mockTestRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/assessments', assessmentRoutes);

const chatHistory = {};
const adminOnline = { status: false };
const onlineStudents = {};

io.on('connection', (socket) => {
    socket.on('student_join', ({ userId, userName, currentPage }) => {
        socket.join('student_' + userId);
        socket.userId = userId;
        socket.userName = userName;
        socket.isAdmin = false;
        onlineStudents[userId] = currentPage;

        db.query(
            'SELECT sender_from AS `from`, sender_name AS name, msg, msg_time AS time FROM chat_messages WHERE user_id=? ORDER BY created_at ASC',
            [userId],
            (err, rows) => {
                chatHistory[userId] = rows || [];
                socket.emit('chat_history', chatHistory[userId]);
            }
        );

        socket.emit('admin_status', { online: adminOnline.status });
        io.to('admin_room').emit('student_online', { userId, userName, currentPage });
    });

    socket.on('admin_join', () => {
        socket.join('admin_room');
        socket.isAdmin = true;
        adminOnline.status = true;
        io.emit('admin_status', { online: true });

        db.query(
            'SELECT user_id, user_name, sender_from AS `from`, sender_name AS name, msg, msg_time AS time FROM chat_messages ORDER BY user_id, created_at ASC',
            (err, rows) => {
                const grouped = {};
                (rows || []).forEach(r => {
                    if (!grouped[r.user_id]) {
                        grouped[r.user_id] = { userId: r.user_id, msgs: [] };
                    }
                    if (r.from === 'student' && !grouped[r.user_id].userName) {
                        grouped[r.user_id].userName = r.user_name || r.name;
                    }
                    grouped[r.user_id].msgs.push({ from: r.from, name: r.name, msg: r.msg, time: r.time });
                });

                Object.keys(grouped).forEach(uid => {
                    chatHistory[uid] = grouped[uid].msgs;
                    grouped[uid].userName = grouped[uid].userName || 'Student';
                    grouped[uid].currentPage = onlineStudents[uid] || null;
                });

                socket.emit('all_chats', Object.values(grouped));
            }
        );
    });

    socket.on('student_msg', ({ userId, userName, msg }) => {
        const time = new Date().toLocaleTimeString();
        const studentData = { from: 'student', name: userName, msg, time };
        if (!chatHistory[userId]) chatHistory[userId] = [];
        chatHistory[userId].push(studentData);

        dbSaveMsg(userId, userName, 'student', userName, msg, time);
        io.to('admin_room').emit('new_student_msg', { userId, userName, ...studentData });
        io.to('student_' + userId).emit('receive_msg', studentData);
    });

    socket.on('admin_msg', ({ userId, msg }) => {
        const data = { from: 'admin', name: '👨‍💼 Support Team', msg, time: new Date().toLocaleTimeString() };
        if (!chatHistory[userId]) chatHistory[userId] = [];
        chatHistory[userId].push(data);

        const studentName = (chatHistory[userId].find(m => m.from === 'student'))?.name || 'Student';
        dbSaveMsg(userId, studentName, 'admin', '👨‍💼 Support Team', msg, data.time);

        io.to('student_' + userId).emit('receive_msg', data);
        io.to('admin_room').emit('receive_msg', { userId, ...data });
    });

    socket.on('disconnect', () => {
        if (socket.isAdmin) {
            adminOnline.status = false;
            io.emit('admin_status', { online: false });
        }
        if (socket.userId && !socket.isAdmin) {
            delete onlineStudents[socket.userId];
            io.to('admin_room').emit('student_offline', { userId: socket.userId });
        }
    });
});