from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.staticfiles import StaticFiles
import os
import uuid
from typing import List, Optional
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

load_dotenv()

import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)


SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
OWNER_EMAIL = os.getenv("OWNER_EMAIL")

from database import engine, Base, get_db
import models
import schemas
import json

app = FastAPI(title="Car Choice API")

# Path to car data JSON
CAR_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "data", "indian_cars_data_updated.json")

def read_car_data():
    if not os.path.exists(CAR_DATA_PATH):
        return {"brands": []}
    with open(CAR_DATA_PATH, "r") as f:
        return json.load(f)

def write_car_data(data):
    with open(CAR_DATA_PATH, "w") as f:
        json.dump(data, f, indent=2)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Next.js frontend URL usually
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.on_event("startup")
async def startup():
    # Only suitable for dev. In prod, use alembic
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
def read_root():
    return {"message": "Welcome to Car Choice API"}

@app.post("/api/cars")
async def create_car(
    make: str = Form(...),
    model: str = Form(...),
    variant: str = Form(...),
    month: str = Form(...),
    year: int = Form(...),
    price: float = Form(...),
    mileage: int = Form(...),
    fuel_type: str = Form(...),
    transmission: str = Form(...),
    owner: str = Form(...),
    color: str = Form(...),
    insurance_type: str = Form(...),
    accidental: int = Form(...),
    service_history: int = Form(...),
    second_key: int = Form(...),
    sunroof: int = Form(...),
    alloy_wheels: int = Form(...),
    registration: str = Form(""),
    status: str = Form("available"),
    images: List[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db)
):
    image_paths = []
    for image in images:
        if not image.filename: continue
        if not os.getenv("CLOUDINARY_CLOUD_NAME"):
            file_ext = image.filename.split(".")[-1]
            file_name = f"{uuid.uuid4()}.{file_ext}"
            file_path = os.path.join(UPLOAD_DIR, file_name)
            with open(file_path, "wb") as buffer:
                buffer.write(await image.read())
            image_paths.append(f"/uploads/{file_name}")
        else:
            # Upload directly to Cloudinary using file stream
            upload_result = cloudinary.uploader.upload(image.file)
            image_paths.append(upload_result["secure_url"])
        
    new_car = models.Car(
        make=make,
        model=model,
        variant=variant,
        month=month,
        year=year,
        price=price,
        mileage=mileage,
        fuel_type=fuel_type,
        transmission=transmission,
        owner=owner,
        color=color,
        insurance_type=insurance_type,
        accidental=accidental,
        service_history=service_history,
        second_key=second_key,
        sunroof=sunroof,
        alloy_wheels=alloy_wheels,
        registration=registration,
        images=image_paths,
        status=models.CarStatus(status.lower()) if status else models.CarStatus.AVAILABLE
    )
    db.add(new_car)
    await db.commit()
    await db.refresh(new_car)
    return new_car

