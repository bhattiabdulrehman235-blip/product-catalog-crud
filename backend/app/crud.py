import json
from typing import Optional

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from . import models, schemas


def _to_out(product: models.Product) -> dict:
    data = {c.name: getattr(product, c.name) for c in product.__table__.columns}
    data["images"] = json.loads(data["images"] or "[]")
    return data


def get_product(db: Session, product_id: int) -> Optional[dict]:
    product = db.get(models.Product, product_id)
    return _to_out(product) if product else None


def list_products(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    category: Optional[str] = None,
) -> tuple[list[dict], int]:
    query = db.query(models.Product)

    if search:
        like = f"%{search}%"
        query = query.filter(
            or_(
                models.Product.title.ilike(like),
                models.Product.description.ilike(like),
                models.Product.brand.ilike(like),
            )
        )

    if category:
        query = query.filter(models.Product.category == category)

    total = query.with_entities(func.count(models.Product.id)).scalar() or 0
    products = (
        query.order_by(models.Product.id).offset(skip).limit(limit).all()
    )
    return [_to_out(p) for p in products], total


def list_categories(db: Session) -> list[str]:
    rows = (
        db.query(models.Product.category)
        .filter(models.Product.category != "")
        .distinct()
        .order_by(models.Product.category)
        .all()
    )
    return [r[0] for r in rows]


def create_product(db: Session, payload: schemas.ProductCreate) -> dict:
    data = payload.model_dump()
    data["images"] = json.dumps(data.get("images") or [])
    product = models.Product(**data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return _to_out(product)


def update_product(
    db: Session, product_id: int, payload: schemas.ProductUpdate
) -> Optional[dict]:
    product = db.get(models.Product, product_id)
    if not product:
        return None

    updates = payload.model_dump(exclude_unset=True)
    if "images" in updates and updates["images"] is not None:
        updates["images"] = json.dumps(updates["images"])

    for key, value in updates.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return _to_out(product)


def delete_product(db: Session, product_id: int) -> bool:
    product = db.get(models.Product, product_id)
    if not product:
        return False
    db.delete(product)
    db.commit()
    return True
