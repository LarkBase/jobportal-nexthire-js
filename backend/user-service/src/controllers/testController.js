const testService = require("../services/testService");

exports.generateMCQs = async (req, res) => {
    try {
        const { topic, difficulty, count } = req.body;

        if (!topic || !difficulty) {
            return res.status(400).json({ error: "Topic and difficulty are required." });
        }

        const mcqs = await testService.generateMCQs(topic, difficulty, count);
        res.status(201).json({ message: "MCQs generated and stored.", mcqs });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate MCQs." });
    }
};