@app.put("/api/cars/{car_id}")
async def update_car(
    car_id: str,
    make: str = Form(None),
    model: str = Form(None),
    variant: str = Form(None),
    month: str = Form(None),
    year: int = Form(None),
    price: float = Form(None),
    mileage: int = Form(None),
    fuel_type: str = Form(None),
    transmission: str = Form(None),
    owner: str = Form(None),
    color: str = Form(None),
    insurance_type: str = Form(None),
    accidental: int = Form(None),
    service_history: int = Form(None),
    second_key: int = Form(None),
    sunroof: int = Form(None),
    alloy_wheels: int = Form(None),
    registration: str = Form(None),
    status: str = Form(None),
    images: List[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy import select
    result = await db.execute(select(models.Car).where(models.Car.id == car_id))
    car = result.scalar_one_or_none()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Update fields if provided
    if make is not None: car.make = make
    if model is not None: car.model = model
    if variant is not None: car.variant = variant
    if month is not None: car.month = month
    if year is not None: car.year = year
    if price is not None: car.price = price
    if mileage is not None: car.mileage = mileage
    if fuel_type is not None: car.fuel_type = fuel_type
    if transmission is not None: car.transmission = transmission
    if owner is not None: car.owner = owner
    if color is not None: car.color = color
    if insurance_type is not None: car.insurance_type = insurance_type
    if accidental is not None: car.accidental = accidental
    if service_history is not None: car.service_history = service_history
    if second_key is not None: car.second_key = second_key
    if sunroof is not None: car.sunroof = sunroof
    if alloy_wheels is not None: car.alloy_wheels = alloy_wheels
    if registration is not None: car.registration = registration
    if status is not None: car.status = models.CarStatus(status.lower())
    
    # Handle images if new ones are uploaded
    if images and len(images) > 0:
        image_paths = []
        for image in images:
            if not image.filename: continue
            if not os.getenv("CLOUDINARY_CLOUD_NAME"):
                file_ext = image.filename.split(".")[-1]
                file_name = f"{uuid.uuid4()}.{file_ext}"
                file_path = os.path.join(UPLOAD_DIR, file_name)
                with open(file_path, "wb") as buffer:
                    buffer.write(await image.read())
                image_paths.append(f"/uploads/{file_name}")
            else:
                upload_result = cloudinary.uploader.upload(image.file)
                image_paths.append(upload_result["secure_url"])
        if image_paths:
            car.images = image_paths

    await db.commit()
    await db.refresh(car)
    return car

@app.get("/api/cars")
async def get_cars(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    result = await db.execute(select(models.Car).order_by(models.Car.created_at.desc()))
    cars = result.scalars().all()
    return cars

@app.get("/api/cars/featured")
async def get_featured_cars(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    result = await db.execute(select(models.Car).order_by(models.Car.created_at.desc()).limit(4))
    cars = result.scalars().all()
    return cars

@app.delete("/api/cars/{car_id}")
async def delete_car(car_id: str, db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    result = await db.execute(select(models.Car).where(models.Car.id == car_id))
    car = result.scalar_one_or_none()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    await db.delete(car)
    await db.commit()
    return {"message": "Car deleted successfully"}

# --- Sell Requests ---

@app.post("/api/sell-requests", status_code=status.HTTP_201_CREATED)
async def create_sell_request(request: schemas.SellRequestCreate, db: AsyncSession = Depends(get_db)):
    try:
        new_request = models.SellRequest(**request.dict())
        db.add(new_request)
        await db.commit()
        await db.refresh(new_request)
        
        try:
            timestamp_ist = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            subject = f"New Car Sale Submission from {request.full_name} - {request.make} {request.model}"
            html_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #2c3e50;">New Car Sale Submission</h2>
                    <p><strong>Date & Time (IST):</strong> {timestamp_ist}</p>
                    
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Details</h3>
                    <ul>
                        <li><strong>Name:</strong> {request.full_name}</li>
                        <li><strong>Phone:</strong> {request.phone}</li>
                        <li><strong>Email:</strong> {request.email}</li>
                        <li><strong>City:</strong> {request.city}</li>
                    </ul>

                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Car Details</h3>
                    <ul>
                        <li><strong>Make & Model:</strong> {request.make} {request.model} ({request.variant})</li>
                        <li><strong>Year & Month:</strong> {request.year} {request.month}</li>
                        <li><strong>Registration:</strong> {request.registration_no} ({request.registration_at})</li>
                        <li><strong>Fuel:</strong> {request.fuel_type}</li>
                        <li><strong>Color:</strong> {request.color}</li>
                        <li><strong>Owner:</strong> {request.owner}</li>
                        <li><strong>Mileage:</strong> {request.km_done} km</li>
                        <li><strong>Estimated Price:</strong> ₹{request.estimated_price}</li>
                    </ul>
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Condition Details</h3>
                    <ul>
                        <li><strong>Accidental:</strong> {request.is_accidental}</li>
                        <li><strong>Flood Affected:</strong> {request.is_flood_affected}</li>
                        <li><strong>Insurance:</strong> {request.insurance} (Valid till {request.insurance_valid_till})</li>
                        <li><strong>Lifetime Tax:</strong> {request.lifetime_tax}</li>
                    </ul>
                </body>
            </html>
            """
            send_email(subject, html_body, OWNER_EMAIL)
        except Exception as e:
            print(f"Failed to send email: {e}")
            
        return {"message": "Sell request submitted successfully", "id": new_request.id}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sell-requests")
async def get_sell_requests(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    result = await db.execute(select(models.SellRequest).order_by(models.SellRequest.created_at.desc()))
    return result.scalars().all()


# --- Inquiries ---

@app.post("/api/inquiries", status_code=status.HTTP_201_CREATED)
async def create_inquiry(inquiry: schemas.InquiryCreate, db: AsyncSession = Depends(get_db)):
    try:
        new_inquiry = models.Inquiry(**inquiry.dict())
        db.add(new_inquiry)
        await db.commit()
        await db.refresh(new_inquiry)
        
        try:
            car_display = "N/A"
            if inquiry.car_id:
                from sqlalchemy import select
                car_result = await db.execute(select(models.Car).where(models.Car.id == inquiry.car_id))
                car = car_result.scalars().first()
                if car:
                    car_display = f"{car.make} {car.model} {car.variant} ({car.year})"
                else:
                    car_display = inquiry.car_id
                    
            timestamp_ist = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            subject = f"New {inquiry.type} from {inquiry.full_name}"
            html_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #2c3e50;">New Inquiry Received</h2>
                    <p><strong>Date & Time (IST):</strong> {timestamp_ist}</p>
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Details</h3>
                    <ul>
                        <li><strong>Name:</strong> {inquiry.full_name}</li>
                        <li><strong>Phone:</strong> {inquiry.phone}</li>
                        <li><strong>Email:</strong> {inquiry.email}</li>
                    </ul>
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Inquiry Details</h3>
                    <ul>
                        <li><strong>Type:</strong> {inquiry.type}</li>
                        <li><strong>Car:</strong> {car_display}</li>
                    </ul>
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Message</h3>
                    <p>{inquiry.message}</p>
                </body>
            </html>
            """
            send_email(subject, html_body, OWNER_EMAIL)
        except Exception as e:
            print(f"Failed to send email: {e}")
            
        return {"message": "Inquiry submitted successfully", "id": new_inquiry.id}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/inquiries")
async def get_inquiries(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    result = await db.execute(select(models.Inquiry).order_by(models.Inquiry.created_at.desc()))
    return result.scalars().all()

# --- Car Data Management ---

@app.get("/api/car-data")
async def get_car_data():
    return read_car_data()

@app.post("/api/car-data/brands")
async def add_brand(brand: schemas.BrandCreate):
    data = read_car_data()
    if any(b["id"] == brand.id for b in data["brands"]):
        raise HTTPException(status_code=400, detail="Brand already exists")
    data["brands"].append(brand.dict())
    write_car_data(data)
    return {"message": "Brand added successfully"}

@app.delete("/api/car-data/brands/{brand_id}")
async def delete_brand(brand_id: str):
    data = read_car_data()
    data["brands"] = [b for b in data["brands"] if b["id"] != brand_id]
    write_car_data(data)
    return {"message": "Brand deleted successfully"}

@app.post("/api/car-data/brands/{brand_id}/models")
async def add_model(brand_id: str, model: schemas.ModelCreate):
    data = read_car_data()
    brand = next((b for b in data["brands"] if b["id"] == brand_id), None)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    if any(m["id"] == model.id for m in brand["models"]):
        raise HTTPException(status_code=400, detail="Model already exists")
    brand["models"].append(model.dict())
    write_car_data(data)
    return {"message": "Model added successfully"}

@app.delete("/api/car-data/brands/{brand_id}/models/{model_id}")
async def delete_model(brand_id: str, model_id: str):
    data = read_car_data()
    brand = next((b for b in data["brands"] if b["id"] == brand_id), None)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    brand["models"] = [m for m in brand["models"] if m["id"] != model_id]
    write_car_data(data)
    return {"message": "Model deleted successfully"}

@app.post("/api/car-data/brands/{brand_id}/models/{model_id}/variants")
async def add_variant(brand_id: str, model_id: str, variant: schemas.VariantCreate):
    data = read_car_data()
    brand = next((b for b in data["brands"] if b["id"] == brand_id), None)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    model = next((m for m in brand["models"] if m["id"] == model_id), None)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    model["variants"].append(variant.dict())
    write_car_data(data)
    return {"message": "Variant added successfully"}

@app.delete("/api/car-data/brands/{brand_id}/models/{model_id}/variants/{variant_name}")
async def delete_variant(brand_id: str, model_id: str, variant_name: str):
    data = read_car_data()
    brand = next((b for b in data["brands"] if b["id"] == brand_id), None)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    model = next((m for m in brand["models"] if m["id"] == model_id), None)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    model["variants"] = [v for v in model["variants"] if v["name"] != variant_name]
    write_car_data(data)
    return {"message": "Variant deleted successfully"}

# --- Email Notifications ---

class EmailSellCarRequest(BaseModel):
    name: str
    phone: str
    email: EmailStr
    make: str
    model: str
    year: str
    mileage: str
    price: str
    message: Optional[str] = None

class EmailCallRequest(BaseModel):
    name: str
    phone: str
    preferred_time: Optional[str] = None

def send_email(subject: str, html_body: str, to_email: str):
    """
    Sends an HTML email using smtplib.
    """
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        raise HTTPException(
            status_code=500,
            detail="SMTP credentials are not configured properly in the environment."
        )

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email

    part_html = MIMEText(html_body, "html")
    msg.attach(part_html)

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {str(e)}"
        )

@app.post("/sell-car")
def sell_car(request: EmailSellCarRequest):
    timestamp_ist = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    subject = f"New Car Sale Submission from {request.name} - {request.make} {request.model}"
    
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2c3e50;">New Car Sale Submission</h2>
            <p><strong>Date & Time (IST):</strong> {timestamp_ist}</p>
            
            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Details</h3>
            <ul>
                <li><strong>Name:</strong> {request.name}</li>
                <li><strong>Phone:</strong> {request.phone}</li>
                <li><strong>Email:</strong> {request.email}</li>
            </ul>

            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Car Details</h3>
            <ul>
                <li><strong>Make:</strong> {request.make}</li>
                <li><strong>Model:</strong> {request.model}</li>
                <li><strong>Year:</strong> {request.year}</li>
                <li><strong>Mileage:</strong> {request.mileage}</li>
                <li><strong>Asking Price:</strong> ₹{request.price}</li>
            </ul>
            
            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Additional Message</h3>
            <p>{request.message if request.message else "<em>No additional message provided.</em>"}</p>
        </body>
    </html>
    """

    send_email(subject, html_body, OWNER_EMAIL)
    return {"success": True, "message": "Email sent successfully"}

@app.post("/call-request")
def call_request(request: EmailCallRequest):
    timestamp_ist = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    subject = f"Callback Request from {request.name}"
    
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2c3e50;">New Callback Request</h2>
            <p><strong>Date & Time (IST):</strong> {timestamp_ist}</p>
            
            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Details</h3>
            <ul>
                <li><strong>Name:</strong> {request.name}</li>
                <li><strong>Phone:</strong> {request.phone}</li>
                <li><strong>Preferred Time:</strong> {request.preferred_time if request.preferred_time else "<em>Not specified</em>"}</li>
            </ul>
        </body>
    </html>
    """

    send_email(subject, html_body, OWNER_EMAIL)
    return {"success": True, "message": "Callback request received"}
