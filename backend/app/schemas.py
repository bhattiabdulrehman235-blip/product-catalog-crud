from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = ""
    category: str = ""
    price: float = Field(ge=0, default=0)
    discount_percentage: float = Field(ge=0, le=100, default=0)
    rating: float = Field(ge=0, le=5, default=0)
    stock: int = Field(ge=0, default=0)
    brand: str = ""
    thumbnail: str = ""
    images: List[str] = []


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(default=None, ge=0)
    discount_percentage: Optional[float] = Field(default=None, ge=0, le=100)
    rating: Optional[float] = Field(default=None, ge=0, le=5)
    stock: Optional[int] = Field(default=None, ge=0)
    brand: Optional[str] = None
    thumbnail: Optional[str] = None
    images: Optional[List[str]] = None


class ProductOut(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class ProductPage(BaseModel):
    items: List[ProductOut]
    total: int
    skip: int
    limit: int


class Category(BaseModel):
    value: str
