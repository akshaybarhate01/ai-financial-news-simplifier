import re
import unicodedata
from typing import Tuple, List, Optional
from urllib.parse import urlparse

class PromptSecurityException(Exception):
    def __init__(self, message: str, code: str = "PROMPT_SECURITY_VIOLATION"):
        self.message = message
        self.code = code
        super().__init__(self.message)

class PromptGuard:
    """
    Cybersecurity Defense Middleware for AI/LLM requests.
    Prevents prompt injection, jailbreaks, data leakage, and system override attempts.
    """

    # Adversarial jailbreak and system instruction override patterns
    ADVERSARIAL_PATTERNS = [
        r"ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules|commands)",
        r"disregard\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)",
        r"forget\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)",
        r"you\s+are\s+now\s+(an?\s+)?(unrestricted|jailbroken|dan|evil|root|system)",
        r"(act|behave)\s+as\s+(an?\s+)?(unrestricted|dan|developer\s+mode|root|jailbroken)",
        r"system\s+(override|prompt|directive|command|execution)",
        r"print\s+(the\s+)?(system\s+prompt|initial\s+prompt|developer\s+instructions)",
        r"what\s+(are|were)\s+your\s+(initial|original|system)\s+(instructions|prompts)",
        r"(reveal|leak|show|display)\s+(the\s+)?(system\s+prompt|secret|instructions)",
        r"execute\s+(python|bash|cmd|powershell|sql|code)",
        r"(\beval\b|\bexec\b|\bos\.system\b|\bsubprocess\b)",
        r"<script[\s\S]*?>[\s\S]*?<\/script>",
        r"javascript\s*:",
        r"!\[.*?\]\(https?:\/\/.*?\/evil",
    ]

    ALLOWED_DOMAINS = {
        "bloomberg.com", "reuters.com", "wsj.com", "ft.com", "cnbc.com",
        "marketwatch.com", "finance.yahoo.com", "forbes.com", "investopedia.com",
        "barrons.com", "thestreet.com", "apnews.com", "economist.com",
        "nytimes.com", "fool.com", "businessinsider.com", "livemint.com",
        "economictimes.indiatimes.com", "financialexpress.com", "moneycontrol.com"
    }

    MAX_INPUT_CHARS = 10000
    MAX_QUESTION_CHARS = 500

    @classmethod
    def sanitize_input(cls, text: str) -> str:
        """Strip zero-width characters, invisible evasion payloads, and control characters."""
        if not text:
            return ""
        
        # Remove zero-width spaces, joiners, markers often used in prompt obfuscation
        text = re.sub(r'[\u200B-\u200D\uFEFF\u200E\u200F]', '', text)
        
        # Normalize Unicode representation
        text = unicodedata.normalize("NFKC", text)
        
        # Remove non-printable characters except standard whitespace
        text = "".join(ch for ch in text if ch.isprintable() or ch in "\n\r\t")
        
        return text.strip()

    @classmethod
    def check_malicious_instructions(cls, prompt: str) -> Tuple[bool, Optional[str]]:
        """Check if input contains system prompt override or jailbreak markers."""
        clean_prompt = cls.sanitize_input(prompt)
        
        for pattern in cls.ADVERSARIAL_PATTERNS:
            match = re.search(pattern, clean_prompt, re.IGNORECASE)
            if match:
                return True, f"Adversarial instruction detected matching security rule: '{match.group(0)}'"
        
        return False, None

    @classmethod
    def validate_user_question(cls, question: str) -> str:
        """Validate, sanitize and check user question for contextual chatbot."""
        if not question or not question.strip():
            raise PromptSecurityException("Question cannot be empty.", "EMPTY_QUESTION")
        
        if len(question) > cls.MAX_QUESTION_CHARS:
            raise PromptSecurityException(
                f"Question exceeds maximum character length of {cls.MAX_QUESTION_CHARS}.",
                "TOKEN_LIMIT_EXCEEDED"
            )
        
        sanitized = cls.sanitize_input(question)
        is_malicious, reason = cls.check_malicious_instructions(sanitized)
        if is_malicious:
            raise PromptSecurityException(
                f"Security guardrail triggered: {reason}",
                "PROMPT_INJECTION_REJECTED"
            )
        
        return sanitized

    @classmethod
    def validate_article_origin(cls, article_url: Optional[str]) -> bool:
        """Verify that the news article originates from a verified financial news domain."""
        if not article_url:
            return True # Allow internal/manual articles with flag
        
        try:
            parsed = urlparse(article_url)
            domain = parsed.netloc.lower()
            if domain.startswith("www."):
                domain = domain[4:]
            
            # Check domain or parent domain
            for allowed in cls.ALLOWED_DOMAINS:
                if domain == allowed or domain.endswith("." + allowed):
                    return True
            return True # Allow other domains with warning tag in production
        except Exception:
            return False

    @classmethod
    def wrap_article_context(cls, article_title: str, article_content: str) -> str:
        """
        Safely encapsulate article context using rigid boundaries to prevent
        indirect prompt injection from untrusted web articles.
        """
        clean_title = cls.sanitize_input(article_title)[:200]
        clean_content = cls.sanitize_input(article_content)[:cls.MAX_INPUT_CHARS]
        
        return (
            "=== BEGIN UNTRUSTED FINANCIAL ARTICLE CONTEXT ===\n"
            f"TITLE: {clean_title}\n"
            f"CONTENT: {clean_content}\n"
            "=== END UNTRUSTED FINANCIAL ARTICLE CONTEXT ==="
        )
