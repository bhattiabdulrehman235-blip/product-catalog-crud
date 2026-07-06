from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, Integer, String, Text

from .database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    category = Column(String, default="")
    price = Column(Float, default=0)
    discount_percentage = Column(Float, default=0)
    rating = Column(Float, default=0)
    stock = Column(Integer, default=0)
    brand = Column(String, default="")
    thumbnail = Column(String, default="")
    images = Column(Text, default="[]")  # JSON-encoded list of image URLs

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )
