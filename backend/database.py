# backend/database.py
import os
import mysql.connector
from fastapi import Depends
from dotenv import load_dotenv

load_dotenv()

# Database configuration
db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "placify")
}

# Dependency to get a database connection
def get_db():
    db = None
    try:
        db = mysql.connector.connect(**db_config)
        yield db
    finally:
        if db:
            db.close()

# Dependency to get a database cursor
def get_cursor(db: mysql.connector.MySQLConnection = Depends(get_db)):
    cursor = None
    try:
        cursor = db.cursor(dictionary=True)
        yield cursor, db
    finally:
        if cursor:
            cursor.close()