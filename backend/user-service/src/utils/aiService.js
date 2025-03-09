const openai = require("../config/openai");

const generateJobDescriptionWithAI = async (summary) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use "gpt-4" if needed
            temperature: 0.7,
            messages: [
                {
                    role: "system",
                    content: `You are an expert technical recruiter. Your task is to generate a detailed, engaging, and structured job description for job postings on LinkedIn, Indeed, and company career pages.

                    **Job Description Format**:
                    - **Introduction**: Start with an engaging paragraph summarizing the role.
                    - **Responsibilities**: A bullet-point list of key responsibilities.
                    - **Requirements**: A bullet-point list of qualifications, experience, and skills.
                    - **Preferred Qualifications**: Any additional desirable skills or certifications.
                    - **Why Join Us?**: A short section highlighting company culture and benefits.
                    
                    **Technical Skills Extraction**:
                    - Extract **at least 8** relevant skills from the job description.
                    - Classify each skill into one of these categories:
                      - "Programming Languages" (Python, Java, JavaScript, C++)
                      - "Frameworks & Libraries" (React, Angular, Django, Spring Boot)
                      - "Cloud Platforms" (AWS, Azure, GCP)
                      - "DevOps & Automation" (Kubernetes, Docker, Terraform, Jenkins)
                      - "Databases" (PostgreSQL, MySQL, MongoDB)
                      - "Security & Compliance" (OWASP, SOC2, Encryption)
                      - "AI/ML" (TensorFlow, PyTorch, NLP)
                      - "Networking" (TCP/IP, Load Balancers, DNS)
                      - "Soft Skills" (Communication, Leadership, Problem-Solving)

                    **Output must be in valid JSON format with NO extra text.**                    
                    `,
                },
                {
                    role: "user",
                    content: `Generate a job description for the following job summary:
                    
                    "${summary}"

                    **Output Format (JSON Only)**:
                    {
                      "description": "<Full job description with responsibilities, qualifications, and benefits>",
                      "skills": [
                        { "name": "<skill_name>", "mandatory": true/false, "category": "<category_name>" },
                        { "name": "<skill_name>", "mandatory": true/false, "category": "<category_name>" },
                        ... (at least 8 skills)
                      ]
                    }
                    `,
                },
            ],
        });

        if (!completion.choices || !completion.choices[0].message.content) {
            throw new Error("OpenAI response is empty or invalid.");
        }

        // Ensure JSON format and remove unnecessary markdown
        let content = completion.choices[0].message.content.trim();

        // Remove triple backticks and "json" labels if present
        if (content.startsWith("```json")) {
            content = content.replace(/^```json/, "").replace(/```$/, "").trim();
        }

        const aiResponse = JSON.parse(content);

        return {
            description: aiResponse.description,
            skills: aiResponse.skills.map((skill) => ({
                name: skill.name,
                mandatory: skill.mandatory,
                category: skill.category,
            })),
        };
    } catch (error) {
        console.error("Error generating job description:", error);
        throw new Error("Failed to generate AI job description.");
    }
};

const generateMCQsWithAI = async (topic, difficulty, count = 10) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.7,
            messages: [
                {
                    role: "system",
                    content: `You are an expert question generator for technical exams. Generate high-quality multiple-choice questions (MCQs) based on the given topic and difficulty level.

                    **MCQ Format**
                    - Each MCQ must have a question, exactly **4 answer options**, and **1 correct answer index (0-3)**.
                    - Questions should be clear and concise.
                    - The difficulty level must be respected: 
                      - EASY: Basic fundamental questions.
                      - MEDIUM: Slightly complex, requiring logical reasoning.
                      - HARD: Advanced-level questions requiring in-depth understanding.

                    **Output JSON Format**:
                    {
                      "questions": [
                        {
                          "question": "<MCQ text>",
                          "options": ["Option A", "Option B", "Option C", "Option D"],
                          "correctIndex": <0-3>,
                          "difficulty": "<EASY | MEDIUM | HARD>"
                        }
                      ]
                    }

                    **Important: Output should be in valid JSON format ONLY, no explanations, no markdown.**`
                },
                {
                    role: "user",
                    content: `Generate ${count} multiple-choice questions for the topic "${topic}" with difficulty level "${difficulty}".`
                },
            ],
        });

        if (!completion.choices || !completion.choices[0].message.content) {
            throw new Error("OpenAI response is empty or invalid.");
        }

        let content = completion.choices[0].message.content.trim();

        // Remove triple backticks and ensure clean JSON parsing
        if (content.startsWith("```json")) {
            content = content.replace(/^```json/, "").replace(/```$/, "").trim();
        }

        return JSON.parse(content).questions;
    } catch (error) {
        console.error("Error generating MCQs:", error);
        throw new Error("Failed to generate MCQs.");
    }
};

module.exports = { generateJobDescriptionWithAI, generateMCQsWithAI };
