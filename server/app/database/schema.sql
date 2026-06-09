CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    college VARCHAR(160),
    branch VARCHAR(120),
    graduation_year INTEGER
);

CREATE INDEX ix_users_email ON users(email);

CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    raw_text TEXT NOT NULL,
    skills JSONB NOT NULL DEFAULT '[]',
    technologies JSONB NOT NULL DEFAULT '[]',
    projects JSONB NOT NULL DEFAULT '[]',
    experience JSONB NOT NULL DEFAULT '[]',
    certifications JSONB NOT NULL DEFAULT '[]',
    dominant_domains JSONB NOT NULL DEFAULT '[]',
    suitable_roles JSONB NOT NULL DEFAULT '[]',
    missing_keywords JSONB NOT NULL DEFAULT '[]',
    ats_score INTEGER NOT NULL DEFAULT 0,
    summary TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_resumes_user_id ON resumes(user_id);

CREATE TABLE interviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(120) NOT NULL,
    difficulty VARCHAR(30) NOT NULL DEFAULT 'medium',
    company_mode VARCHAR(80) NOT NULL DEFAULT 'Generic',
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    overall_score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX ix_interviews_user_id ON interviews(user_id);

CREATE TABLE interview_questions (
    id SERIAL PRIMARY KEY,
    interview_id INTEGER NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    category VARCHAR(80) NOT NULL,
    prompt TEXT NOT NULL,
    expected_signals JSONB NOT NULL DEFAULT '[]',
    order_index INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX ix_questions_interview_id ON interview_questions(interview_id);

CREATE TABLE interview_answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_answers_question_id ON interview_answers(question_id);

CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    interview_id INTEGER NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    answer_id INTEGER NOT NULL REFERENCES interview_answers(id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    technical_accuracy INTEGER NOT NULL DEFAULT 0,
    communication INTEGER NOT NULL DEFAULT 0,
    confidence INTEGER NOT NULL DEFAULT 0,
    depth INTEGER NOT NULL DEFAULT 0,
    problem_solving INTEGER NOT NULL DEFAULT 0,
    strengths JSONB NOT NULL DEFAULT '[]',
    weaknesses JSONB NOT NULL DEFAULT '[]',
    improvements JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_evaluations_interview_id ON evaluations(interview_id);

CREATE TABLE roadmaps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(160) NOT NULL,
    focus_role VARCHAR(120) NOT NULL DEFAULT 'SDE',
    weak_topics JSONB NOT NULL DEFAULT '[]',
    daily_plan JSONB NOT NULL DEFAULT '[]',
    weekly_plan JSONB NOT NULL DEFAULT '[]',
    priority_topics JSONB NOT NULL DEFAULT '[]',
    suggested_problems JSONB NOT NULL DEFAULT '[]',
    summary TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_roadmaps_user_id ON roadmaps(user_id);
