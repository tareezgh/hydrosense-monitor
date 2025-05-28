from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.sensor import router as sensor_router

app = FastAPI(title="HydroSense Monitor API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sensor_router)
