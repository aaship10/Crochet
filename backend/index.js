require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
const port = process.env.PORT || 5000;

// Middleware
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

// AUTH ROUTES
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

// PRODUCT ROUTES
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// CART ROUTES 

// 1. Add to Cart
app.post('/api/cart', async(req, res) => {
    const { product_id, name, price, colour, image } = req.body;
    console.log('product added to cart', [product_id, name, price, colour, image]);

    try {
        const existing = await pool.query('SELECT * FROM cart WHERE (product_id = $1 AND colour = $2)', [product_id, colour]);
        if (existing.rows.length > 0 ) {
            await pool.query('UPDATE cart SET quantity = quantity + 1 WHERE (product_id = $1 AND colour = $2)', [product_id, colour])
        } else {
            await pool.query('INSERT INTO cart (product_id, product_name, price, colour, image) VALUES  ($1, $2, $3, $4, $5)', [product_id, name, price, colour, image]);
        }
        console.log('product added to cart', [product_id, name, price, colour, image]);
        res.json({message: 'Added to cart successfully'});
    } catch(err) {
        console.error(err);
        res.status(500).json({error: 'Database error'});
    }
});

// 2. Get Cart Items
app.get('/api/cart', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cart ORDER BY id ASC');
        res.json(result.rows);
    } catch(err) {
        res.status(500).json({message: 'Database error'});
    }
});

// 3. Update Cart Quantity (NEW)
app.put('/api/cart/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    // Basic validation
    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    try {
        // Update the quantity where the ID matches
        const result = await pool.query(
            'UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *',
            [quantity, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        res.json({ message: "Quantity updated", item: result.rows[0] });
    } catch (err) {
        console.error("Error updating cart quantity:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// 4. Delete Cart Item (NEW)
app.delete('/api/cart/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM cart WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        res.json({ message: "Item removed from cart", item: result.rows[0] });
    } catch (err) {
        console.error("Error deleting cart item:", err);
        res.status(500).json({ error: "Database error" });
    }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});