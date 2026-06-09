def question_generation_prompt(context: dict) -> str:
    return (
        "Generate deterministic JSON interview questions. "
        f"Role: {context['role']}; difficulty: {context['difficulty']}; "
        f"company: {context['company_mode']}; skills: {', '.join(context.get('skills', []))}. "
        "Return categories, prompts, and expected_signals only."
    )


def evaluation_prompt(question: str, answer: str) -> str:
    return (
        "Evaluate this interview answer as strict JSON with score, rubric fields, "
        "strengths, weaknesses, and improvements. "
        f"Question: {question}\nAnswer: {answer}"
    )


def roadmap_prompt(context: dict) -> str:
    return (
        "Generate a placement preparation roadmap as JSON. "
        f"Role: {context['focus_role']}; weak topics: {', '.join(context['weak_topics'])}."
    )
