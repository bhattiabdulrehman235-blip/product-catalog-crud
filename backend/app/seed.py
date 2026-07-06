import json
import logging

import httpx
from sqlalchemy.orm import Session

from . import models

logger = logging.getLogger("app.seed")

DUMMYJSON_URL = "https://dummyjson.com/products?limit=100"


def seed_if_empty(db: Session) -> None:
    existing = db.query(models.Product).first()
    if existing is not None:
        return

    try:
        response = httpx.get(DUMMYJSON_URL, timeout=10.0)
        response.raise_for_status()
        products = response.json().get("products", [])
    except httpx.HTTPError as exc:
        logger.warning("Could not reach DummyJSON (%s); starting with an empty catalog.", exc)
        return

    for item in products:
        db.add(
            models.Product(
                id=item.get("id"),
                title=item.get("title", ""),
                description=item.get("description", ""),
                category=item.get("category", ""),
                price=item.get("price", 0),
                discount_percentage=item.get("discountPercentage", 0),
                rating=item.get("rating", 0),
                stock=item.get("stock", 0),
                brand=item.get("brand", "") or "",
                thumbnail=item.get("thumbnail", ""),
                images=json.dumps(item.get("images", [])),
            )
        )
    db.commit()
    logger.info("Seeded %d products from DummyJSON.", len(products))
