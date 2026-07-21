from sqlalchemy import Column, Integer, String, Float, JSON, Enum as SQLEnum, DateTime
from database import Base
import enum
from datetime import datetime
import uuid

class UserRole(str, enum.Enum):
    BUYER = "buyer"
    SELLER = "seller"
    ADMIN = "admin"

class CarStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    AVAILABLE = "available"
    BOOKED = "booked"
    SOLD = "sold"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255))
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(SQLEnum(UserRole), default=UserRole.BUYER)

class Car(Base):
    __tablename__ = "cars"
    
    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    make = Column(String(100), index=True)
    model = Column(String(100), index=True)
    variant = Column(String(100))
    month = Column(String(20))
    year = Column(Integer, index=True)
    price = Column(Float, index=True)
    mileage = Column(Integer)
    fuel_type = Column(String(50))
    transmission = Column(String(50))
    owner = Column(String(50))
    color = Column(String(50))
    insurance_type = Column(String(50))
    accidental = Column(Integer, default=0) # 0 for No, 1 for Yes
    service_history = Column(Integer, default=0)
    second_key = Column(Integer, default=0)
    sunroof = Column(Integer, default=0)
    alloy_wheels = Column(Integer, default=0)
    registration = Column(String(50))
    images = Column(JSON) # Store array of image URLs
    status = Column(SQLEnum(CarStatus), default=CarStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)

class SellRequest(Base):
    __tablename__ = "sell_requests"
    
    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    
    # User Details
    full_name = Column(String(255))
    phone = Column(String(50))
    email = Column(String(255))
    
    # Car Details
    make = Column(String(100))
    model = Column(String(100))
    fuel_type = Column(String(50))
    variant = Column(String(100))
    month = Column(String(20))
    year = Column(Integer)
    owner = Column(String(50))
    color = Column(String(50))
    city = Column(String(100))
    registration_no = Column(String(100))
    registration_at = Column(String(100))
    km_done = Column(Integer)
    lifetime_tax = Column(String(50))
    insurance = Column(String(50))
    insurance_valid_till = Column(String(50))
    estimated_price = Column(Float)
    is_accidental = Column(String(10))
    is_flood_affected = Column(String(10))
    
    status = Column(String(50), default="Pending Evaluation")
    created_at = Column(DateTime, default=datetime.utcnow)

class Inquiry(Base):
    __tablename__ = "inquiries"
    
    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    
    car_id = Column(String(36), index=True) # Optional link to a specific car
    full_name = Column(String(255))
    phone = Column(String(50))
    email = Column(String(255))
    message = Column(String(1000))
    type = Column(String(50)) # e.g., "Test Drive", "General Inquiry"
    
    status = Column(String(50), default="New")
    created_at = Column(DateTime, default=datetime.utcnow)
