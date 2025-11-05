"""
Visualization Designer Agent
Responsible for designing interactive visualizations
"""
import logging
from typing import Dict, Any, List
import json
from prompts.visualization_prompts import VISUALIZATION_DESIGNER_PROMPT

logger = logging.getLogger(__name__)

class VisualizationDesigner:
    """Agent that designs engaging interactive visualizations"""

    def __init__(self, llm):
        """
        Initialize the Visualization Designer agent

        Args:
            llm: Language model instance
        """
        self.llm = llm
        logger.info("Visualization Designer initialized")

    def design_visualizations(self, curriculum: Dict[str, Any]) -> Dict[str, Any]:
        """
        Design visualizations for a curriculum

        Args:
            curriculum: The curriculum structure

        Returns:
            Dictionary containing visualization specifications
        """
        prompt = VISUALIZATION_DESIGNER_PROMPT.format(
            curriculum_json=json.dumps(curriculum, indent=2)
        )

        try:
            response = self.llm.invoke(prompt)
            content = response.content if hasattr(response, 'content') else str(response)

            # Clean response - remove markdown code blocks if present
            content = content.strip()
            if content.startswith('```'):
                lines = content.split('\n')
                content = '\n'.join(lines[1:-1])

            visualizations = json.loads(content)
            return visualizations

        except json.JSONDecodeError as e:
            print(f"Error parsing visualizations JSON: {e}")
            print(f"Raw response: {content}")
            return self._get_fallback_visualizations(curriculum)

        except Exception as e:
            print(f"Error designing visualizations: {e}")
            return self._get_fallback_visualizations(curriculum)

    def _get_fallback_visualizations(self, curriculum: Dict[str, Any]) -> Dict[str, Any]:
        """Provide fallback visualization structure"""
        visualizations = []

        for module in curriculum.get("modules", []):
            for lesson in module.get("lessons", []):
                if module.get("needs_visualization", False):
                    visualizations.append({
                        "lesson_id": lesson["lesson_id"],
                        "module_id": module["module_id"],
                        "concept": lesson["title"],
                        "viz_type": "interactive_2d_canvas",
                        "technology": "react-canvas",
                        "interactions": ["click", "drag"],
                        "description": f"Interactive visualization for {lesson['title']}",
                        "difficulty": lesson.get("difficulty", "beginner"),
                        "visual_elements": {
                            "objects": ["shapes", "lines"],
                            "colors": ["#4338ca", "#06b6d4"],
                            "animations": ["smooth transitions"]
                        },
                        "user_controls": [
                            {
                                "type": "slider",
                                "parameter": "value",
                                "range": {"min": 0, "max": 100},
                                "default": 50,
                                "description": "Adjust parameter"
                            }
                        ],
                        "code_structure": {
                            "components": ["Canvas", "Controls"],
                            "state_management": ["useState"],
                            "key_functions": ["render", "update"]
                        },
                        "learning_objectives": lesson.get("concepts_covered", []),
                        "progressive_steps": [
                            "Show basic concept",
                            "Add interactivity",
                            "Reveal complexity"
                        ]
                    })

        return {"visualizations": visualizations}

