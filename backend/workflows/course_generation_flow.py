"""
Course Generation Workflow
Orchestrates all agents to generate a complete course
"""
from typing import Dict, Any, Callable, Optional
import asyncio
import logging
from utils.llm_client import get_llm_client
from agents.curriculum_agent import CurriculumArchitect
from agents.interactive_learning_designer import InteractiveLearningDesigner
from agents.content_agent import ContentDeveloper
from agents.assessment_agent import AssessmentCreator

logger = logging.getLogger(__name__)

class CourseGenerationWorkflow:
    """Workflow that orchestrates course generation"""

    def __init__(self):
        """Initialize the workflow with agents"""
        llm_client = get_llm_client()
        self.llm = llm_client.get_llm()

        # Initialize agents
        self.curriculum_agent = CurriculumArchitect(self.llm)
        self.interactive_designer = InteractiveLearningDesigner(self.llm)
        self.content_agent = ContentDeveloper(self.llm)
        self.assessment_agent = AssessmentCreator(self.llm)
        logger.info("Course generation workflow initialized with all agents")

    async def run(
        self,
        topic: str,
        difficulty: str = "intermediate",
        status_callback: Optional[Callable[[str, int, str], None]] = None
    ) -> Dict[str, Any]:
        """
        Run the complete course generation workflow

        Args:
            topic: The topic to create a course for
            difficulty: Target difficulty level
            status_callback: Optional callback for status updates

        Returns:
            Complete course structure with all content
        """
        result = {
            "curriculum": None,
            "visualizations": None,
            "lessons": [],
            "assessments": []
        }

        try:
            # Step 1: Generate curriculum
            if status_callback:
                status_callback("Analyzing topic", 10, "Creating curriculum structure...")

            curriculum = await asyncio.to_thread(
                self.curriculum_agent.create_curriculum,
                topic=topic,
                difficulty=difficulty
            )
            result["curriculum"] = curriculum

            if status_callback:
                status_callback("Curriculum created", 25, f"Created {len(curriculum.get('modules', []))} modules")

            # Step 2: Design interactive visualizations for each lesson
            if status_callback:
                status_callback("Designing interactive visualizations", 40, "Creating visual learning experiences...")

            visualizations_list = []
            total_lessons = sum(
                len(module.get("lessons", []))
                for module in curriculum.get("modules", [])
            )

            viz_count = 0
            for module in curriculum.get("modules", []):
                for lesson in module.get("lessons", []):
                    # Design interactive visualization for this specific lesson
                    viz_design = await asyncio.to_thread(
                        self.interactive_designer.design_interactive_lesson,
                        concept=lesson.get("title", ""),
                        lesson=lesson,
                        difficulty=lesson.get("difficulty", "beginner")
                    )

                    # Add lesson and module IDs
                    viz_design["lesson_id"] = lesson.get("lesson_id")
                    viz_design["module_id"] = module.get("module_id")
                    visualizations_list.append(viz_design)

                    viz_count += 1
                    progress = 25 + int((viz_count / total_lessons) * 25)
                    if status_callback:
                        status_callback(
                            "Designing visualizations",
                            progress,
                            f"Created interactive design {viz_count}/{total_lessons}"
                        )

            result["visualizations"] = {"visualizations": visualizations_list}

            if status_callback:
                status_callback("Visualizations designed", 50, f"Designed {len(visualizations_list)} interactive experiences")

            # Step 3: Generate content for each lesson
            if status_callback:
                status_callback("Generating content", 60, "Creating lesson content and components...")

            lessons_content = []
            lesson_count = 0
            total_lessons_for_content = sum(
                len(module.get("lessons", []))
                for module in curriculum.get("modules", [])
            )
            for module in curriculum.get("modules", []):
                for lesson in module.get("lessons", []):
                    # Find matching visualization
                    viz = next(
                        (v for v in visualizations_list if v.get("lesson_id") == lesson.get("lesson_id")),
                        None
                    )

                    # Generate content
                    lesson_content = await asyncio.to_thread(
                        self.content_agent.generate_content,
                        lesson=lesson,
                        module=module,
                        visualization=viz
                    )
                    lessons_content.append(lesson_content)

                    lesson_count += 1
                    progress = 60 + int((lesson_count / total_lessons_for_content) * 20)
                    if status_callback:
                        status_callback(
                            "Generating content",
                            progress,
                            f"Created content for lesson {lesson_count}/{total_lessons_for_content}"
                        )

            result["lessons"] = lessons_content

            if status_callback:
                status_callback("Content generated", 80, f"Generated {len(lessons_content)} lessons")

            # Step 4: Create assessments for each module
            if status_callback:
                status_callback("Creating assessments", 85, "Designing quizzes and challenges...")

            assessments = []
            for module in curriculum.get("modules", []):
                module_assessment = await asyncio.to_thread(
                    self.assessment_agent.create_assessments,
                    module=module
                )
                assessments.append(module_assessment)

            result["assessments"] = assessments

            if status_callback:
                status_callback("Assessments created", 95, f"Created assessments for {len(assessments)} modules")

            # Final step
            if status_callback:
                status_callback("Finalizing", 100, "Course generation complete!")

            return result

        except Exception as e:
            if status_callback:
                status_callback("Error", 0, f"Error during generation: {str(e)}")
            raise

    def get_status_summary(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Get a summary of the generated course"""
        curriculum = result.get("curriculum", {})
        modules = curriculum.get("modules", [])

        return {
            "course_title": curriculum.get("course_title", ""),
            "total_modules": len(modules),
            "total_lessons": len(result.get("lessons", [])),
            "total_visualizations": len(result.get("visualizations", {}).get("visualizations", [])),
            "total_assessments": len(result.get("assessments", [])),
            "estimated_hours": curriculum.get("estimated_total_hours", 0)
        }
