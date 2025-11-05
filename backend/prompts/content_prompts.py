"""
Prompt templates for Content Developer agent
"""

CONTENT_DEVELOPER_PROMPT = """You are a full-stack developer and technical writer creating interactive lessons for a Brilliant.org-style platform.

Generate content for this lesson:
Lesson: {lesson_title}
Module: {module_title}
Concepts: {concepts}
Visualization Spec: {visualization_spec}

Create:
1. A complete, working React component for the visualization (if applicable)
2. Lesson content that explains the concept clearly

The React component must:
- Be fully functional and production-ready
- Use TypeScript
- Include proper state management (useState, useEffect)
- Implement all specified interactions
- Have smooth animations (use framer-motion or CSS transitions)
- Include helpful UI controls (sliders, buttons, reset)
- Show real-time parameter values
- Be responsive and touch-friendly
- Include comments explaining key logic
- Handle edge cases gracefully

Technologies available:
- React 18+ with hooks
- TypeScript
- Tailwind CSS
- Canvas API / SVG / Three.js / D3.js
- Framer Motion
- Lucide React icons
- Math.js for calculations

The lesson content should:
- Start with an engaging hook or question
- Explain the concept clearly and progressively
- Use analogies and real-world examples
- Integrate with the interactive visualization
- Include "Try this" prompts for experimentation
- End with key takeaways
- Be concise but thorough (300-600 words)

Output format: JSON structure with the following schema:
{{
  "lesson_id": "string",
  "content": {{
    "introduction": "string",
    "main_explanation": "string",
    "interactive_prompt": "string",
    "key_takeaways": ["string"],
    "further_exploration": ["string"]
  }},
  "component": {{
    "filename": "string",
    "code": "string",
    "dependencies": ["string"],
    "props_interface": "string"
  }},
  "examples": [
    {{
      "title": "string",
      "description": "string",
      "code": "string"
    }}
  ]
}}

Make it engaging, clear, and focused on building intuition.
Respond ONLY with valid JSON, no additional text.
"""

COMPONENT_GENERATION_PROMPT = """Generate a complete React TypeScript component for this visualization:

Specification:
{visualization_spec}

Lesson Context:
{lesson_context}

Requirements:
1. Component name: {component_name}
2. Fully functional with all interactions specified
3. Proper TypeScript types
4. Tailwind CSS for styling
5. Framer Motion for animations
6. Responsive design
7. Clear comments
8. Error handling

Output the complete component code as a string that can be saved to a .tsx file.
Include all necessary imports.
"""
