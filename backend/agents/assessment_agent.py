"""
Assessment Creator Agent
Responsible for creating engaging assessments and quizzes
"""
import logging
from typing import Dict, Any, List
import json
from prompts.assessment_prompts import ASSESSMENT_CREATOR_PROMPT

logger = logging.getLogger(__name__)
class AssessmentCreator:
    """Agent that creates effective learning assessments"""

    def __init__(self, llm):
        """
        Initialize the Assessment Creator agent

        Args:
            llm: Language model instance
        """
        self.llm = llm
        logger.info(f"{self.__class__.__name__} initialized")


    def create_assessments(self, module: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create assessments for a module

        Args:
            module: Module information with lessons

        Returns:
            Dictionary containing assessment questions and mini-project
        """
        prompt = ASSESSMENT_CREATOR_PROMPT.format(
            module_title=module["title"],
            learning_objectives=json.dumps(module.get("learning_objectives", [])),
            key_concepts=json.dumps(module.get("key_concepts", [])),
            lessons=json.dumps(module.get("lessons", []), indent=2)
        )

        try:
            response = self.llm.invoke(prompt)
            content = response.content if hasattr(response, 'content') else str(response)

            # Clean response
            content = content.strip()
            if content.startswith('```'):
                lines = content.split('\n')
                content = '\n'.join(lines[1:-1])

            assessments = json.loads(content)
            return assessments

        except json.JSONDecodeError as e:
            print(f"Error parsing assessments JSON: {e}")
            print(f"Raw response: {content}")
            return self._get_fallback_assessments(module)

        except Exception as e:
            print(f"Error creating assessments: {e}")
            return self._get_fallback_assessments(module)

    def _get_fallback_assessments(self, module: Dict[str, Any]) -> Dict[str, Any]:
        """Provide fallback assessment structure"""
        module_id = module.get("module_id", 1)
        module_title = module.get("title", "Module")

        return {
            "module_id": module_id,
            "assessments": [
                {
                    "question_id": f"q{module_id}_1",
                    "question_type": "multiple_choice",
                    "difficulty": "medium",
                    "question_text": f"What is a key concept in {module_title}?",
                    "visual_context": None,
                    "options": [
                        {
                            "id": "a",
                            "text": "Option A",
                            "is_correct": True,
                            "explanation": "This is correct because it demonstrates understanding."
                        },
                        {
                            "id": "b",
                            "text": "Option B",
                            "is_correct": False,
                            "explanation": "This is not quite right. Consider how the concept applies."
                        },
                        {
                            "id": "c",
                            "text": "Option C",
                            "is_correct": False,
                            "explanation": "This misses a key aspect of the concept."
                        }
                    ],
                    "interactive_component": None,
                    "hints": [
                        {
                            "level": 1,
                            "text": "Think about the fundamental principle."
                        },
                        {
                            "level": 2,
                            "text": "Consider how this applies in practice."
                        }
                    ],
                    "correct_feedback": "Excellent! You've understood the concept correctly.",
                    "incorrect_feedback": "Not quite. Review the lesson and try again.",
                    "concepts_tested": module.get("key_concepts", []),
                    "estimated_time_minutes": 2
                }
            ],
            "mini_project": {
                "title": f"{module_title} Challenge",
                "description": f"Apply your knowledge of {module_title} to solve a real-world problem.",
                "requirements": [
                    "Demonstrate understanding of key concepts",
                    "Apply concepts creatively",
                    "Explain your reasoning"
                ],
                "starter_code": None,
                "success_criteria": [
                    "Correct application of concepts",
                    "Clear explanation",
                    "Creative approach"
                ],
                "estimated_time_minutes": 15
            }
        }

