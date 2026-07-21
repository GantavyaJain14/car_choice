from pydantic import BaseModel, EmailStr
from typing import Optional, List

class SellRequestCreate(BaseModel):
    # User Details
    full_name: str
    phone: str
    email: Optional[EmailStr] = None
    
    # Car Details
    make: str
    model: str
    fuel_type: Optional[str] = None
    variant: str
    month: str
    year: int
    owner: str
    color: str
    city: str
    registration_no: str
    registration_at: str
    km_done: int
    lifetime_tax: str
    insurance: str
    insurance_valid_till: str
    estimated_price: float
    is_accidental: str
    is_flood_affected: str

class InquiryCreate(BaseModel):
    car_id: Optional[str] = None
    full_name: str
    phone: str
    email: Optional[EmailStr] = None
    message: str
    type: str = "General Inquiry"

# --- Car Data Schemas ---

class VariantCreate(BaseModel):
    name: str
    fuel_type: str

class ModelCreate(BaseModel):
    id: str
    name: str
    variants: List[VariantCreate] = []
    discontinued: bool = False

class BrandCreate(BaseModel):
    id: str
    name: str
    models: List[ModelCreate] = []
