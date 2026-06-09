import hashlib


QUESTION_BANK = {
    "DSA": "Explain how you would choose between a hash map and a balanced tree for a placement coding problem.",
    "DBMS": "How do indexes improve query performance, and when can they hurt performance?",
    "OS": "Explain process scheduling and how context switching affects system performance.",
    "CN": "Walk me through what happens when a browser opens an HTTPS website.",
    "OOP": "How would you design extensible classes for a campus placement portal?",
    "React": "How do you prevent unnecessary renders in a React dashboard?",
    "Python": "What are Python generators, and where would you use them in backend services?",
    "Machine Learning": "How would you detect overfitting and improve model generalization?",
    "HR": "Tell me about a project challenge and how you handled tradeoffs.",
    "Scenario": "A production API becomes slow during interviews. How do you diagnose it?",
}


async def generate_questions(context: dict) -> list[dict]:
    categories = _category_mix(context.get("skills", []))
    count = context.get("question_count", 8)
    questions = []
    for index, category in enumerate((categories * 3)[:count]):
        role = context["role"]
        company = context["company_mode"]
        prompt = QUESTION_BANK[category]
        if company != "Generic":
            prompt = f"In a {company}-style interview, {prompt[0].lower()}{prompt[1:]}"
        questions.append({
            "category": category,
            "prompt": f"{prompt} Relate your answer to a {role} role.",
            "expected_signals": _signals_for(category),
            "order_index": index,
        })
    return questions


async def evaluate_answer(question: str, answer: str, category: str) -> dict:
    words = len(answer.split())
    signal_words = sum(word in answer.lower() for word in ["complexity", "tradeoff", "edge", "example", "optimize", "test"])
    base = min(88, 38 + words // 3 + signal_words * 6)
    variation = int(hashlib.sha256(answer.encode()).hexdigest(), 16) % 8
    score = max(20, min(96, base + variation))
    return {
        "score": score,
        "technical_accuracy": _rubric(score, 0),
        "communication": _rubric(score, 5),
        "confidence": _rubric(score, -3),
        "depth": _rubric(score, signal_words),
        "problem_solving": _rubric(score, 2),
        "strengths": _strengths(score, category),
        "weaknesses": _weaknesses(score, category),
        "improvements": _improvements(category),
    }


async def generate_roadmap(context: dict) -> dict:
    weak_topics = context.get("weak_topics") or ["DBMS", "DSA", "Communication"]
    daily = [
        {"day": day + 1, "focus": topic, "task": f"Study fundamentals, solve 3 problems, and explain one concept aloud."}
        for day, topic in enumerate((weak_topics * 3)[:7])
    ]
    weekly = [
        {"week": 1, "goal": "Repair fundamentals and build concise answer templates."},
        {"week": 2, "goal": "Practice timed mixed interviews and review feedback patterns."},
        {"week": 3, "goal": "Simulate company-specific rounds and improve weak rubric areas."},
    ]
    return {
        "title": f"{context.get('focus_role', 'SDE')} readiness sprint",
        "weak_topics": weak_topics,
        "daily_plan": daily,
        "weekly_plan": weekly,
        "priority_topics": weak_topics[:5],
        "suggested_problems": [
            {"platform": "LeetCode", "topic": topic, "count": 5, "difficulty": "Easy-Medium"}
            for topic in weak_topics[:4]
        ],
        "summary": "Focus on the lowest scoring topics first, then alternate interview simulation with targeted drills.",
    }


def _category_mix(skills: list[str]) -> list[str]:
    selected = ["DSA", "DBMS", "OS", "CN", "OOP", "HR", "Scenario"]
    if "react" in skills:
        selected.insert(1, "React")
    if "python" in skills:
        selected.insert(2, "Python")
    if "machine learning" in skills:
        selected.insert(3, "Machine Learning")
    return selected


def _signals_for(category: str) -> list[str]:
    defaults = ["clear concept explanation", "tradeoff awareness", "real project example"]
    return {
        "DSA": ["time complexity", "space complexity", "edge cases"],
        "DBMS": ["normalization", "index tradeoffs", "query optimization"],
        "React": ["state management", "memoization", "component boundaries"],
        "Machine Learning": ["metrics", "bias variance", "validation strategy"],
    }.get(category, defaults)


def _rubric(score: int, delta: int) -> int:
    return max(10, min(100, score + delta))


def _strengths(score: int, category: str) -> list[str]:
    if score >= 75:
        return [f"Clear grasp of {category} fundamentals.", "Answer included useful structure and practical signals."]
    return ["Attempted the core concept and showed baseline familiarity."]


def _weaknesses(score: int, category: str) -> list[str]:
    if score >= 75:
        return ["Could add sharper edge-case analysis or measurable project evidence."]
    return [f"Needs deeper {category} reasoning.", "Answer should include tradeoffs, examples, and cleaner sequencing."]


def _improvements(category: str) -> list[str]:
    return [
        f"Revise {category} fundamentals with one-page notes.",
        "Practice a 90-second structured explanation: concept, example, tradeoff, edge case.",
        "Add complexity, constraints, or evaluation metrics where relevant.",
    ]
