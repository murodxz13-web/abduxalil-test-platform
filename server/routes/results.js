const express = require('express');
const Result = require('../models/Result');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { testId, answers, aiModel } = req.body;
        let score = 0;
        answers.forEach((answer) => {
            if (answer.isCorrect) score++;
        });

        const result = new Result({
            userId: req.userId,
            testId,
            answers,
            score,
            aiModel,
        });

        await result.save();
        res.status(201).json({ message: 'Test submitted', result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/leaderboard/:testId', async (req, res) => {
    try {
        const results = await Result.find({ testId: req.params.testId })
            .populate('userId', 'name email')
            .sort({ score: -1 });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;