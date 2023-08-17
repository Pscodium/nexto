

exports.impossibleProb = async () => {
    const probabilities = [0.008, 0.02, 0.05, 0.1, 0,222, 0.60];

    const randomInt = randomWithProbabilities(probabilities);

    let multi = 0;
    let randomFloat;

    if (randomInt === 0) {
        multi = Math.floor(Math.random() * ( 1000 - 41.92 + 1)) + 41.92;
        randomFloat = Number((Math.random() * (1 - 0) + 0).toFixed(2));
        multi = parseFloat((multi + randomFloat).toFixed(2));
    }
    else if (randomInt === 1) {
        multi = Math.floor(Math.random() * ( 41.91 - 8.67 + 1)) + 8.67;
        randomFloat = Number((Math.random() * (1 - 0) + 0).toFixed(2));
        multi = parseFloat((multi + randomFloat).toFixed(2));
    }
    else if (randomInt === 2) {
        multi = Math.floor(Math.random() * ( 8.66 - 1.95 + 1)) + 1.95;
        randomFloat = Number((Math.random() * (1 - 0) + 0).toFixed(2));
        multi = parseFloat((multi + randomFloat).toFixed(2));
    }
    else if (randomInt === 3) {
        multi = Math.floor(Math.random() * ( 1.94 - 1.40 + 1)) + 1.40;
        randomFloat = Number((Math.random() * (1 - 0) + 0).toFixed(2));
        multi = parseFloat((multi + randomFloat).toFixed(2));
    }
    else if (randomInt === 4) {
        multi = Math.floor(Math.random() * ( 1.39 - 1.24 + 1)) + 1.24;
        randomFloat = Number((Math.random() * (1 - 0) + 0).toFixed(2));
        multi = parseFloat((multi + randomFloat).toFixed(2));
    }
    else if (randomInt === 5) {
        multi = Math.floor(Math.random() * ( 1.24 - 1 + 1)) + 1;
        randomFloat = Number((Math.random() * (1 - 0) + 0).toFixed(2));
        multi = parseFloat((multi + randomFloat).toFixed(2));
    }

    return multi;
};

exports.lowProb = async () => {

    // default probability is [0.1, 0.3, 0.6]
    // the sum of the 3 numbers must be equal to 1
    const probabilities = [0.03, 0.1, 0.37, 0.50];

    const randomInt = randomWithProbabilities(probabilities);

    let multi = 0;
    let randomFloat;

    if (randomInt === 0) {
        multi = Math.floor(Math.random() * ( 100 - 5 + 1)) + 5;
        randomFloat = Number((Math.random() * (1 - 0) + 0).toFixed(2));
        multi = parseFloat((multi + randomFloat).toFixed(2));
    }
    else if (randomInt === 1) {
        multi = Math.floor(Math.random() * ( 6 - 1.54 + 1)) + 1.54;
        randomFloat = Number((Math.random() * (1 - 0) + 0).toFixed(2));
        multi = parseFloat((multi + randomFloat).toFixed(2));
    }
    else if (randomInt === 2) {
        multi = Math.floor(Math.random() * ( 1.54 - 1.20 + 1)) + 1.20;
        randomFloat = Number((Math.random() * (1 - 0) + 0).toFixed(2));
        multi = parseFloat((multi + randomFloat).toFixed(2));
    }
    else if (randomInt === 3) {
        multi = Math.floor(Math.random() * (1.20 - 1 + 1)) + 1;
        randomFloat = Number((Math.random() * (1 - 0) + 0).toFixed(2));
        multi = parseFloat((multi + randomFloat).toFixed(2));
    }

    return multi;
};

exports.highProb = async () => {
    // default probability is [0.1, 0.3, 0.6]
    // the sum of the 3 numbers must be equal to 1
    const probabilities = [0.03, 0.1, 0.87];

    const randomInt = randomWithProbabilities(probabilities);

    let multi = 0;
    let randomFloat;

    if (randomInt === 0) {
        multi = Math.floor(Math.random() * ( 100 - 8 + 1)) + 5;
        randomFloat = Number((Math.random() * (1 - 0) + 0).toFixed(2));
        multi = parseFloat((multi + randomFloat).toFixed(2));
    }
    else if (randomInt === 1) {
        multi = Math.floor(Math.random() * ( 6 - 1.54 + 1)) + 1.54;
        randomFloat = Number((Math.random() * (1 - 0) + 0).toFixed(2));
        multi = parseFloat((multi + randomFloat).toFixed(2));
    }
    else if (randomInt === 2) {
        multi = Math.floor(Math.random() * ( 1.54 - 1 + 1)) + 1;
        randomFloat = Number((Math.random() * (1 - 0) + 0).toFixed(2));
        multi = parseFloat((multi + randomFloat).toFixed(2));
    }

    return multi;
};

exports.shuffleArray = async (array) => {
    var shuffledList = [];

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        shuffledList.push(array[j]);
    }

    return shuffledList;
};

function randomWithProbabilities(probs) {
    const totalProb = probs.reduce((acc, prob) => acc + prob, 0);
    const rand = Math.random() * totalProb;
    let cumulativeProb = 0;
    for (let i = 0; i < probs.length; i++) {
        cumulativeProb += probs[i];
        if (rand < cumulativeProb) {
            return i;
        }
    }
}
