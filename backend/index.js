require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer'); 
const path = require('path');
const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
const port = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use('/public', express.static(path.join(__dirname, 'public')));

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) 
    return res.status(401).json({ message: 'Access Denied! No token provided.' });

  jwt.verify(token, SECRET_KEY, (err, user) => {

    if (err)
      return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

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
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) 
    {
        return res.status(400).json({ error: "Name, email, password, phone and address are required" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email',
            [name, email, hashedPassword, phone, address]
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
            email: user.email,
            address: user.address
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

app.post('/api/products', upload.array('productImages', 4), async (req, res) => {
    try {
        const { name, price, backendUrl } = req.body;
        
        if (!req.files || req.files.length !== 4) {
            return res.status(400).json({ error: "Exactly 4 images are required" });
        }

        // Create full URL for the image using the backend URL sent from frontend
        const imageBaseUrl = backendUrl || `http://localhost:${port}`;
        const imageUrls = req.files.map(file => `${imageBaseUrl}/public/${file.filename}`);

        console.log(imageUrls);
        // Inserting into your existing table structure
        const result = await pool.query(
            'INSERT INTO products (name, price, images) VALUES ($1, $2, $3) RETURNING *',
            [name, price, imageUrls]
        );
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).send('Server Error');
    }
});

app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Delete the product from the database
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error("Error deleting product:", err);
        // This handles cases where the product is in a cart and cannot be deleted immediately
        res.status(500).json({ error: "Could not delete product (it might be in a customer's cart)" });
    }
});

// CART ROUTES 

// 1. Add to Cart
app.post('/api/cart', authenticateToken, async(req, res) => {
    const { product_id, name, price, colour, image } = req.body;
    const userId = req.user.id;
    console.log('product added to cart', [product_id, name, price, colour, image]);

    try {
        const existing = await pool.query('SELECT * FROM cart WHERE (product_id = $1 AND colour = $2 AND user_id = $3)', [product_id, colour, userId]);
        if (existing.rows.length > 0 ) {
            await pool.query('UPDATE cart SET quantity = quantity + 1 WHERE (product_id = $1 AND colour = $2 AND user_id = $3)', [product_id, colour, userId])
        } else {
            await pool.query('INSERT INTO cart (product_id, product_name, price, colour, image, user_id, "dateForAddToCart" ) VALUES  ($1, $2, $3, $4, $5, $6, NOW())', [product_id, name, price, colour, image, userId]);
        }
        console.log('product added to cart', [product_id, name, price, colour, image]);
        res.json({message: 'Added to cart successfully'});
    } catch(err) {
        console.error(err);
        res.status(500).json({error: 'Database error'});
    }
});

// 2. Get Cart Items
app.get('/api/cart', authenticateToken, async(req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query('SELECT * FROM cart WHERE user_id = $1 AND "cartStatus" = TRUE ORDER BY id ASC', [userId]);
        res.json(result.rows);
    } catch(err) {
        res.status(500).json({message: 'Database error'});
    }
});

// Update Cart Distance
app.put('/api/cart/distance', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { distance } = req.body;

    if (distance === undefined || distance === null) {
        return res.status(400).json({ error: "Distance is required" });
    }

    try {
        await pool.query(
            `UPDATE cart 
             SET distance = $1 
             WHERE user_id = $2 AND "cartStatus" = TRUE`,
            [distance, userId]
        );

        res.json({ message: "Delivery distance updated successfully" });
    } catch (err) {
        console.error("Error updating distance:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// 3. Update Cart Quantity (NEW)
app.put('/api/cart/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { quantity } = req.body;

    // Basic validation
    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    try {
        // Update the quantity where the ID matches and belongs to the user
        const result = await pool.query(
            'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [quantity, id, userId]
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
app.delete('/api/cart/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
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

app.post('/api/cart/buy', authenticateToken, async(req, res) => {
    const userId = req.user.id;
    const { transactionId } = req.body; 

    console.log("Processing buy for User:", userId, "Transaction ID:", transactionId);

    try {
        await pool.query(
            `UPDATE cart 
             SET 
                status = $1, 
                "cartStatus" = $2, 
                "dateForOutForDelivery" = NOW(),
                transaction_id = $3
             WHERE user_id = $4 AND "cartStatus" = TRUE`, 
            ['paymentPending', false, transactionId, userId]
        );

        return res.status(200).json({message: 'Order placed successfully!'});
    }
    catch (err) {
        console.error("Buy API Error:", err);
        res.status(500).json({error: 'Database error'});
    }
});

// 5. Get Order History for logged-in user
app.get('/api/orders', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const query = `
            SELECT 
                id, 
                product_name, 
                price, 
                quantity, 
                image, 
                colour, 
                status, 
                transaction_id, 
                "dateForOutForDelivery" as created_at,
                "dateOfDelivery" as delivery_date
            FROM cart 
            WHERE user_id = $1 AND status != 'addedToCart' 
            ORDER BY "dateForOutForDelivery" DESC
        `;
        
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching user orders:', err);
        res.status(500).json({ message: 'Database error' });
    }
});

app.get('/api/admin/orders', async (req, res) => {
    try {
        const query = `
            SELECT 
                c.id,
                c.product_name,
                c.quantity,
                c.price,
                c.colour,
                c.status,
                c.transaction_id,
                c."dateForOutForDelivery" as order_date,
                c."dateOfDelivery",
                u.phone as user_phone,
                u.name as user_name,
                c.distance,
                u.address as user_address
            FROM cart c
            JOIN users u ON c.user_id = u.id
            WHERE c.status != 'addedToCart' -- Show everything except active shopping carts
            ORDER BY 
                (c.status = 'delivered') ASC, -- False (0) comes first, True (1) goes to bottom
                c."dateForOutForDelivery" DESC;
        `;
        
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching admin orders:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.put('/api/admin/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    try {
        let query;
        let params;

        if (status === 'delivered') {
            query = 'UPDATE cart SET status = $1, "dateOfDelivery" = NOW() WHERE id = $2 RETURNING *';
            params = [status, id];
        } else {
            query = 'UPDATE cart SET status = $1 WHERE id = $2 RETURNING *';
            params = [status, id];
        }

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating status:", err);
        res.status(500).json({ error: "Database error" });
    }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});