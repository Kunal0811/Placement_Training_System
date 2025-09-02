# schemas.py
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    fname: str
    lname: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    fname: str
    lname: str
    email: EmailStr

    class Config:
        orm_mode = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
