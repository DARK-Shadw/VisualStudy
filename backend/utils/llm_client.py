"""
LLM Client for Gemini and OpenRouter
"""
import os
from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI

class LLMClient:
    """Unified LLM client supporting multiple providers"""

    def __init__(self, provider: Optional[str] = None):
        """
        Initialize LLM client
        Args:
            provider: 'gemini' or 'openrouter' (defaults to env var LLM_PROVIDER)
        """
        self.provider = provider or os.getenv("LLM_PROVIDER", "gemini")
        self.llm = self._initialize_llm()

    def _initialize_llm(self):
        """Initialize the appropriate LLM based on provider"""
        if self.provider == "gemini":
            return self._initialize_gemini()
        elif self.provider == "openrouter":
            return self._initialize_openrouter()
        else:
            raise ValueError(f"Unsupported LLM provider: {self.provider}")

    def _initialize_gemini(self):
        """Initialize Google Gemini"""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")

        model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

        return ChatGoogleGenerativeAI(
            model=model,
            google_api_key=api_key,
            temperature=0.7,
            convert_system_message_to_human=True
        )

    def _initialize_openrouter(self):
        """Initialize OpenRouter"""
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise ValueError("OPENROUTER_API_KEY not found in environment")

        model = os.getenv("OPENROUTER_MODEL", "mistralai/mistral-7b-instruct")

        return ChatOpenAI(
            model=model,
            openai_api_key=api_key,
            openai_api_base="https://openrouter.ai/api/v1",
            temperature=0.7
        )

    def get_llm(self):
        """Get the initialized LLM instance"""
        return self.llm

    def invoke(self, prompt: str) -> str:
        """
        Invoke the LLM with a prompt
        Args:
            prompt: The prompt string
        Returns:
            The LLM response as a string
        """
        response = self.llm.invoke(prompt)
        return response.content if hasattr(response, 'content') else str(response)

# Singleton instance
_llm_client = None

def get_llm_client() -> LLMClient:
    """Get or create the global LLM client instance"""
    global _llm_client
    if _llm_client is None:
        _llm_client = LLMClient()
    return _llm_client
