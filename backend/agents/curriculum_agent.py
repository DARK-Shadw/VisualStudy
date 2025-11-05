"""
Curriculum Architect Agent
Responsible for creating comprehensive learning paths
"""
from typing import Dict, Any, Optional
import json
import logging
from prompts.curriculum_prompts import CURRICULUM_ARCHITECT_PROMPT

logger = logging.getLogger(__name__)

class CurriculumArchitect:
    """Agent that designs comprehensive curriculum structures"""

    def __init__(self, llm):
        """
        Initialize the Curriculum Architect agent

        Args:
            llm: Language model instance
        """
        self.llm = llm
        logger.info("Curriculum Architect initialized")

    def create_curriculum(
        self,
        topic: str,
        difficulty: str = "intermediate",
        user_background: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a comprehensive curriculum for a given topic

        Args:
            topic: The subject to create curriculum for
            difficulty: Target difficulty level
            user_background: Optional user background information

        Returns:
            Dictionary containing the curriculum structure
        """
        prompt = CURRICULUM_ARCHITECT_PROMPT.format(
            topic=topic,
            difficulty=difficulty,
            user_background=user_background or "motivated beginner to intermediate learner"
        )

        try:
            logger.info(f"Creating curriculum for topic: {topic}, difficulty: {difficulty}")
            response = self.llm.invoke(prompt)
            content = response.content if hasattr(response, 'content') else str(response)

            # Parse JSON response
            # Clean response - remove markdown code blocks if present
            content = content.strip()
            if content.startswith('```'):
                # Remove ```json and ``` markers
                lines = content.split('\n')
                content = '\n'.join(lines[1:-1])

            curriculum = json.loads(content)
            logger.info(f"Successfully created curriculum with {len(curriculum.get('modules', []))} modules")
            return curriculum

        except json.JSONDecodeError as e:
            logger.error(f"Error parsing curriculum JSON: {e}")
            logger.error(f"Raw response: {content[:500]}...")  # Log first 500 chars
            # Return a basic structure if parsing fails
            return self._get_fallback_curriculum(topic, difficulty)

        except Exception as e:
            logger.error(f"Error creating curriculum: {e}", exc_info=True)
            return self._get_fallback_curriculum(topic, difficulty)

    def _get_fallback_curriculum(self, topic: str, difficulty: str) -> Dict[str, Any]:
        """Provide a basic fallback curriculum structure"""
        return {
            "course_title": topic,
            "description": f"A comprehensive course on {topic}",
            "difficulty": difficulty,
            "estimated_total_hours": 20,
            "prerequisites": [],
            "learning_outcomes": [
                f"Understand fundamental concepts of {topic}",
                f"Apply {topic} to real-world problems",
                f"Build confidence in {topic}"
            ],
            "modules": [
                {
                    "module_id": 1,
                    "title": f"Introduction to {topic}",
                    "description": "Foundational concepts and principles",
                    "duration_hours": 3,
                    "learning_objectives": [
                        "Understand basic terminology",
                        "Recognize core concepts"
                    ],
                    "key_concepts": ["Foundations", "Core principles"],
                    "needs_visualization": True,
                    "visualization_suggestions": ["Interactive diagrams"],
                    "lessons": [
                        {
                            "lesson_id": "1.1",
                            "title": "Getting Started",
                            "description": "Introduction to the topic",
                            "duration_minutes": 30,
                            "concepts_covered": ["Basics"],
                            "practical_applications": ["Real-world examples"],
                            "difficulty": "beginner"
                        }
                    ]
                }
            ]
        }
