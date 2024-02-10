const prob = require("../services/prob.game.service");


exports.crashProbs = async (req, res) => {
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

    return res.json({ probs: shuffled });
};

exports.crashProbsV1 = async (req, res) => {
    const multiplys = [];
    let shuffled = [];

    for (let i = 0; i < 100; i++) {
        const lowProbValues = await prob.probabilityToGetNumberOne(prob.impossibleProb);
        const highProbValues = await prob.probabilityToGetNumberOne(prob.highProb);
        const luckyProbValues = await prob.probabilityToGetNumberOne(prob.lowProb);

        multiplys.push(lowProbValues);
        multiplys.push(highProbValues);
        multiplys.push(luckyProbValues);
    }

    if (multiplys.length > 1) {
        shuffled = await prob.shuffleArray(multiplys);
    }

    return res.json({ probs: shuffled });
};