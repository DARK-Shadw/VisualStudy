"""
Content Developer Agent
Responsible for creating lesson content and React components
"""
from crewai import Agent
from typing import Dict, Any
import json
from prompts.content_prompts import CONTENT_DEVELOPER_PROMPT

class ContentDeveloper:
    """Agent that creates lesson content and interactive components"""

    def __init__(self, llm):
        """
        Initialize the Content Developer agent

        Args:
            llm: Language model instance
        """
        self.llm = llm
        self.agent = self._create_agent()

    def _create_agent(self) -> Agent:
        """Create the CrewAI agent"""
        return Agent(
            role='Content Developer',
            goal='Create clear, engaging lessons with working interactive components',
            backstory="""You are a full-stack developer and technical writer with expertise
            in React, TypeScript, and educational content creation. You've built interactive
            learning platforms and have a talent for explaining complex concepts simply.
            You write production-ready code that is clean, well-documented, and user-friendly.
            You understand learning psychology and create content that builds intuition through
            progressive disclosure and hands-on experimentation.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )

    def generate_content(
        self,
        lesson: Dict[str, Any],
        module: Dict[str, Any],
        visualization: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Generate content for a lesson

        Args:
            lesson: Lesson information
            module: Module information
            visualization: Optional visualization specification

        Returns:
            Dictionary containing lesson content and component code
        """
        prompt = CONTENT_DEVELOPER_PROMPT.format(
            lesson_title=lesson["title"],
            module_title=module["title"],
            concepts=json.dumps(lesson.get("concepts_covered", [])),
            visualization_spec=json.dumps(visualization, indent=2) if visualization else "None"
        )

        try:
            response = self.llm.invoke(prompt)
            content = response.content if hasattr(response, 'content') else str(response)

            # Clean response
            content = content.strip()
            if content.startswith('```'):
                lines = content.split('\n')
                content = '\n'.join(lines[1:-1])

            lesson_content = json.loads(content)
            return lesson_content

        except json.JSONDecodeError as e:
            print(f"Error parsing content JSON: {e}")
            print(f"Raw response: {content}")
            return self._get_fallback_content(lesson, module, visualization)

        except Exception as e:
            print(f"Error generating content: {e}")
            return self._get_fallback_content(lesson, module, visualization)

    def _get_fallback_content(
        self,
        lesson: Dict[str, Any],
        module: Dict[str, Any],
        visualization: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Provide fallback content structure"""
        lesson_title = lesson["title"]
        module_title = module["title"]

        return {
            "lesson_id": lesson["lesson_id"],
            "content": {
                "introduction": f"Welcome to {lesson_title}. In this lesson, we'll explore key concepts that are fundamental to {module_title}.",
                "main_explanation": f"""
{lesson_title} is an important concept in {module_title}.

**Key Points:**
- Understanding this concept helps you build intuition
- We'll explore it through interactive visualization
- You'll be able to experiment and see results in real-time

**Why It Matters:**
This concept has practical applications in many real-world scenarios.
                """,
                "interactive_prompt": "Try adjusting the parameters below to see how they affect the outcome. Experiment with different values!",
                "key_takeaways": [
                    f"You've learned the fundamentals of {lesson_title}",
                    "You can apply this concept to solve problems",
                    "Interactive exploration deepens understanding"
                ],
                "further_exploration": [
                    "Try different parameter combinations",
                    "Think about real-world applications",
                    "Move on to the next lesson to build on this knowledge"
                ]
            },
            "component": {
                "filename": f"{lesson['lesson_id'].replace('.', '_')}_visualization.tsx",
                "code": self._generate_fallback_component(lesson, visualization),
                "dependencies": ["react", "framer-motion"],
                "props_interface": "interface Props {}"
            },
            "examples": [
                {
                    "title": "Basic Example",
                    "description": "A simple demonstration of the concept",
                    "code": "// Example code here"
                }
            ]
        }

    def _generate_fallback_component(
        self,
        lesson: Dict[str, Any],
        visualization: Dict[str, Any] = None
    ) -> str:
        """Generate a basic fallback component"""
        component_name = lesson["lesson_id"].replace('.', '_').title() + "Visualization"

        return f"""import React, {{ useState }} from 'react';
import {{ motion }} from 'framer-motion';

interface {component_name}Props {{}}

export const {component_name}: React.FC<{component_name}Props> = () => {{
  const [value, setValue] = useState(50);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-surface rounded-lg">
      <h3 className="text-2xl font-bold mb-4 text-primary">
        {lesson['title']}
      </h3>

      <motion.div
        className="w-64 h-64 bg-accent/20 rounded-lg flex items-center justify-center mb-6"
        animate={{{{ scale: value / 50 }}}}
        transition={{{{ duration: 0.3 }}}}
      >
        <div className="text-4xl font-bold text-accent">
          {{value}}
        </div>
      </motion.div>

      <div className="w-full max-w-md">
        <label className="block text-sm font-medium mb-2">
          Adjust Value: {{value}}
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={{value}}
          onChange={{(e) => setValue(Number(e.target.value))}}
          className="w-full"
        />
      </div>

      <button
        onClick={{() => setValue(50)}}
        className="mt-6 btn-primary"
      >
        Reset
      </button>
    </div>
  );
}};

export default {component_name};
"""

    def get_agent(self) -> Agent:
        """Get the CrewAI agent instance"""
        return self.agent
