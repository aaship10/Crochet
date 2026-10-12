"""Threaded Things backend (FastAPI). Run with:  uvicorn main:app --reload --port 5000"""
import datetime as dt
import os
from contextlib import contextmanager
from typing import List, Optional

import bcrypt
import cloudinary
import cloudinary.uploader
import jwt
import psycopg2
import psycopg2.errors
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Form, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from psycopg2.extras import RealDictCursor
from psycopg2.pool import ThreadedConnectionPool
from pydantic import BaseModel

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

app = FastAPI(title="Threaded Things API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "public")
os.makedirs(PUBLIC_DIR, exist_ok=True)
app.mount("/public", StaticFiles(directory=PUBLIC_DIR), name="public")

# ---------------------------------------------------------------- database
_pool: Optional[ThreadedConnectionPool] = None


def get_pool() -> ThreadedConnectionPool:
    global _pool
    if _pool is None:
        _pool = ThreadedConnectionPool(1, 10, os.getenv("DATABASE_URL"), sslmode="require")
    return _pool


@contextmanager
def db():
    """Yield a dict cursor; commit on success, roll back on error."""
    pool = get_pool()
    conn = pool.getconn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            yield cur
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        pool.putconn(conn)


def query(sql: str, params=()):
    with db() as cur:
        cur.execute(sql, params)
        return cur.fetchall() if cur.description else []


# ---------------------------------------------------------------- errors / auth
class ApiError(Exception):
    """Keeps the {error: ...} / {message: ...} response shapes the frontend already reads."""

    def __init__(self, status: int, key: str, message: str):
        self.status, self.key, self.message = status, key, message


@app.exception_handler(ApiError)
async def api_error_handler(_: Request, exc: ApiError):
    return JSONResponse({exc.key: exc.message}, status_code=exc.status)


@app.exception_handler(Exception)
async def server_error_handler(_: Request, __: Exception):
    return PlainTextResponse("Server Error", status_code=500)


def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])


def authenticate(request: Request) -> dict:
    parts = request.headers.get("authorization", "").split(" ")
    token = parts[1] if len(parts) > 1 else None
    if not token:
        raise ApiError(401, "message", "Access Denied! No token provided.")
    try:
        return decode_token(token)
    except jwt.PyJWTError:
        raise ApiError(403, "message", "Invalid or expired token")


@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return PlainTextResponse("Backend is running!")


