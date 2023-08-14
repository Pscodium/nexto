/* eslint-disable @typescript-eslint/no-var-requires */
const prob = require("../services/prob.game.service");


exports.shuffleGameProbabilities = async (req, res) => {
    var multiplys = [];
    var shuffled = [];

    for (var i = 0; i < 100; i++) {
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