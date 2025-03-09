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

module.exports = { generateJobDescriptionWithAI };
