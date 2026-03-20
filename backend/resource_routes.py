# backend/resource_routes.py
import os
import uuid
import shutil
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from database import get_cursor

router = APIRouter(prefix="/api/resources", tags=["Resources"])

@router.post("/")
def add_resource(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    resource_type: str = Form(...),
    content_url: str = Form(""), # Used if it's an external link
    file: UploadFile = File(None), # Used if it's a direct file upload
    db_cursor: tuple = Depends(get_cursor)
):
    cursor, db = db_cursor
    try:
        final_url = content_url

        # 🔥 If a file is uploaded, save it to the server!
        if file and file.filename:
            # Ensure directory exists
            os.makedirs("static/resources", exist_ok=True)
            
            # Generate a safe, unique filename
            ext = file.filename.split(".")[-1]
            unique_filename = f"{uuid.uuid4()}.{ext}"
            file_path = f"static/resources/{unique_filename}"
            
            # Save the file to disk
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # The URL we save to the database points to our own server
            final_url = f"/{file_path}"

        # Ensure we have some form of content
        if not final_url:
            raise HTTPException(status_code=400, detail="You must provide either a file or a URL.")

        cursor.execute(
            "INSERT INTO resources (title, description, category, resource_type, content_url) VALUES (%s, %s, %s, %s, %s)",
            (title, description, category, resource_type, final_url)
        )
        db.commit()
        return {"message": "Resource added successfully!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def get_resources(category: str = "All", db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    if category == "All":
        cursor.execute("SELECT * FROM resources ORDER BY created_at DESC")
    else:
        cursor.execute("SELECT * FROM resources WHERE category = %s ORDER BY created_at DESC", (category,))
    return cursor.fetchall()

@router.delete("/{res_id}")
def delete_resource(res_id: int, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    try:
        # We could also delete the physical file here if we wanted to be thorough, 
        # but for now, deleting the DB record is enough.
        cursor.execute("DELETE FROM resources WHERE id = %s", (res_id,))
        db.commit()
        return {"message": "Resource deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))