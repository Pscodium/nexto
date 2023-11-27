const prob = require("../services/prob.game.service");


exports.shuffleGameProbabilities = async (req, res) => {
    const multiplys = [];
    let shuffled = [];

    for (let i = 0; i < 100; i++) {
        const lowProbValues = await prob.impossibleProb();
        const highProbValues = await prob.highProb();

        multiplys.push(lowProbValues);
        multiplys.push(highProbValues);
    }

    if (multiplys.length > 1) {
        shuffled = await prob.shuffleArray(multiplys);
    }

    return res.json({ shuffledList: shuffled });
};