class RegisterBody(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


@app.post("/auth/register")
def register(body: RegisterBody):
    if not all([body.name, body.email, body.password, body.phone, body.address]):
        raise ApiError(400, "error", "Name, email, password, phone and address are required")
    hashed = bcrypt.hashpw(body.password.encode(), bcrypt.gensalt(10)).decode()
    try:
        rows = query(
            "INSERT INTO users (name, email, password, phone, address) VALUES (%s, %s, %s, %s, %s) RETURNING id, name, email",
            (body.name, body.email, hashed, body.phone, body.address),
        )
    except psycopg2.errors.UniqueViolation:
        raise ApiError(409, "error", "Email already exists")
    return {"message": "User registered!", "user": rows[0]}


class LoginBody(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None


@app.post("/auth/login")
def login(body: LoginBody):
    rows = query("SELECT * FROM users WHERE email = %s", (body.email,))
    if not rows or not body.password:
        raise ApiError(401, "message", "Invalid credentials")
    user = rows[0]
    if not bcrypt.checkpw(body.password.encode(), user["password"].encode()):
        raise ApiError(401, "message", "Invalid credentials")
    token = jwt.encode(
        {"id": user["id"], "exp": dt.datetime.now(dt.timezone.utc) + dt.timedelta(hours=1)},
        SECRET_KEY,
        algorithm="HS256",
    )
    return {
        "message": "Login successful",
        "token": token,
        "user": {"id": user["id"], "name": user["name"], "email": user["email"], "address": user["address"]},
    }


# ---------------------------------------------------------------- products
@app.get("/api/products")
def list_products():
    return query("SELECT * FROM products")


@app.post("/api/products")
def add_product(
    name: str = Form(...),
    price: str = Form(...),
    productImages: Optional[List[UploadFile]] = File(None),
):
    if not productImages or len(productImages) != 4:
        raise ApiError(400, "error", "Exactly 4 images are required")
    urls = []
    for f in productImages:
        if f.content_type not in ALLOWED_IMAGE_TYPES:
            raise ApiError(400, "error", "Only jpg, png and webp images are allowed")
        urls.append(cloudinary.uploader.upload(f.file, folder="crochet_products")["secure_url"])
    rows = query(
        "INSERT INTO products (name, price, images) VALUES (%s, %s, %s) RETURNING *",
        (name, price, urls),
    )
    return rows[0]


@app.delete("/api/products/{product_id}")
def delete_product(product_id: int):
    try:
        rows = query("DELETE FROM products WHERE id = %s RETURNING *", (product_id,))
    except Exception:
        raise ApiError(500, "error", "Could not delete product (it might be in a customer's cart)")
    if not rows:
        raise ApiError(404, "message", "Product not found")
    return {"message": "Product deleted successfully"}


# ---------------------------------------------------------------- cart
class CartAddBody(BaseModel):
    product_id: int
    name: Optional[str] = None
    price: Optional[float] = None
    colour: Optional[str] = None
    image: Optional[str] = None


@app.post("/api/cart")
def add_to_cart(body: CartAddBody, user: dict = Depends(authenticate)):
    uid = user["id"]
    try:
        existing = query(
            "SELECT * FROM cart WHERE (product_id = %s AND colour = %s AND user_id = %s)",
            (body.product_id, body.colour, uid),
        )
        if existing:
            query(
                "UPDATE cart SET quantity = quantity + 1 WHERE (product_id = %s AND colour = %s AND user_id = %s)",
                (body.product_id, body.colour, uid),
            )
        else:
            query(
                'INSERT INTO cart (product_id, product_name, price, colour, image, user_id, "dateForAddToCart") '
                "VALUES (%s, %s, %s, %s, %s, %s, NOW())",
                (body.product_id, body.name, body.price, body.colour, body.image, uid),
            )
    except Exception:
        raise ApiError(500, "error", "Database error")
    return {"message": "Added to cart successfully"}


@app.get("/api/cart")
def get_cart(user: dict = Depends(authenticate)):
    try:
        return query('SELECT * FROM cart WHERE user_id = %s AND "cartStatus" = TRUE ORDER BY id ASC', (user["id"],))
    except Exception:
        raise ApiError(500, "message", "Database error")


class DistanceBody(BaseModel):
    distance: Optional[float] = None


# Declared before /api/cart/{item_id} so "distance" is not parsed as an id.
@app.put("/api/cart/distance")
def update_distance(body: DistanceBody, user: dict = Depends(authenticate)):
    if body.distance is None:
        raise ApiError(400, "error", "Distance is required")
    try:
        query('UPDATE cart SET distance = %s WHERE user_id = %s AND "cartStatus" = TRUE', (body.distance, user["id"]))
    except Exception:
        raise ApiError(500, "error", "Database error")
    return {"message": "Delivery distance updated successfully"}


class QuantityBody(BaseModel):
    quantity: Optional[int] = None


@app.put("/api/cart/{item_id}")
def update_quantity(item_id: int, body: QuantityBody, user: dict = Depends(authenticate)):
    if not body.quantity or body.quantity < 1:
        raise ApiError(400, "error", "Quantity must be at least 1")
    try:
        rows = query(
            "UPDATE cart SET quantity = %s WHERE id = %s AND user_id = %s RETURNING *",
            (body.quantity, item_id, user["id"]),
        )
    except Exception:
        raise ApiError(500, "error", "Database error")
    if not rows:
        raise ApiError(404, "message", "Item not found in cart")
    return {"message": "Quantity updated", "item": rows[0]}


@app.delete("/api/cart/{item_id}")
def delete_cart_item(item_id: int, user: dict = Depends(authenticate)):
    try:
        rows = query("DELETE FROM cart WHERE id = %s AND user_id = %s RETURNING *", (item_id, user["id"]))
    except Exception:
        raise ApiError(500, "error", "Database error")
    if not rows:
        raise ApiError(404, "message", "Item not found in cart")
    return {"message": "Item removed from cart", "item": rows[0]}


class BuyBody(BaseModel):
    transactionId: Optional[str] = None


@app.post("/api/cart/buy")
def buy(body: BuyBody, user: dict = Depends(authenticate)):
    try:
        query(
            """UPDATE cart
               SET status = %s, "cartStatus" = %s, "dateForOutForDelivery" = NOW(), transaction_id = %s
               WHERE user_id = %s AND "cartStatus" = TRUE""",
            ("paymentPending", False, body.transactionId, user["id"]),
        )
    except Exception:
        raise ApiError(500, "error", "Database error")
    return {"message": "Order placed successfully!"}


# ---------------------------------------------------------------- orders
@app.get("/api/orders")
def my_orders(user: dict = Depends(authenticate)):
    try:
        return query(
            """SELECT id, product_name, price, quantity, image, colour, status, transaction_id,
                      "dateForOutForDelivery" AS created_at, "dateOfDelivery" AS delivery_date
               FROM cart
               WHERE user_id = %s AND status != 'addedToCart'
               ORDER BY "dateForOutForDelivery" DESC""",
            (user["id"],),
        )
    except Exception:
        raise ApiError(500, "message", "Database error")


@app.get("/api/admin/orders")
def admin_orders():
    return query(
        """SELECT c.id, c.product_name, c.quantity, c.price, c.colour, c.status, c.transaction_id,
                  c."dateForOutForDelivery" AS order_date, c."dateOfDelivery",
                  u.phone AS user_phone, u.name AS user_name, c.distance, u.address AS user_address
           FROM cart c
           JOIN users u ON c.user_id = u.id
           WHERE c.status != 'addedToCart'
           ORDER BY (c.status = 'delivered') ASC, c."dateForOutForDelivery" DESC"""
    )


class StatusBody(BaseModel):
    status: str


@app.put("/api/admin/orders/{order_id}/status")
def update_status(order_id: int, body: StatusBody):
    if body.status == "delivered":
        sql = 'UPDATE cart SET status = %s, "dateOfDelivery" = NOW() WHERE id = %s RETURNING *'
    else:
        sql = "UPDATE cart SET status = %s WHERE id = %s RETURNING *"
    try:
        rows = query(sql, (body.status, order_id))
    except Exception:
        raise ApiError(500, "error", "Database error")
    if not rows:
        raise ApiError(404, "message", "Order not found")
    return rows[0]


# ---------------------------------------------------------------- chatbot (Nirmal)
from chatbot import router as chat_router  # noqa: E402  (imports query/decode_token lazily)

app.include_router(chat_router)
