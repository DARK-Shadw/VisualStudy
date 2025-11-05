"""
Interactive Learning Designer Agent
This agent designs interactive, visual-first learning experiences with minimal text.
Focus: Learn by DOING, not reading.
"""
from typing import Dict, Any, List
import json
import logging

logger = logging.getLogger(__name__)

class InteractiveLearningDesigner:
    """
    Agent that designs interactive, visual learning experiences.
    Philosophy: Show, don't tell. Interact, don't read.
    """

    def __init__(self, llm):
        self.llm = llm
        logger.info("Interactive Learning Designer initialized")

    def design_interactive_lesson(
        self,
        concept: str,
        lesson: Dict[str, Any],
        difficulty: str = "beginner"
    ) -> Dict[str, Any]:
        """
        Design an interactive learning experience for a concept.
        Returns specifications for visualizations, interactions, and minimal text.
        """

        prompt = self._create_design_prompt(concept, lesson, difficulty)

        try:
            logger.info(f"Designing interactive experience for: {concept}")
            response = self.llm.invoke(prompt)
            content = response.content if hasattr(response, 'content') else str(response)

            # Clean and parse JSON
            content = content.strip()
            if content.startswith('```'):
                lines = content.split('\n')
                content = '\n'.join(lines[1:-1])

            design = json.loads(content)
            logger.info(f"Created interactive design with {len(design.get('interactions', []))} interactions")
            return design

        except Exception as e:
            logger.error(f"Error designing interactive lesson: {e}", exc_info=True)
            return self._get_fallback_design(concept, lesson)

    def _create_design_prompt(self, concept: str, lesson: Dict[str, Any], difficulty: str) -> str:
        """Create a prompt for designing interactive learning"""
        return f"""You are an expert at designing interactive, visual learning experiences like Brilliant.org.

Concept: {concept}
Lesson: {lesson.get('title', '')}
Difficulty: {difficulty}

Design an INTERACTIVE, VISUAL learning experience. CRITICAL RULES:
1. MINIMAL TEXT - Use only prompts like "Try this", "Drag to see", "What happens if..."
2. LEARN BY DOING - Every concept must have interactive exploration
3. VISUAL FIRST - Show, don't tell. Animate, don't explain.
4. PROGRESSIVE - Start simple, add complexity through interaction
5. DISCOVERY - Let user discover concepts by playing

For this concept, design:

1. **Interactive Visualization** (REQUIRED)
   - What the user sees and can manipulate
   - Type: canvas_2d, three_js_3d, svg_interactive, code_playground, or math_animation
   - Interactions: drag, click, slider, input, animation_control

2. **Interaction Steps** (3-5 progressive steps)
   - Step 1: Simple interaction to build intuition
   - Step 2-3: Add complexity
   - Step 4-5: Discover the "aha moment"

3. **Minimal Guidance Text** (< 50 words total)
   - Only essential prompts
   - Questions that guide discovery
   - NO explanations, NO definitions

4. **Code Examples** (if applicable)
   - Interactive Python code the user can modify and run
   - Visual output from code execution

5. **Challenge** (optional)
   - A problem that can only be solved by understanding the concept

Example Output Structure:
{{
  "concept": "{concept}",
  "visualization_type": "canvas_2d | three_js_3d | svg_interactive | code_playground",
  "main_interaction": {{
    "type": "drag | click | slider | code_edit",
    "description": "What user manipulates",
    "initial_state": {{}},
    "behavior": "What happens when user interacts"
  }},
  "progressive_steps": [
    {{
      "step": 1,
      "prompt": "< 10 word prompt",
      "interaction": "What to do",
      "expected_discovery": "What user learns"
    }}
  ],
  "guidance_text": [
    "Try this...",
    "What happens if...",
    "Can you..."
  ],
  "code_playground": {{
    "enabled": true/false,
    "starter_code": "python code",
    "visualization_output": "what gets rendered"
  }},
  "challenge": {{
    "prompt": "< 20 words",
    "interaction_based": true,
    "hint_sequence": ["hint1", "hint2"]
  }},
  "implementation": {{
    "technology": "react-canvas | three-js | d3-js | pyodide",
    "component_code": "React component skeleton",
    "interactions": ["list of user interactions"],
    "real_time_feedback": "how visualization updates"
  }}
}}

Focus on making this INTERACTIVE and VISUAL. The user should learn by playing, not reading.
Respond ONLY with valid JSON, no additional text."""

    def _get_fallback_design(self, concept: str, lesson: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback design if LLM fails"""
        return {
            "concept": concept,
            "visualization_type": "canvas_2d",
            "main_interaction": {
                "type": "slider",
                "description": f"Explore {concept}",
                "initial_state": {"value": 0},
                "behavior": "Updates visualization in real-time"
            },
            "progressive_steps": [
                {
                    "step": 1,
                    "prompt": "Move the slider",
                    "interaction": "Adjust value",
                    "expected_discovery": "See how it changes"
                }
            ],
            "guidance_text": [
                f"Try adjusting the values",
                "What patterns do you notice?",
                "Can you predict what happens next?"
            ],
            "code_playground": {
                "enabled": False
            },
            "implementation": {
                "technology": "react-canvas",
                "interactions": ["slider", "animation"],
                "real_time_feedback": "Visual updates on interaction"
            }
        }
