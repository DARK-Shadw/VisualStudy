"""
FastAPI backend server for AI-powered learning platform
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
import asyncio

# Load environment variables
load_dotenv()

# Import workflows
from workflows.course_generation_flow import CourseGenerationWorkflow

app = FastAPI(
    title="VisualStudy API",
    description="AI-powered interactive learning platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class CourseRequest(BaseModel):
    topic: str
    difficulty: Optional[str] = "intermediate"
    user_background: Optional[str] = None

class CourseResponse(BaseModel):
    course_id: str
    status: str
    data: Optional[Dict[str, Any]] = None
    progress: Optional[Dict[str, Any]] = None

class GenerationStatus(BaseModel):
    course_id: str
    status: str
    current_step: str
    progress_percentage: int
    messages: List[str]

# In-memory storage for course generation status
course_generation_status: Dict[str, Dict[str, Any]] = {}

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "VisualStudy API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.post("/api/courses/generate", response_model=CourseResponse)
async def generate_course(request: CourseRequest):
    """
    Start course generation process
    Returns a course_id to track progress
    """
    try:
        # Generate unique course ID
        import uuid
        course_id = str(uuid.uuid4())

        # Initialize status
        course_generation_status[course_id] = {
            "status": "initiated",
            "current_step": "Analyzing topic",
            "progress_percentage": 0,
            "messages": ["Course generation initiated"],
            "data": None
        }

        # Start async course generation
        asyncio.create_task(
            run_course_generation(course_id, request.topic, request.difficulty)
        )

        return CourseResponse(
            course_id=course_id,
            status="initiated",
            progress={
                "current_step": "Analyzing topic",
                "progress_percentage": 0
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def run_course_generation(course_id: str, topic: str, difficulty: str):
    """
    Background task to run course generation workflow
    """
    try:
        workflow = CourseGenerationWorkflow()

        # Update status callback
        def update_status(step: str, progress: int, message: str):
            course_generation_status[course_id].update({
                "current_step": step,
                "progress_percentage": progress,
                "messages": course_generation_status[course_id]["messages"] + [message]
            })

        # Run workflow
        result = await workflow.run(
            topic=topic,
            difficulty=difficulty,
            status_callback=update_status
        )

        # Update final status
        course_generation_status[course_id].update({
            "status": "completed",
            "current_step": "Completed",
            "progress_percentage": 100,
            "data": result
        })

    except Exception as e:
        course_generation_status[course_id].update({
            "status": "failed",
            "messages": course_generation_status[course_id]["messages"] + [f"Error: {str(e)}"]
        })

@app.get("/api/courses/{course_id}/status", response_model=GenerationStatus)
async def get_course_status(course_id: str):
    """
    Get the current status of course generation
    """
    if course_id not in course_generation_status:
        raise HTTPException(status_code=404, detail="Course not found")

    status_data = course_generation_status[course_id]
    return GenerationStatus(
        course_id=course_id,
        status=status_data["status"],
        current_step=status_data["current_step"],
        progress_percentage=status_data["progress_percentage"],
        messages=status_data["messages"]
    )

@app.get("/api/courses/{course_id}")
async def get_course(course_id: str):
    """
    Get complete course data
    """
    if course_id not in course_generation_status:
        raise HTTPException(status_code=404, detail="Course not found")

    status_data = course_generation_status[course_id]

    if status_data["status"] != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Course generation not completed. Current status: {status_data['status']}"
        )

    return {
        "course_id": course_id,
        "data": status_data["data"]
    }

@app.get("/api/health")
async def health_check():
    """Health check with environment validation"""
    llm_provider = os.getenv("LLM_PROVIDER", "not_set")
    has_api_key = bool(os.getenv("GEMINI_API_KEY") or os.getenv("OPENROUTER_API_KEY"))

    return {
        "status": "healthy",
        "llm_provider": llm_provider,
        "api_key_configured": has_api_key
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
