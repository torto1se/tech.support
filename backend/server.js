const express = require('express');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001; 

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./database.db', (err) => {
    if(err) {
        console.error(err.message);
    }
    console.log('Успешное подключение к БД!');
});



app.post('/registration', (req, res) => {
    const { id_department, password, full_name, phone, email } = req.body;

    // Проверка на существование пользователя по email
    db.get(`SELECT * FROM user WHERE email = ?`, [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует!' });
        }

        // Хэширование пароля
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Исправленный запрос на вставку
            db.run(`INSERT INTO user (id_role, id_department, password, full_name, phone, email) VALUES (?, ?, ?, ?, ?, ?)`,
                [1, id_department, hash, full_name, phone, email],
                function(err) {
                    if (err) {
                        return res.status(400).json({ error: err.message });
                    }
                    res.status(201).json({ message: 'Пользователь зарегистрирован', userId: this.lastID });
                }
            );
        });
    });
});

app.post('/login', (req, res) => {
    const {email, password} = req.body;

    db.get(`select * from user where email = ?`, [email], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ messsage: 'Неверный email или пароль'});
        }

        bcrypt.compare(password, user.password, (err, match) => {
            if (!match) {
                return res.status(401).json({message: 'Неверный email или пароль'});
            }

            const token = jwt.sign({ userId: user.id, email: user.email}, 'secret_key', {expiresIn: '1h'});
            res.json({token});
        })
    })
})

app.post('/task', (req, res) => {
    const {description, id_category} = req.body;

    const token = req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(401).json({message: 'Необходима авторизация'});
    }

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if(err) {
            return res.status(401).json({message: 'Неверный токен'});
        }

        const id_user = decoded.userId;

        db.get(`select full_name, id_role, id_department from user where id = ?`, [id_user], (err, user) => {
            if (err || !user) {
                return res.status(404).json({message: 'Пользователь не найден'});
            }
            const {full_name, id_role, id_department} = user;
            const id_status = 1;

            db.run(`insert into task (id_user, id_category, id_status, description) VALUES (?, ?, ?, ?)`,
                [id_user, id_category, id_status, description],
                function(err) {
                    if(err) {
                        return res.status(400).json({ error: err.message});
                    }
                    res.status(201).json({message: 'Задача создана', taskId: this.lastID});
                })
        })
    })
})


app.get('/task', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Необходима авторизация' });
    }

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Неверный токен' });
        }

        // Получаем задачи для пользователя
        db.all(`
            SELECT 
                task.id AS task_id,
                task.description,
                task.id_category,
                task.id_status,
                user.full_name,
                category.name AS category_name,
                status.name AS status_name
            FROM 
                task 
            JOIN 
                user ON task.id_user = user.id 
            JOIN 
                category ON task.id_category = category.id
            JOIN 
                status ON task.id_status = status.id
            WHERE 
                task.id_user = ?`, [decoded.userId], (err, rows) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.json(rows);
        });
    });
});



app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
