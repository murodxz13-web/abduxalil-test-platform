const pdf = require('pdf-parse');

const parsePDF = async (buffer) => {
    try {
        const data = await pdf(buffer);
        const text = data.text;
        const lines = text.split('\n');
        const questions = lines.filter((line) => line.trim().endsWith('?')).map((line, index) => ({
            id: index,
            questionText: line.trim(),
            type: 'short-answer',
        }));
        return questions;
    } catch (error) {
        throw new Error('Error parsing PDF: ' + error.message);
    }
};

module.exports = { parsePDF };