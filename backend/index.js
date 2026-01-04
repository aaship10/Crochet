require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) 
    {
        return res.status(400).json({ error: "Name, email and password are required" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );
        res.json({message:"User registered!", user: result.rows[0]});
    }
    catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({ error: "Email already exists" });
        }
        res.status(500).send('Server Error');
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: "Login successful", token, user:{
            id: user.id,
            name: user.name,
            email: user.email
        } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Example API Route: Get all products
// app.get('/api/products', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });

// 4. Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});