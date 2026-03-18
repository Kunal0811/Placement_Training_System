import os
import mysql.connector
from passlib.hash import bcrypt
from dotenv import load_dotenv

# Load your .env variables (like DB_USER, DB_PASSWORD)
load_dotenv()

# The credentials you requested
admin_id = "22104091"
plain_password = "22104091"
admin_name = "Kunal "

# Encrypt the password
hashed_password = bcrypt.hash(plain_password)

try:
    # Connect to your database
    db = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "placify")
    )
    cursor = db.cursor()

    # Insert the new admin
    cursor.execute(
        "INSERT INTO admins (admin_id, password_hash, name) VALUES (%s, %s, %s)",
        (admin_id, hashed_password, admin_name)
    )
    db.commit()
    print(f"✅ Admin Account Created Successfully!")
    print(f"👉 Admin ID: {admin_id}")
    print(f"👉 Password: {plain_password}")

except mysql.connector.IntegrityError:
    print("⚠️ This Admin ID already exists in the database.")
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    if 'cursor' in locals(): cursor.close()
    if 'db' in locals(): db.close()