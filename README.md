# VisualStudy - AI-Powered Interactive Learning Platform

An innovative learning platform that uses AI agents to generate personalized, visual, and engaging educational content similar to Brilliant.org.

## 🎯 Features

- **AI-Generated Courses**: Create comprehensive courses on any topic using advanced AI
- **Multi-Agent System**: Powered by CrewAI with specialized agents:
  - Curriculum Architect: Designs progressive learning paths
  - Visualization Designer: Creates interactive visual experiences
  - Content Developer: Generates lessons and React components
  - Assessment Creator: Builds engaging quizzes and challenges
- **Interactive Visualizations**: Hands-on experiments with Canvas, SVG, Three.js, and D3.js
- **Real-time Progress Tracking**: Monitor your learning journey
- **Responsive Design**: Beautiful UI inspired by Brilliant.org

## 🏗️ Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Zustand (state management)
- React Router
- Three.js, D3.js, Recharts (visualizations)
- KaTeX (math rendering)

### Backend
- FastAPI (Python)
- CrewAI (multi-agent orchestration)
- LangChain
- Google Gemini / OpenRouter LLM
- SQLite / PostgreSQL

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Google Gemini API key or OpenRouter API key

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd VisualStudy
```

### 2. Set Up Frontend

```bash
# Install dependencies
npm install

# The frontend will run on http://localhost:5173
```

### 3. Set Up Backend

```bash
# Create Python virtual environment
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Go back to root directory
cd ..
```

### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API keys
```

Required environment variables:

```env
# LLM Configuration
LLM_PROVIDER=gemini  # or openrouter
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Server Configuration
BACKEND_PORT=8000
FRONTEND_PORT=5173
```

#### Getting API Keys

**Google Gemini (Recommended for Development)**:
1. Visit https://ai.google.dev/
2. Sign in with your Google account
3. Go to "Get API Key"
4. Create a new API key
5. Free tier includes generous usage limits

**OpenRouter (Alternative)**:
1. Visit https://openrouter.ai/
2. Sign up for an account
3. Go to Keys section
4. Create a new API key
5. Supports various free and paid models

### 5. Run the Application

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
# Make sure virtual environment is activated
python main.py
```

Backend will run on `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📖 Usage

1. **Enter a Topic**: On the home page, enter any topic you want to learn (e.g., "Linear Algebra for Machine Learning")

2. **Select Difficulty**: Choose between Beginner, Intermediate, or Advanced

3. **Generate Course**: Click "Generate Course" and watch as AI agents create your personalized learning path

4. **Follow the Generation**: See real-time progress as agents:
   - Analyze the topic
   - Create a comprehensive syllabus
   - Design interactive visualizations
   - Generate lesson content and code
   - Create assessments

5. **Start Learning**: Once complete, explore your course with:
   - Structured modules and lessons
   - Interactive visualizations
   - Progress tracking
   - Assessments and challenges

## 🏛️ Project Structure

```
VisualStudy/
├── backend/
│   ├── agents/              # AI agent implementations
│   │   ├── curriculum_agent.py
│   │   ├── visualization_agent.py
│   │   ├── content_agent.py
│   │   └── assessment_agent.py
│   ├── workflows/           # Agent orchestration
│   │   └── course_generation_flow.py
│   ├── prompts/             # LLM prompts
│   ├── utils/               # Utilities
│   │   └── llm_client.py
│   ├── main.py              # FastAPI server
│   └── requirements.txt
│
├── src/
│   ├── pages/               # React pages
│   │   ├── HomePage.tsx
│   │   ├── CourseGenerationPage.tsx
│   │   └── CoursePage.tsx
│   ├── components/          # Reusable components
│   ├── store/               # Zustand stores
│   │   ├── courseStore.ts
│   │   └── progressStore.ts
│   ├── services/            # API services
│   │   └── api.ts
│   ├── types/               # TypeScript types
│   └── App.tsx
│
└── public/                  # Static assets
```

## 🔧 Configuration

### LLM Provider Selection

Edit `.env` to choose your LLM provider:

```env
# Use Gemini (recommended)
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-1.5-flash

# OR use OpenRouter
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=your_key
OPENROUTER_MODEL=mistralai/mistral-7b-instruct
```

### Feature Flags

```env
ENABLE_3D_VISUALIZATIONS=true
ENABLE_COLLABORATIVE_LEARNING=false
```

## 📡 API Endpoints

### Backend API

- `GET /` - Health check
- `POST /api/courses/generate` - Start course generation
- `GET /api/courses/{course_id}/status` - Check generation status
- `GET /api/courses/{course_id}` - Get complete course data
- `GET /api/health` - Backend health with configuration status

## 🧪 Development

### Frontend Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development

```bash
# Run with auto-reload
cd backend
uvicorn main:app --reload --port 8000

# Run tests (when available)
pytest
```

## 🎨 Customization

### Adding New Visualizations

1. Create a new component in `src/components/visualizations/interactive/`
2. Use Canvas API, SVG, Three.js, or D3.js
3. Follow the existing component patterns

### Customizing Agent Prompts

Edit prompt templates in `backend/prompts/`:
- `curriculum_prompts.py`
- `visualization_prompts.py`
- `content_prompts.py`
- `assessment_prompts.py`

## 🐛 Troubleshooting

### Backend Issues

**"GEMINI_API_KEY not found"**
- Make sure `.env` file exists in the root directory
- Verify the API key is correctly set

**Port already in use**
- Change `BACKEND_PORT` in `.env`
- Or kill the process using port 8000

### Frontend Issues

**Build errors**
- Delete `node_modules` and run `npm install` again
- Clear browser cache

**API connection refused**
- Ensure backend is running on the correct port
- Check CORS settings in `backend/main.py`

## 📚 Resources

- [CrewAI Documentation](https://docs.crewai.com/)
- [Google Gemini API](https://ai.google.dev/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Three.js Examples](https://threejs.org/examples/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by [Brilliant.org](https://brilliant.org/)
- Built with CrewAI and LangChain
- Powered by Google Gemini

## 🔮 Future Enhancements

- [ ] User authentication and course saving
- [ ] Social features and progress sharing
- [ ] AI tutor for answering questions
- [ ] Voice narration for lessons
- [ ] Community-generated courses
- [ ] Gamification (badges, streaks)
- [ ] Mobile app
- [ ] Collaborative learning features
- [ ] Advanced analytics dashboard
- [ ] Export courses to PDF/ePub

---

**Happy Learning! 🎓✨**

For questions or support, please open an issue on GitHub.
