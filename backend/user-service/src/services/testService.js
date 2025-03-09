const prisma = require("../config/db");
const { generateMCQsWithAI } = require("../utils/aiService");

exports.generateMCQs = async (topic, difficulty, count = 10) => {
    try {
        // Generate MCQs using AI
        const mcqs = await generateMCQsWithAI(topic, difficulty, count);

        // Store MCQs in the database
        const storedMCQs = await prisma.testQuestion.createMany({
            data: mcqs.map(mcq => ({
                question: mcq.question,
                options: mcq.options,
                correctIndex: mcq.correctIndex,
                difficulty: difficulty.toUpperCase(), // Ensure enum match
                topic
            }))
        });

        return storedMCQs;
    } catch (error) {
        console.error("Error storing MCQs:", error);
        throw new Error("Failed to store MCQs.");
    }
};
