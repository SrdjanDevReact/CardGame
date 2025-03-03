function generateShuffledDeck() {
    const suits = ["club", "diamond", "heart", "spade"];
    const ranks = [7, 8, 9, 10, 11, 12, 13, 1]; // 11 represents the Jack
    const deck = [];

    // Generate the deck
    for (const rank of ranks) {
        for (const suit of suits) {
            const card = {
                cardNumber: rank,
                cardSign: suit,
            };
            deck.push(card);
        }
    }

    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}


function getFirstXElements(arr, x) {
    return arr.slice(0, x);
}

function removeFirstXElements(arr, x) {
    arr.splice(0, x);
}


function deleteObjectFromArray(arrayOfArrays, objectToDelete) {
    const updatedArray = arrayOfArrays.map((array) =>
        array.filter((obj) => !isEqual(obj, objectToDelete))
    );

    return updatedArray;
}

// Function to compare objects
function isEqual(obj1, obj2) {
    if (obj1 && obj2) {
        return obj1.cardNumber === obj2.cardNumber && obj1.cardSign === obj2.cardSign;
    }
    return false;
}


function getOtherString(input, array) {
    if (array.length !== 2) {
        throw new Error("Array must contain exactly two strings.");
    }

    if (input === array[0]) {
        return array[1];
    } else if (input === array[1]) {
        return array[0];
    } else {
        throw new Error("Input not found in the array.");
    }
}


module.exports = { generateShuffledDeck, getFirstXElements, removeFirstXElements, deleteObjectFromArray, getOtherString };