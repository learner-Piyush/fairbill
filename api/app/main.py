from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.audit import router as audit_router
from app.routers.health import router as health_router

app = FastAPI(
    title="FairBill API",
    description="Backend microservice for medical bill auditing",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(audit_router)
