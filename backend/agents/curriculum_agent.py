"""
Curriculum Architect Agent
Responsible for creating comprehensive learning paths
"""
from crewai import Agent
from typing import Dict, Any, Optional
import json
from prompts.curriculum_prompts import CURRICULUM_ARCHITECT_PROMPT

class CurriculumArchitect:
    """Agent that designs comprehensive curriculum structures"""

    def __init__(self, llm):
        """
        Initialize the Curriculum Architect agent

        Args:
            llm: Language model instance
        """
        self.llm = llm
        self.agent = self._create_agent()

    def _create_agent(self) -> Agent:
        """Create the CrewAI agent"""
        return Agent(
            role='Curriculum Architect',
            goal='Create comprehensive, progressive learning paths that engage students',
            backstory="""You are an expert educator with 20 years of experience in curriculum
            design. You've worked with leading educational institutions and have a deep
            understanding of how people learn. You specialize in creating progressive learning
            paths that build intuition and deep understanding. You're inspired by Brilliant.org's
            approach to making complex topics accessible and engaging.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )

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
            return curriculum

        except json.JSONDecodeError as e:
            print(f"Error parsing curriculum JSON: {e}")
            print(f"Raw response: {content}")
            # Return a basic structure if parsing fails
            return self._get_fallback_curriculum(topic, difficulty)

        except Exception as e:
            print(f"Error creating curriculum: {e}")
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

    def get_agent(self) -> Agent:
        """Get the CrewAI agent instance"""
        return self.agent
